import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-ext-result-entry-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)">
      <div class="modal" style="width:720px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">Enter External Lab Result</div>
            <div class="modal-subtitle">Manual entry of result received from reference lab. Goes to Review & Authorize next.</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background:var(--success-bg);padding:10px 14px;border-radius:var(--radius);margin-bottom:14px;">
            <div style="font-size:12px;font-weight:700;color:var(--success);">Result received from {{ externalLab }}</div>
            <div style="font-size:11.5px;color:var(--text2);">Source PDF: report_{{ refId }}.pdf · Received {{ received }}</div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div><label class="form-label">Ref ID</label><input class="form-input" [(ngModel)]="refId" readonly /></div>
            <div><label class="form-label">Patient</label><input class="form-input" [(ngModel)]="patient" /></div>
          </div>

          <div style="margin-top:14px;">
            <label class="form-label">Test Name</label>
            <input class="form-input" [(ngModel)]="testName" />
          </div>

          <table class="result-params-table" style="margin-top:14px;">
            <thead>
              <tr>
                <th>Parameter</th>
                <th style="text-align:right;">Result</th>
                <th style="text-align:center;">Flag</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of params">
                <td><input class="form-input" [(ngModel)]="p.name" style="font-size:12px;" /></td>
                <td style="text-align:right;"><input class="result-input" [(ngModel)]="p.val" /></td>
                <td style="text-align:center;">
                  <select class="form-select" style="width:60px;padding:3px;" [(ngModel)]="p.flag">
                    <option>N</option><option>H</option><option>L</option><option>CRIT</option><option>ABN</option>
                  </select>
                </td>
                <td><input class="form-input" [(ngModel)]="p.ref" style="font-size:12px;" /></td>
              </tr>
            </tbody>
          </table>

          <button class="act-btn" style="margin-top:10px;" (click)="addRow()">+ Add Parameter</button>

          <div style="margin-top:14px;">
            <label class="form-label">Pathologist Comment</label>
            <textarea class="form-textarea" [(ngModel)]="comment" placeholder="Clinical interpretation, follow-up advice…"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Cancel</button>
          <button class="act-btn primary" (click)="submit()">Save &amp; Send to Review</button>
        </div>
      </div>
    </div>
  `
})
export class ExtResultEntryModalComponent {
  refId = 'EXT-A-003';
  patient = 'Mahesh Kumar';
  externalLab = 'SRL Diagnostics';
  received = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  testName = 'PSA Free + PSA Total';
  comment = '';

  params: { name: string; val: string; flag: string; ref: string; }[] = [
    { name: 'PSA Total', val: '4.8', flag: 'H', ref: '<4.0 ng/mL' },
    { name: 'PSA Free', val: '0.6', flag: 'N', ref: '0.5–2.0 ng/mL' },
    { name: 'Free/Total Ratio', val: '12.5', flag: 'L', ref: '>25%' }
  ];

  constructor(private modal: ModalService, private toast: ToastService) {
    const ctx = this.modal.context();
    if (ctx?.order) {
      this.refId = ctx.order.id;
      this.patient = ctx.order.patient;
      this.externalLab = ctx.order.externalLab;
      this.testName = (ctx.order.tests || []).join(' + ');
    }
  }

  addRow(): void { this.params.push({ name: '', val: '', flag: 'N', ref: '' }); }

  submit(): void { this.toast.success(`Result saved — ${this.refId} sent to review`); this.close(); }
  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); } }
}
