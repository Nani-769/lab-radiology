import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { LabOrdersService } from '@shared/services/lab-orders.service';

@Component({
  selector: 'app-billing-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)">
      <div class="modal" style="width:560px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">Billing — {{ orderId }}</div>
            <div class="modal-subtitle">Itemized breakdown. Mark as billed once payment is confirmed.</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">
          <table class="result-params-table">
            <thead><tr><th>Test</th><th style="text-align:right;">Charge (INR)</th></tr></thead>
            <tbody>
              <tr *ngFor="let t of tests"><td>{{ t.name }}</td><td style="text-align:right;" class="mono">{{ t.charge }}</td></tr>
              <tr><td style="font-weight:700;">Total</td><td style="text-align:right;font-weight:700;" class="mono">{{ total() }}</td></tr>
            </tbody>
          </table>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;">
            <div><label class="form-label">Payment Method</label><select class="form-select" [(ngModel)]="method"><option>Cash</option><option>Card</option><option>UPI</option><option>Insurance</option><option>Internal Patient</option></select></div>
            <div><label class="form-label">Insurance Provider</label><input class="form-input" [(ngModel)]="insurance" placeholder="If applicable" /></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Cancel</button>
          <button class="act-btn primary" (click)="submit()">Mark Billed</button>
        </div>
      </div>
    </div>
  `
})
export class BillingModalComponent {
  orderId = '';
  method = 'Cash';
  insurance = '';
  tests = [
    { name: 'CBC with Differential', charge: 350 },
    { name: 'LFT Panel', charge: 600 },
    { name: 'HbA1c', charge: 450 }
  ];

  constructor(
    private modal: ModalService,
    private toast: ToastService,
    private svc: LabOrdersService
  ) {
    const ctx = this.modal.context();
    if (ctx?.order) { this.orderId = ctx.order.id; }
  }

  total(): number { return this.tests.reduce((s, t) => s + t.charge, 0); }
  submit(): void {
    this.svc.setBillStatus(this.orderId, 'billed');
    this.toast.success(`Bill settled — ${this.orderId}`);
    this.close();
  }
  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); } }
}
