import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { LabOrdersService } from '@shared/services/lab-orders.service';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { LabOrder, Sample, Priority, BillStatus } from '@shared/models/cms.models';

import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';

type WorkflowId = 'order-entry' | 'sample-collection' | 'processing';
type Filter = 'all' | 'stat' | 'urgent' | 'routine';
type CollFilter = 'all' | 'pending' | 'damaged' | 'collected';
type ProcFilter = 'all' | 'stat' | 'urgent' | 'routine' | 'on-analyzer' | 'awaiting';

@Component({
  selector: 'app-lab-orders',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    DialogModule,
    CheckboxModule,
    InputTextareaModule
  ],
  templateUrl: './lab-orders.component.html',
  styleUrls: ['./lab-orders.component.scss']
})
export class LabOrdersComponent implements OnInit {

  // KPI snapshot
  kpi = { total: 142, pending: 18, processing: 34, ready: 82, tat: '2.4h' };

  // Pipeline counts
  pipeline = { order: 18, collection: 24, processing: 34, result: 9, dispatch: 57 };

  // Workflow State
  activeWorkflow: WorkflowId = 'sample-collection';

  // Filters
  orderFilter: Filter = 'all';
  orderQ = '';
  collFilter: CollFilter = 'all';
  procFilter: ProcFilter = 'all';

  // Data streams
  orders$!: Observable<LabOrder[]>;
  samples$!: Observable<Sample[]>;

  // ══════════════════════════════════════════════════
  // V5 SPECIMEN COLLECTION MODAL STATE
  // ══════════════════════════════════════════════════
  showCollectDialog: boolean = false;
  selectedOrder: any = null;
  
  // V5 Mock Data Grouped by Specimen
  spcGroups = [
    {
      type: 'blood',
      badgeClass: 'spc-b-blood',
      badgeLabel: 'Blood',
      tube: 'EDTA Tube (Purple)',
      title: 'Complete blood count (CBC), HbA1c, ESR',
      countClass: 'spc-gh-count-blood',
      testCount: '3 Tests',
      collStatus: 'Not Collected',
      collClass: 'spc-coll-none',
      sampleId: 'SMP-BLD-00414',
      open: true,
      phleb: 'T. Ravi',
      tests: [
        { name: 'Complete blood count (CBC)', pre: 'Fasting', int: 'Acceptable', stat: 'Pending', sClass: 'spc-s-pending', selected: true },
        { name: 'HbA1c', pre: 'Fasting', int: 'Acceptable', stat: 'Pending', sClass: 'spc-s-pending', selected: true },
        { name: 'ESR', pre: 'Fasting', int: 'Acceptable', stat: 'Pending', sClass: 'spc-s-pending', selected: true }
      ]
    },
    {
      type: 'urine',
      badgeClass: 'spc-b-urine',
      badgeLabel: 'Urine',
      tube: 'Sterile container',
      title: 'Urine routine & microscopy, Culture',
      countClass: 'spc-gh-count-urine',
      testCount: '2 Tests',
      collStatus: 'Pending',
      collClass: 'spc-coll-partial',
      sampleId: 'SMP-URN-00091',
      open: true,
      phleb: 'A. Priya',
      tests: [
        { name: 'Urine routine & microscopy', pre: 'N/A', int: 'Acceptable', stat: 'Pending', sClass: 'spc-s-pending', selected: false },
        { name: 'Urine culture & sensitivity', pre: 'N/A', int: 'Acceptable', stat: 'Pending', sClass: 'spc-s-pending', selected: false }
      ]
    }
  ];

  // ══════════════════════════════════════════════════
  // MOCK DATA (Cards & Tables)
  // ══════════════════════════════════════════════════
  processingCards = [
    { id: 'SMP-2024-4821', patient: 'Priya Venkatesh', demo: '45F · ICU-B Bed 4', tests: ['CBC', 'Differential'], priority: 'stat' as Priority, analyzer: 'Sysmex XN-1000', state: 'On Analyzer', collected: '08:14 AM', collectedBy: 'T.Ravi · ICU-B', started: '08:24 AM', elapsed: '1h 36m elapsed', est: '10:45 AM', remaining: '~20m remaining', estColor: 'var(--warning)', progress: 74, progressColor: 'linear-gradient(90deg,var(--brand),var(--brand-mid))', progressNote: 'CBC parameters — Differential in progress' },
    { id: 'SMP-2024-4816', patient: 'Ravi Shankar', demo: '70M · ICU-A Bed 2', tests: ['Blood Culture'], priority: 'stat' as Priority, analyzer: 'BioMérieux VITEK 2', state: 'Incubating', collected: '06:58 AM', collectedBy: 'S.Kumar · ICU-A', started: '07:10 AM', elapsed: '3h 50m elapsed', est: 'Prelim: 24h', remaining: 'Culture: 72h', estColor: 'var(--text3)', progress: 16, progressColor: 'linear-gradient(90deg,var(--warning),#f59e0b)', progressNote: 'Gram stain done — Awaiting culture identification' }
  ];

  approvedSamples = [
    { id: 'SMP-2024-4821', patient: 'Priya Venkatesh', demo: '45F · ICU-B Bed 4', tests: ['CBC', 'LFT'], collectedBy: 'T. Ravi', loc: '08:14 AM · ICU-B', time: '08:14 AM', status: 'pending' }
  ];

  constructor(
    private labSvc: LabOrdersService,
    public modal: ModalService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.orders$ = this.labSvc.orders$;
    this.samples$ = this.labSvc.samples$;
  }

  setWorkflow(id: WorkflowId): void { this.activeWorkflow = id; }

  // ══════════════════════════════════════════════════
  // DIALOG INTEGRATION LOGIC
  // ══════════════════════════════════════════════════
  openCollect(orderId: string): void { 
    this.selectedOrder = {
      id: orderId,
      patient: 'Priya Venkatesh',
      age: '45',
      sex: 'F',
      mrn: 'MR-10294',
      visit: 'IPD'
    };
    this.showCollectDialog = true;
  }

  processCollection() {
    this.toast.success(`Specimens marked as collected for ${this.selectedOrder?.patient}`);
    this.showCollectDialog = false;
  }

  toggleGroup(group: any) {
    group.open = !group.open;
  }

  selectAllInGroup(group: any, event: any) {
    const isChecked = event.checked;
    group.tests.forEach((t: any) => t.selected = isChecked);
  }

  // General Methods
  filterOrders(orders: LabOrder[]): LabOrder[] { return orders; }
  filterPending(samples: Sample[]): Sample[] { return samples.filter(s => s.status === 'pending'); }
  filterDamaged(samples: Sample[]): Sample[] { return samples.filter(s => s.status === 'damaged' || s.status === 'rejected'); }
  filterProcessing() { return this.processingCards; }
  
  openNewOrder(): void { this.modal.open('new-order'); }
  openReject(sampleId: string): void { this.modal.open('reject', { sampleId }); }
  openRecollect(sampleId: string): void { this.modal.open('recollect', { sampleId }); }
  openResultEntry(sampleId: string): void { this.modal.open('result-entry', { sampleId }); }
  openPrintLabel(o: LabOrder): void { this.modal.open('print-label', { order: o }); }
  
  notifyDoctor(): void { this.toast.success('Notification sent to Doctor successfully.'); }
  approveSample(id: string): void { this.toast.success('Sample approved for processing'); }
  sendToLab(id: string): void { this.toast.success('Sample moved to processing queue'); }
  
  toggleBill(o: LabOrder): void {
    const next: BillStatus = o.billStatus === 'billed' ? 'pending' : 'billed';
    this.labSvc.setBillStatus(o.id, next);
    this.toast.success(`Bill status updated → ${next}`);
  }

  trackById(_: number, item: { id: string }): string { return item.id; }
}
