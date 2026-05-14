import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { ExternalLabService } from '@shared/services/external-lab.service';

@Component({
  selector: 'app-ext-send-b-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)">
      <div class="modal" style="width:680px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">Log Sample + Send to External — Scenario B</div>
            <div class="modal-subtitle">Sample collected at hospital, packed and dispatched to reference lab.</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">
          <div class="ext-callout co-purple" style="margin-bottom:14px;">
            <div class="ext-callout-icon">🧪</div>
            <div>
              <div class="ext-callout-title">In-house collection, external analysis</div>
              <div class="ext-callout-body">Print barcode label, pack with cold-chain if required, hand to courier.</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div><label class="form-label">Patient</label><input class="form-input" [(ngModel)]="patient" /></div>
            <div><label class="form-label">MRN / Demographics</label><input class="form-input" [(ngModel)]="demo" /></div>
            <div style="grid-column:1/-1;"><label class="form-label">Tests</label><input class="form-input" [(ngModel)]="testsStr" placeholder="Comma-separated" /></div>
            <div><label class="form-label">Sample Type</label>
              <select class="form-select" [(ngModel)]="sampleType">
                <option>EDTA Blood</option>
                <option>Plain Blood</option>
                <option>Citrate Blood</option>
                <option>Frozen Plasma</option>
                <option>Tissue / Biopsy</option>
              </select>
            </div>
            <div><label class="form-label">Volume</label><input class="form-input" [(ngModel)]="volume" /></div>
            <div><label class="form-label">Collected At</label><input class="form-input" [(ngModel)]="collection" /></div>
            <div><label class="form-label">Courier</label>
              <select class="form-select" [(ngModel)]="courier">
                <option>Blue Dart Medical</option>
                <option>Cold Chain Express</option>
                <option>Hospital Runner</option>
              </select>
            </div>
            <div><label class="form-label">External Lab</label>
              <select class="form-select" [(ngModel)]="externalLab">
                <option>Metropolis Healthcare</option>
                <option>Dr. Lal PathLabs</option>
                <option>SRL Diagnostics</option>
              </select>
            </div>
            <div><label class="form-label">Expected TAT</label>
              <select class="form-select" [(ngModel)]="tat">
                <option>24 hr</option>
                <option>48 hr</option>
                <option>72 hr</option>
                <option>5 days</option>
                <option>10 days</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Cancel</button>
          <button class="act-btn primary" (click)="submit()">Log &amp; Dispatch</button>
        </div>
      </div>
    </div>
  `
})
export class ExtSendBModalComponent {
  patient = '';
  demo = '';
  testsStr = '';
  sampleType = 'EDTA Blood';
  volume = '5 mL';
  collection = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  courier = 'Blue Dart Medical';
  externalLab = 'Metropolis Healthcare';
  tat = '48 hr';

  constructor(
    private modal: ModalService,
    private toast: ToastService,
    private svc: ExternalLabService
  ) {}

  submit(): void {
    this.svc.addOrder({
      patient: this.patient, demo: this.demo,
      tests: this.testsStr.split(',').map(t => t.trim()).filter(Boolean),
      externalLab: this.externalLab, expectedTat: this.tat,
      scenario: 'B', collection: this.collection
    });
    this.toast.success(`Sample dispatched to ${this.externalLab}`);
    this.close();
  }

  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); } }
}
