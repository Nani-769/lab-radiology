import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-recollect-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)">
      <div class="modal">
        <div class="modal-header">
          <div>
            <div class="modal-title">Schedule Recollection</div>
            <div class="modal-subtitle">Original sample {{ sampleId }} was rejected. Schedule a fresh collection.</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div>
              <label class="form-label">New Sample ID (auto)</label>
              <input class="form-input" [value]="newId" readonly />
            </div>
            <div>
              <label class="form-label">Priority</label>
              <select class="form-select" [(ngModel)]="priority">
                <option>STAT — Recollect immediately</option>
                <option>Urgent — Within 30 mins</option>
                <option>Routine</option>
              </select>
            </div>
            <div>
              <label class="form-label">Assigned To</label>
              <input class="form-input" [(ngModel)]="assignedTo" />
            </div>
            <div>
              <label class="form-label">Target Time</label>
              <input class="form-input" [(ngModel)]="target" />
            </div>
          </div>
          <div style="margin-top:14px;">
            <label class="form-label">Notes for Collector</label>
            <textarea class="form-textarea" [(ngModel)]="notes" placeholder="e.g. Use butterfly needle, patient has poor veins…"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Cancel</button>
          <button class="act-btn primary" (click)="submit()">Schedule Recollection</button>
        </div>
      </div>
    </div>
  `
})
export class RecollectModalComponent {
  sampleId = '';
  newId = 'SMP-' + Date.now().toString().slice(-6);
  priority = 'STAT — Recollect immediately';
  assignedTo = 'T. Ravi (Lab Tech)';
  target = new Date(Date.now() + 30*60000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  notes = '';

  constructor(private modal: ModalService, private toast: ToastService) {
    const ctx = this.modal.context();
    if (ctx?.sampleId) { this.sampleId = ctx.sampleId; }
  }

  submit(): void {
    this.toast.success(`Recollection scheduled — ${this.newId}`);
    this.close();
  }

  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); } }
}
