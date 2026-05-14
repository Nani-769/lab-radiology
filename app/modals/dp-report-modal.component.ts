import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { DispatchService } from '@shared/services/results.service';
import { DispatchRecord, ResultParam } from '@shared/models/cms.models';

@Component({
  selector: 'app-dp-report-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)" *ngIf="record">
      <div class="modal" style="width:760px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">Dispatch Report — {{ record.id }}</div>
            <div class="modal-subtitle">Final report preview · {{ record.patient }} · {{ record.tests }}</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">

          <!-- Report header -->
          <div style="background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:18px;">

            <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:12px;border-bottom:2px solid var(--brand);margin-bottom:14px;">
              <div>
                <div style="font-size:16px;font-weight:800;color:var(--brand);">Apollo Hospitals</div>
                <div style="font-size:11px;color:var(--text3);">Department of Clinical Pathology</div>
                <div style="font-size:10px;color:var(--text3);margin-top:2px;">NABL Accredited · CAP Certified</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:11px;color:var(--text3);">Report ID</div>
                <div style="font-size:13px;font-weight:700;color:var(--text);">{{ record.id }}</div>
                <div style="font-size:10px;color:var(--text3);margin-top:4px;">Authorized: {{ record.authTime }}</div>
                <div style="font-size:10px;color:var(--text3);">By: {{ record.authBy }}</div>
              </div>
            </div>

            <!-- Patient info -->
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px;font-size:11.5px;">
              <div>
                <div style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:.07em;">Patient</div>
                <div style="font-weight:600;color:var(--text);">{{ record.patient }}</div>
                <div style="color:var(--text2);">{{ record.demo }}</div>
              </div>
              <div>
                <div style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:.07em;">Ward / Location</div>
                <div style="font-weight:600;color:var(--text);">{{ record.demo.split('·')[2] || 'Ward-3 Bed 11' }}</div>
              </div>
              <div>
                <div style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:.07em;">Priority</div>
                <span class="priority" [ngClass]="'priority-' + record.priority"><span class="priority-indicator" [ngClass]="'pi-' + record.priority"></span>{{ record.priority | uppercase }}</span>
              </div>
            </div>

            <!-- Barcode -->
            <div class="barcode-block" style="margin-bottom:14px;">
              <div class="barcode-stripes">
                <div class="bc bc-thick"></div><div class="bc bc-gap"></div><div class="bc bc-thin"></div><div class="bc bc-mid"></div><div class="bc bc-gap"></div><div class="bc bc-thick"></div><div class="bc bc-thin"></div><div class="bc bc-gap"></div><div class="bc bc-mid"></div><div class="bc bc-thick"></div><div class="bc bc-gap"></div><div class="bc bc-thin"></div><div class="bc bc-mid"></div><div class="bc bc-gap"></div><div class="bc bc-thick"></div><div class="bc bc-thin"></div><div class="bc bc-gap"></div><div class="bc bc-mid"></div>
              </div>
              <div>
                <div class="barcode-text">{{ record.id }}</div>
                <div class="barcode-sub">{{ record.tests }} · Authorized {{ record.authTime }}</div>
              </div>
            </div>

            <!-- Results table -->
            <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:8px;">Test Results</div>
            <table class="result-params-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th style="text-align:right;">Result</th>
                  <th style="text-align:center;">Flag</th>
                  <th>Reference Range</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of params" [class.critical-param]="p.flag === 'CRIT'">
                  <td>
                    <div class="param-name" [style.color]="p.flag === 'CRIT' ? 'var(--danger)' : null">{{ p.flag === 'CRIT' ? '⚠ ' : '' }}{{ p.name }}</div>
                    <div class="param-unit">{{ p.unit }}</div>
                  </td>
                  <td style="text-align:right;" class="mono fw600">{{ p.val }}</td>
                  <td style="text-align:center;">
                    <span class="flag-pill" [ngClass]="flagClass(p.flag)">{{ p.flag }}</span>
                  </td>
                  <td class="param-ref">{{ p.ref }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Footer -->
            <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border);font-size:10.5px;color:var(--text3);">
              <div *ngIf="record.flags && record.flags.includes('CRIT')" style="color:var(--danger);font-weight:600;margin-bottom:4px;">
                ⚠ Critical values present. Verbal notification has been logged. Please correlate clinically.
              </div>
              <div>End of report · Page 1 of 1 · Generated electronically</div>
              <div style="margin-top:4px;">Authorized by: <strong>{{ record.authBy }}</strong> · Apollo Hospitals · Dept. of Pathology</div>
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Close</button>
          <button class="act-btn" (click)="downloadPdf()">Download PDF</button>
          <button class="act-btn primary" (click)="sendToWard()">Send to Ward &amp; Mark Dispatched</button>
        </div>
      </div>
    </div>
  `
})
export class DpReportModalComponent {
  record?: DispatchRecord;
  params: ResultParam[] = [];

  constructor(
    private modal: ModalService,
    private toast: ToastService,
    private svc: DispatchService
  ) {
    const ctx = this.modal.context();
    this.record = ctx?.record;
    this.params = this.record?.params || [];
  }

  flagClass(flag: string): string {
    return 'flag-' + (flag === 'CRIT' ? 'C' : flag === 'ABN' ? 'H' : flag);
  }

  downloadPdf(): void {
    this.toast.success(`Downloaded ${this.record?.id}.pdf`);
  }

  sendToWard(): void {
    if (!this.record) { return; }
    this.svc.markDispatched(this.record.id);
    this.toast.success(`Report ${this.record.id} dispatched to ward`);
    this.close();
  }

  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); } }
}
