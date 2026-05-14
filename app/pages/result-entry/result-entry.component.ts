import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ResultsService } from '@shared/services/results.service';
import { ToastService } from '@shared/services/toast.service';
import { ResultItem, Priority } from '@shared/models/cms.models';

type Filter = 'all' | 'stat' | 'urgent' | 'routine';

interface DetailParam {
  name: string;
  unit: string;
  val: string;
  flag: 'H' | 'L' | 'N' | 'CRIT' | 'ABN';
  ref: string;
  prior?: string;
  critical?: boolean;
}

@Component({
  selector: 'app-result-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './result-entry.component.html',
  styleUrls: ['./result-entry.component.scss']
})
export class ResultEntryComponent implements OnInit {

  view: 'grid' | 'detail' = 'grid';
  filter: Filter = 'all';
  query = '';

  items$!: Observable<ResultItem[]>;
  selected?: ResultItem;
  selectedIndex = 0;

  // Static result params for the CBC critical example (rendered when an item is opened)
  detailParams: DetailParam[] = [
    { name: 'Hemoglobin', unit: 'g/dL', val: '11.2', flag: 'L', ref: '12.0 – 17.0', prior: '12.8' },
    { name: 'WBC Count', unit: '×10³/µL', val: '8.4', flag: 'N', ref: '4.5 – 11.0', prior: '7.2' },
    { name: 'Platelet Count', unit: '×10³/µL', val: '42', flag: 'CRIT', ref: '150 – 400', prior: '210', critical: true },
    { name: 'Hematocrit', unit: '%', val: '34.6', flag: 'L', ref: '36.0 – 52.0', prior: '38.4' },
    { name: 'MCV', unit: 'fL', val: '88.2', flag: 'N', ref: '80 – 100', prior: '87.5' },
    { name: 'Neutrophils', unit: '%', val: '62', flag: 'N', ref: '40 – 70', prior: '58' }
  ];

  constructor(private resSvc: ResultsService, private toast: ToastService) {}

  ngOnInit(): void { this.items$ = this.resSvc.items$; }

  filtered(items: ResultItem[]): ResultItem[] {
    return items.filter(i => {
      if (this.filter !== 'all' && i.priority !== this.filter) { return false; }
      if (this.query) {
        const q = this.query.toLowerCase();
        return i.patient.toLowerCase().includes(q) || i.sampleId.toLowerCase().includes(q);
      }
      return true;
    });
  }

  openDetail(item: ResultItem, list: ResultItem[]): void {
    this.selected = item;
    this.selectedIndex = list.indexOf(item);
    this.view = 'detail';
  }
  closeDetail(): void { this.view = 'grid'; }

  navDetail(dir: -1 | 1, list: ResultItem[]): void {
    const next = this.selectedIndex + dir;
    if (next < 0 || next >= list.length) { return; }
    this.selectedIndex = next;
    this.selected = list[next];
  }

  saveResults(): void {
    if (!this.selected) { return; }
    this.toast.success(`Results saved for ${this.selected.sampleId}`);
  }

  sendToReview(): void {
    if (!this.selected) { return; }
    this.toast.success(`${this.selected.sampleId} sent to review`);
    this.resSvc.remove(this.selected.id);
    this.view = 'grid';
  }

  checkAbnormal(p: DetailParam): void {
    // simple updates flag based on value (could parse range)
    if (!p.val) { p.flag = 'N'; return; }
  }

  countByPriority(items: ResultItem[], pr: Priority): number {
    return items.filter(i => i.priority === pr).length;
  }

  statusBadge(s: string): string {
    return s === 'critical' ? 'badge-critical'
      : s === 'processing' ? 'badge-processing'
      : s === 'collected' ? 'badge-collected'
      : 'badge-ordered';
  }

  trackById(_: number, item: ResultItem): string { return item.id; }
}
