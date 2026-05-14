import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-sched-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)">
      <div class="modal" style="width:600px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">Schedule {{ modalityLabel() }} Study</div>
            <div class="modal-subtitle">Slot booking · room availability checks · patient prep</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div><label class="form-label">Patient</label><input class="form-input" [(ngModel)]="patient" /></div>
            <div><label class="form-label">MRN</label><input class="form-input" [(ngModel)]="mrn" /></div>
            <div><label class="form-label">Study</label><input class="form-input" [(ngModel)]="study" /></div>
            <div><label class="form-label">Priority</label>
              <select class="form-select" [(ngModel)]="priority">
                <option>STAT</option><option>Urgent</option><option>Routine</option>
              </select>
            </div>
            <div><label class="form-label">Scheduled Date</label><input class="form-input" type="date" [(ngModel)]="date" /></div>
            <div><label class="form-label">Time Slot</label><input class="form-input" type="time" [(ngModel)]="time" /></div>
            <div><label class="form-label">Room</label>
              <select class="form-select" [(ngModel)]="room">
                <option *ngFor="let r of rooms">{{ r }}</option>
              </select>
            </div>
            <div><label class="form-label">Radiologist</label><input class="form-input" [(ngModel)]="radiologist" /></div>
          </div>
          <div style="margin-top:14px;">
            <label class="form-label">Patient Preparation Notes</label>
            <textarea class="form-textarea" [(ngModel)]="prep" placeholder="Fasting? Contrast allergy? Claustrophobia?"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Cancel</button>
          <button class="act-btn primary" (click)="submit()">Confirm Slot</button>
        </div>
      </div>
    </div>
  `
})
export class SchedModalComponent {
  modality = 'xray';
  patient = '';
  mrn = '';
  study = '';
  priority = 'Routine';
  date = new Date().toISOString().slice(0, 10);
  time = '10:30';
  room = 'XR-1';
  radiologist = 'Dr. Krishnan';
  prep = '';
  rooms: string[] = [];

  constructor(private modal: ModalService, private toast: ToastService) {
    const ctx = this.modal.context();
    if (ctx?.modality) { this.modality = ctx.modality; }
    this.rooms = ({
      xray: ['XR-1', 'XR-2', 'XR-3'],
      ct: ['CT-1', 'CT-2'],
      mri: ['MRI-1 (3T)', 'MRI-2 (1.5T)'],
      usg: ['USG-1', 'USG-2', 'USG-3'],
      nuc: ['PET-CT', 'SPECT-CT']
    } as Record<string, string[]>)[this.modality] || ['XR-1'];
    this.room = this.rooms[0];
  }

  modalityLabel(): string {
    return ({ xray: 'X-Ray', ct: 'CT', mri: 'MRI', usg: 'Ultrasound', nuc: 'Nuclear Medicine' } as Record<string, string>)[this.modality] || 'Study';
  }

  submit(): void {
    this.toast.success(`Scheduled — ${this.patient} · ${this.date} ${this.time} · ${this.room}`);
    this.close();
  }
  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); } }
}
