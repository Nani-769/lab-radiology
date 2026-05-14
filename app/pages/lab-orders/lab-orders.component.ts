import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { LabOrdersService } from '@shared/services/lab-orders.service';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { LabOrder, Sample, Priority, BillStatus } from '@shared/models/cms.models';

// --- Added PrimeNG Dialog Imports ---
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';

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
    CheckboxModule
  ],
  templateUrl: './lab-orders.component.html',
  styleUrls: ['./lab-orders.component.scss']
})
export class LabOrdersComponent implements OnInit {

  // KPI snapshot (read from POC)
  kpi = { total: 142, pending: 18, processing: 34, ready: 82, tat: '2.4h' };

  // Pipeline counts
  pipeline = {
    order: 18, collection: 24, processing: 34, result: 9, dispatch: 57
  };

  // Workflow
  activeWorkflow: WorkflowId = 'sample-collection';

  // Filters
  orderFilter: Filter = 'all';
  orderQ = '';
  collFilter: CollFilter = 'all';
  procFilter: ProcFilter = 'all';

  // Data streams
  orders$!: Observable<LabOrder[]>;
  samples$!: Observable<Sample[]>;

  // --- SAMPLE COLLECT DIALOG STATE ---
  showCollectDialog: boolean = false;
  selectedOrder: any = null;
  allTestsSelected: boolean = true;
  collectionNotes: string = '';

  constructor(
    private labSvc: LabOrdersService,
    public modal: ModalService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.orders$ = this.labSvc.orders$;
    this.samples$ = this.labSvc.samples$;
  }

  // Workflow tab switch
  setWorkflow(id: WorkflowId): void { this.activeWorkflow = id; }

  // Filtering helpers
  filterOrders(orders: LabOrder[]): LabOrder[] {
    return orders.filter(o => {
      if (o.status !== 'pending') { return false; }
      if (this.orderFilter !== 'all' && o.priority !== this.orderFilter) { return false; }
      if (this.orderQ) {
        const q = this.orderQ.toLowerCase();
        return o.patient.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.tests.join(' ').toLowerCase().includes(q);
      }
      return true;
    });
  }

  filterPending(samples: Sample[]): Sample[] {
    return samples.filter(s => s.status === 'pending');
  }
  filterDamaged(samples: Sample[]): Sample[] {
    return samples.filter(s => s.status === 'damaged' || s.status === 'rejected');
  }

  filterProcessing(processingCards: any[]) {
    if(!processingCards) return [];
    return processingCards.filter(p => {
      if (this.procFilter === 'all') { return true; }
      if (this.procFilter === 'stat') { return p.priority === 'stat'; }
      if (this.procFilter === 'urgent') { return p.priority === 'urgent'; }
      if (this.procFilter === 'routine') { return p.priority === 'routine'; }
      if (this.procFilter === 'on-analyzer') { return p.state === 'On Analyzer'; }
      if (this.procFilter === 'awaiting') { return p.state === 'Incubating'; }
      return true;
    });
  }

  // Actions
  openNewOrder(): void { this.modal.open('new-order'); }
  
  // --- INTEGRATED SAMPLE COLLECT LOGIC ---
  openCollect(orderId: string): void { 
    // Mocking the selected order details. In production, fetch this by orderId.
    this.selectedOrder = {
      id: orderId,
      patient: 'Priya Venkatesh',
      demo: '45F · MR-10294 · ICU-B Bed 4',
      tests: [
        { name: 'CBC', type: 'EDTA Blood', vol: '3 mL', status: 'Pending', selected: true },
        { name: 'Differential', type: 'EDTA Blood', vol: '3 mL', status: 'Pending', selected: true }
      ]
    };
    this.collectionNotes = '';
    this.allTestsSelected = true;
    this.showCollectDialog = true;
  }

  toggleAllTests() {
    if(this.selectedOrder && this.selectedOrder.tests) {
      this.selectedOrder.tests.forEach((t: any) => t.selected = this.allTestsSelected);
    }
  }

  processCollection() {
    this.toast.success(`Sample collection processed for ${this.selectedOrder?.id}`);
    this.showCollectDialog = false;
  }
  // ----------------------------------------

  openReject(sampleId: string): void { this.modal.open('reject', { sampleId }); }
  openRecollect(sampleId: string): void { this.modal.open('recollect', { sampleId }); }
  openResultEntry(sampleId: string): void { this.modal.open('result-entry', { sampleId }); }
  openPrintLabel(o: LabOrder): void { this.modal.open('print-label', { order: o }); }
  openBilling(o: LabOrder): void { this.modal.open('billing', { order: o }); }

  toggleBill(o: LabOrder): void {
    const next: BillStatus = o.billStatus === 'billed' ? 'pending' : 'billed';
    this.labSvc.setBillStatus(o.id, next);
    this.toast.success(`Bill status updated → ${next}`);
  }

  trackById(_: number, item: { id: string }): string { return item.id; }
}