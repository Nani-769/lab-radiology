import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { ExternalLabService } from '@shared/services/external-lab.service';

@Component({
  selector: 'app-ext-send-a-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)">
      <div class="modal" style="width:640px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">Send to External Lab — Scenario A</div>
            <div class="modal-subtitle">Hospital has no lab. External lab will collect sample directly.</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">
          <div class="ext-callout co-orange" style="margin-bottom:14px;">
            <div class="ext-callout-icon">🏥</div>
            <div>
              <div class="ext-callout-title">Patient will visit external lab for collection</div>
              <div class="ext-callout-body">Generate referral slip. Patient should carry photo ID and prescription.</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div><label class="form-label">Patient</label><input class="form-input" [(ngModel)]="patient" placeholder="Full name" /></div>
            <div><label class="form-label">MRN</label><input class="form-input" [(ngModel)]="mrn" /></div>
            <div style="grid-column:1/-1;"><label class="form-label">Tests</label><input class="form-input" [(ngModel)]="testsStr" placeholder="Comma-separated" /></div>
            <div><label class="form-label">External Lab</label>
              <select class="form-select" [(ngModel)]="externalLab">
                <option>Metropolis Healthcare</option>
                <option>Dr. Lal PathLabs</option>
                <option>SRL Diagnostics</option>
                <option>Mapmygenome</option>
              </select>
            </div>
            <div><label class="form-label">Expected TAT</label>
              <select class="form-select" [(ngModel)]="tat">
                <option>12 hr</option>
                <option>24 hr</option>
                <option>48 hr</option>
                <option>72 hr</option>
                <option>5–7 days</option>
                <option>14 days</option>
              </select>
            </div>
          </div>
          <div style="margin-top:14px;">
            <label class="form-label">Patient Instructions / Notes</label>
            <textarea class="form-textarea" [(ngModel)]="notes" placeholder="Fasting required? Special prep?"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Cancel</button>
          <button class="act-btn primary" (click)="submit()">Generate Referral &amp; Send</button>
        </div>
      </div>
    </div>
  `
})
export class ExtSendAModalComponent {
  patient = '';
  mrn = '';
  testsStr = '';
  externalLab = 'Metropolis Healthcare';
  tat = '24 hr';
  notes = '';

  constructor(
    private modal: ModalService,
    private toast: ToastService,
    private svc: ExternalLabService
  ) {}

  submit(): void {
    this.svc.addOrder({
      patient: this.patient, demo: this.mrn,
      tests: this.testsStr.split(',').map(t => t.trim()).filter(Boolean),
      externalLab: this.externalLab, expectedTat: this.tat, scenario: 'A'
    });
    this.toast.success(`Referral sent to ${this.externalLab}`);
    this.close();
  }

  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); } }
}
