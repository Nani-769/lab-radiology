import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ExternalLabService } from '@shared/services/external-lab.service';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { ExternalOrder } from '@shared/models/cms.models';

type SubTab = 'a' | 'b' | 'results';
type StatusFilter = 'All' | 'Dispatched' | 'Awaiting' | 'Received' | 'Collected';

@Component({
  selector: 'app-external-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './external-lab.component.html',
  styleUrls: ['./external-lab.component.scss']
})
export class ExternalLabComponent implements OnInit {

  subTab: SubTab = 'a';
  filterA: StatusFilter = 'All';
  filterB: StatusFilter = 'All';

  orders$!: Observable<ExternalOrder[]>;

  constructor(
    private svc: ExternalLabService,
    private modal: ModalService,
    private toast: ToastService
  ) {}

  ngOnInit(): void { this.orders$ = this.svc.orders$; }

  setSubTab(t: SubTab): void { this.subTab = t; }

  scenarioOrders(all: ExternalOrder[], scenario: 'A' | 'B'): ExternalOrder[] {
    const f = scenario === 'A' ? this.filterA : this.filterB;
    return all.filter(o => o.scenario === scenario)
      .filter(o => f === 'All' || o.status === f);
  }

  receivedOrders(all: ExternalOrder[]): ExternalOrder[] {
    return all.filter(o => o.status === 'Received');
  }

  setFilter(scenario: 'A' | 'B', status: StatusFilter): void {
    if (scenario === 'A') { this.filterA = status; } else { this.filterB = status; }
  }

  openSendA(): void { this.modal.open('ext-send-a'); }
  openSendB(): void { this.modal.open('ext-send-b'); }
  openResultEntry(o?: ExternalOrder): void { this.modal.open('ext-result-entry', { order: o }); }

  trackById(_: number, item: ExternalOrder): string { return item.id; }

  workflowBadge(w: string): string {
    return w.includes('Received') ? 'badge-collected'
      : w.includes('Awaiting') ? 'badge-processing'
      : w.includes('Collected') ? 'badge-ready'
      : 'badge-ordered';
  }
}
