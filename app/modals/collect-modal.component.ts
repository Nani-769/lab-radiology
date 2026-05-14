import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { LabOrdersService } from '@shared/services/lab-orders.service';

@Component({
  selector: 'app-collect-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)">
      <div class="modal">
        <div class="modal-header">
          <div>
            <div class="modal-title">Sample Collection</div>
            <div class="modal-subtitle">Record sample collection details. Pre-fills from order.</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div>
              <label class="form-label">Order ID</label>
              <input class="form-input" [value]="orderId" readonly />
            </div>
            <div>
              <label class="form-label">Sample ID (auto)</label>
              <input class="form-input" [value]="sampleId" readonly />
            </div>
            <div>
              <label class="form-label">Sample Type</label>
              <select class="form-select" [(ngModel)]="sampleType">
                <option>EDTA Blood</option>
                <option>Plain Blood</option>
                <option>Citrate Blood</option>
                <option>Urine</option>
              </select>
            </div>
            <div>
              <label class="form-label">Volume</label>
              <input class="form-input" [(ngModel)]="volume" />
            </div>
            <div>
              <label class="form-label">Collected By</label>
              <input class="form-input" [(ngModel)]="collectedBy" />
            </div>
            <div>
              <label class="form-label">Collection Site</label>
              <input class="form-input" [(ngModel)]="site" />
            </div>
          </div>
          <div style="margin-top:14px;">
            <label class="form-label">Notes</label>
            <textarea class="form-textarea" [(ngModel)]="notes" placeholder="Patient prep, difficulty, anything notable…"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Cancel</button>
          <button class="act-btn primary" (click)="submit()">Save &amp; Print Label</button>
        </div>
      </div>
    </div>
  `
})
export class CollectModalComponent {
  orderId = '';
  sampleId = 'SMP-' + Date.now().toString().slice(-6);
  sampleType = 'EDTA Blood';
  volume = '3 mL';
  collectedBy = 'T. Ravi';
  site = 'Antecubital - Left';
  notes = '';

  constructor(
    private modal: ModalService,
    private toast: ToastService,
    private svc: LabOrdersService
  ) {
    const ctx = this.modal.context();
    if (ctx?.orderId) { this.orderId = ctx.orderId; }
  }

  submit(): void {
    this.svc.collectSample(this.orderId, {
      sampleType: this.sampleType, volume: this.volume, collectedBy: this.collectedBy
    });
    this.toast.success(`Sample ${this.sampleId} collected`);
    this.close();
  }

  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); } }
}
