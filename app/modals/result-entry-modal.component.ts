import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';

interface Row { name: string; unit: string; ref: string; val: string; flag: 'H' | 'L' | 'N' | 'CRIT'; }

@Component({
  selector: 'app-result-entry-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)">
      <div class="modal" style="width:680px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">Quick Result Entry — {{ sampleId }}</div>
            <div class="modal-subtitle">Enter analyzer values. Critical flags will trigger notification workflow.</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">
          <table class="result-params-table">
            <thead>
              <tr><th>Parameter</th><th style="text-align:right;">Result</th><th style="text-align:center;">Flag</th><th>Reference</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of rows">
                <td><div class="param-name">{{ r.name }}</div><div class="param-unit">{{ r.unit }}</div></td>
                <td style="text-align:right;"><input class="result-input" [(ngModel)]="r.val" /></td>
                <td style="text-align:center;"><span class="flag-pill" [ngClass]="'flag-' + (r.flag === 'CRIT' ? 'C' : r.flag)">{{ r.flag }}</span></td>
                <td class="param-ref">{{ r.ref }}</td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top:14px;">
            <label class="form-label">Technician Notes</label>
            <textarea class="form-textarea" [(ngModel)]="notes" placeholder="Dilution factor, redraw notes, anything notable…"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Cancel</button>
          <button class="act-btn" (click)="saveDraft()">Save Draft</button>
          <button class="act-btn primary" (click)="submit()">Save &amp; Send to Review</button>
        </div>
      </div>
    </div>
  `
})
export class ResultEntryModalComponent {
  sampleId = '';
  notes = '';
  rows: Row[] = [
    { name: 'Hemoglobin', unit: 'g/dL', ref: '12.0 – 17.0', val: '11.2', flag: 'L' },
    { name: 'WBC Count', unit: '×10³/µL', ref: '4.5 – 11.0', val: '8.4', flag: 'N' },
    { name: 'Platelet Count', unit: '×10³/µL', ref: '150 – 400', val: '42', flag: 'CRIT' },
    { name: 'Hematocrit', unit: '%', ref: '36.0 – 52.0', val: '34.6', flag: 'L' }
  ];

  constructor(private modal: ModalService, private toast: ToastService) {
    const ctx = this.modal.context();
    if (ctx?.sampleId) { this.sampleId = ctx.sampleId; }
  }

  saveDraft(): void { this.toast.info('Draft saved'); }
  submit(): void { this.toast.success(`Results saved — ${this.sampleId} sent to review`); this.close(); }
  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); } }
}
