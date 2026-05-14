import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { DispatchService } from '@shared/services/results.service';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { DispatchRecord } from '@shared/models/cms.models';

type Filter = 'all' | 'pending' | 'dispatched';

@Component({
  selector: 'app-dispatch',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {

  filter: Filter = 'all';
  query = '';

  selected = new Set<string>();
  records$!: Observable<DispatchRecord[]>;

  constructor(
    private svc: DispatchService,
    private modal: ModalService,
    private toast: ToastService
  ) {}

  ngOnInit(): void { this.records$ = this.svc.records$; }

  filtered(records: DispatchRecord[]): DispatchRecord[] {
    return records.filter(r => {
      if (this.filter === 'pending' && r.dispatched) { return false; }
      if (this.filter === 'dispatched' && !r.dispatched) { return false; }
      if (this.query) {
        const q = this.query.toLowerCase();
        return r.patient.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.tests.toLowerCase().includes(q);
      }
      return true;
    });
  }

  toggleSelect(id: string): void {
    if (this.selected.has(id)) { this.selected.delete(id); } else { this.selected.add(id); }
  }

  toggleSelectAll(records: DispatchRecord[]): void {
    if (this.selected.size === records.length) { this.selected.clear(); }
    else { records.forEach(r => this.selected.add(r.id)); }
  }

  bulkPrint(): void {
    this.toast.success(`Printing ${this.selected.size} reports`);
    this.selected.forEach(id => this.svc.markDispatched(id));
    this.selected.clear();
  }

  printAllPending(records: DispatchRecord[]): void {
    const pending = records.filter(r => !r.dispatched);
    pending.forEach(r => this.svc.markDispatched(r.id));
    this.toast.success(`Dispatched ${pending.length} pending reports`);
  }

  openReport(r: DispatchRecord): void { this.modal.open('dp-report', { record: r }); }
  markSingle(r: DispatchRecord): void {
    this.svc.markDispatched(r.id);
    this.toast.success(`${r.patient} marked dispatched`);
  }

  flagPillClass(flagText: string): string {
    if (flagText.includes('CRIT')) { return 'flag-C'; }
    if (flagText.includes('ABN')) { return 'flag-H'; }
    if (flagText.startsWith('H')) { return 'flag-H'; }
    if (flagText.startsWith('L')) { return 'flag-L'; }
    return 'flag-N';
  }

  countPending(records: DispatchRecord[]): number { return records.filter(r => !r.dispatched).length; }
  countDispatched(records: DispatchRecord[]): number { return records.filter(r => r.dispatched).length; }

  trackById(_: number, item: DispatchRecord): string { return item.id; }
}
