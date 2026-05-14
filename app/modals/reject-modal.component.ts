import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-reject-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)">
      <div class="modal">
        <div class="modal-header">
          <div>
            <div class="modal-title">Reject Sample</div>
            <div class="modal-subtitle">Document rejection reason. Recollection order will be generated.</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background:var(--danger-bg);padding:10px 14px;border-radius:var(--radius);border:1px solid var(--danger);margin-bottom:14px;">
            <div style="font-size:12px;font-weight:700;color:var(--danger);">Sample {{ sampleId }} will be marked as rejected</div>
            <div style="font-size:11.5px;color:var(--text2);margin-top:2px;">A new collection order will automatically be queued.</div>
          </div>

          <label class="form-label">Rejection Reason</label>
          <select class="form-select" [(ngModel)]="reason">
            <option>Haemolysed Sample</option>
            <option>Clotted Sample</option>
            <option>Insufficient Volume</option>
            <option>Wrong Container</option>
            <option>Improper Labeling</option>
            <option>Sample Leakage</option>
            <option>Delayed Transport</option>
          </select>

          <div style="margin-top:14px;">
            <label class="form-label">Detailed Notes</label>
            <textarea class="form-textarea" [(ngModel)]="notes" placeholder="Describe what was wrong, who flagged it, when…"></textarea>
          </div>

          <div style="margin-top:14px;">
            <label class="form-label">Rejected By</label>
            <input class="form-input" [(ngModel)]="rejectedBy" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Cancel</button>
          <button class="act-btn danger" (click)="submit()">Reject Sample</button>
        </div>
      </div>
    </div>
  `
})
export class RejectModalComponent {
  sampleId = '';
  reason = 'Haemolysed Sample';
  notes = '';
  rejectedBy = 'S. Kumar (Lab Tech)';

  constructor(private modal: ModalService, private toast: ToastService) {
    const ctx = this.modal.context();
    if (ctx?.sampleId) { this.sampleId = ctx.sampleId; }
  }

  submit(): void {
    this.toast.warn(`Sample ${this.sampleId} rejected — ${this.reason}`);
    this.close();
  }

  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); } }
}
