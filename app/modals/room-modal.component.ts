import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { RadiologyService } from '@shared/services/radiology.service';

@Component({
  selector: 'app-room-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)">
      <div class="modal" style="width:520px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">Assign Imaging Room</div>
            <div class="modal-subtitle">Move patient to active imaging stage. Room becomes busy.</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">
          <div>
            <label class="form-label">Available Rooms</label>
            <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
              <label *ngFor="let r of rooms" style="display:flex;align-items:center;gap:10px;padding:10px;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;" [style.background]="selectedRoom === r ? 'var(--brand-light)' : 'var(--surface)'">
                <input type="radio" name="room" [value]="r" [(ngModel)]="selectedRoom" />
                <div style="flex:1;">
                  <div style="font-size:13px;font-weight:600;">{{ r }}</div>
                  <div style="font-size:11px;color:var(--success);">● Available now</div>
                </div>
              </label>
            </div>
          </div>

          <div style="margin-top:14px;">
            <label class="form-label">Technician</label>
            <input class="form-input" [(ngModel)]="technician" />
          </div>

          <div style="margin-top:14px;">
            <label class="form-label">Pre-imaging Notes</label>
            <textarea class="form-textarea" [(ngModel)]="notes" placeholder="Last meal time, last contrast dose, IV status…"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Cancel</button>
          <button class="act-btn primary" (click)="submit()">Assign &amp; Begin Imaging</button>
        </div>
      </div>
    </div>
  `
})
export class RoomModalComponent {
  patientId = '';
  modality = 'xray';
  rooms = ['XR-2', 'XR-3'];
  selectedRoom = '';
  technician = 'R. Reddy';
  notes = '';

  constructor(
    private modal: ModalService,
    private toast: ToastService,
    private radSvc: RadiologyService
  ) {
    const ctx = this.modal.context();
    if (ctx?.patientId) { this.patientId = ctx.patientId; }
    if (ctx?.modality) { this.modality = ctx.modality; }
    this.rooms = ({
      xray: ['XR-2', 'XR-3'], ct: ['CT-2'], mri: ['MRI-2'], usg: ['USG-2', 'USG-3'], nuc: ['SPECT-CT']
    } as Record<string, string[]>)[this.modality] || ['XR-2'];
    this.selectedRoom = this.rooms[0];
  }

  submit(): void {
    if (!this.selectedRoom) { this.toast.error('Select a room'); return; }
    this.radSvc.assignRoom(this.patientId, this.selectedRoom);
    this.toast.success(`Patient assigned to ${this.selectedRoom}`);
    this.close();
  }
  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); } }
}
