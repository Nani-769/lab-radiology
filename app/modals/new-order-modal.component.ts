import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { LabOrdersService } from '@shared/services/lab-orders.service';
import { Priority } from '@shared/models/cms.models';

@Component({
  selector: 'app-new-order-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)">
      <div class="modal" style="width:680px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">New Lab Order</div>
            <div class="modal-subtitle">Search patient, select tests, set priority. Order routes to Sample Collection.</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div>
              <label class="form-label">Patient (Search MRN / Name)</label>
              <input class="form-input" placeholder="e.g. MR-10294 or 'Priya'" [(ngModel)]="patient" />
            </div>
            <div>
              <label class="form-label">Patient Demographics</label>
              <input class="form-input" placeholder="45F · MR-10294 · Ward-3 Bed 11" [(ngModel)]="demo" />
            </div>
          </div>

          <div style="margin-top:14px;">
            <label class="form-label">Tests Ordered (comma-separated)</label>
            <input class="form-input" placeholder="CBC, LFT, HbA1c" [(ngModel)]="testsStr" />
            <div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap;">
              <span class="test-tag" *ngFor="let t of preview()">{{ t }}</span>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:14px;">
            <div>
              <label class="form-label">Priority</label>
              <select class="form-select" [(ngModel)]="priority">
                <option value="stat">STAT</option>
                <option value="urgent">Urgent</option>
                <option value="routine">Routine</option>
              </select>
            </div>
            <div>
              <label class="form-label">Sample Type</label>
              <select class="form-select" [(ngModel)]="sampleType">
                <option>EDTA Blood</option>
                <option>Plain Blood</option>
                <option>Citrate Blood</option>
                <option>Urine</option>
                <option>Blood Culture</option>
              </select>
            </div>
            <div>
              <label class="form-label">Department</label>
              <input class="form-input" placeholder="Medicine / ICU / OPD" [(ngModel)]="dept" />
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;">
            <div>
              <label class="form-label">Ordered By</label>
              <input class="form-input" placeholder="Dr. ___" [(ngModel)]="orderedBy" />
            </div>
            <div>
              <label class="form-label">Bill Status</label>
              <select class="form-select" [(ngModel)]="billStatus">
                <option value="billed">Billed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Cancel</button>
          <button class="act-btn primary" (click)="submit()">Create Order</button>
        </div>
      </div>
    </div>
  `
})
export class NewOrderModalComponent {
  patient = '';
  demo = '';
  testsStr = '';
  priority: Priority = 'routine';
  sampleType = 'EDTA Blood';
  dept = '';
  orderedBy = '';
  billStatus: 'billed' | 'pending' = 'pending';

  constructor(
    private modal: ModalService,
    private toast: ToastService,
    private svc: LabOrdersService
  ) {}

  preview(): string[] {
    return this.testsStr.split(',').map(t => t.trim()).filter(Boolean);
  }

  submit(): void {
    if (!this.patient) { this.toast.error('Patient required'); return; }
    this.svc.addOrder({
      patient: this.patient, demo: this.demo,
      tests: this.preview(),
      priority: this.priority, sampleType: this.sampleType,
      dept: this.dept, orderedBy: this.orderedBy,
      billStatus: this.billStatus
    });
    this.toast.success('Order created — ' + this.patient);
    this.close();
  }

  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); }
  }
}
