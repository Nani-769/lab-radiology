import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { RadiologyService } from '@shared/services/radiology.service';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)">
      <div class="modal" style="width:560px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">Patient Checkout — Imaging Complete</div>
            <div class="modal-subtitle">Sends study to radiologist queue. Releases the room.</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div><label class="form-label">Patient</label><input class="form-input" [(ngModel)]="patient" readonly /></div>
            <div><label class="form-label">Study Completed At</label><input class="form-input" [(ngModel)]="time" /></div>
            <div><label class="form-label">Number of Series</label><input class="form-input" type="number" [(ngModel)]="series" /></div>
            <div><label class="form-label">Number of Images</label><input class="form-input" type="number" [(ngModel)]="images" /></div>
            <div><label class="form-label">Contrast Used</label>
              <select class="form-select" [(ngModel)]="contrast">
                <option>None</option><option>Iohexol 60ml</option><option>Iopamidol 100ml</option><option>Gadolinium 15ml</option>
              </select>
            </div>
            <div><label class="form-label">Radiologist Assigned</label><input class="form-input" [(ngModel)]="radiologist" /></div>
          </div>
          <div style="margin-top:14px;">
            <label class="form-label">Technician Notes</label>
            <textarea class="form-textarea" [(ngModel)]="notes" placeholder="Patient cooperation, image quality, repeat shots…"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Cancel</button>
          <button class="act-btn primary" (click)="submit()">Complete &amp; Route to Radiologist</button>
        </div>
      </div>
    </div>
  `
})
export class CheckoutModalComponent {
  patientId = '';
  patient = '';
  time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  series = 3;
  images = 24;
  contrast = 'None';
  radiologist = 'Dr. Krishnan';
  notes = '';

  constructor(
    private modal: ModalService,
    private toast: ToastService,
    private radSvc: RadiologyService
  ) {
    const ctx = this.modal.context();
    this.patientId = ctx?.patientId || '';
    const p = this.radSvc.getPatients().find(x => x.id === this.patientId);
    if (p) { this.patient = p.name; this.radiologist = p.doctor || this.radiologist; }
  }

  submit(): void {
    this.radSvc.setStage(this.patientId, 'reporting');
    this.toast.success(`${this.patient} sent to radiologist queue`);
    this.close();
  }
  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); } }
}
