import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-print-label-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlay($event)">
      <div class="modal" style="width:520px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">Print Sample Label</div>
            <div class="modal-subtitle">Preview before sending to label printer</div>
          </div>
          <button class="modal-close" (click)="close()">✕</button>
        </div>
        <div class="modal-body">

          <!-- Label preview -->
          <div style="background:#fff;border:2px dashed var(--border);border-radius:var(--radius);padding:18px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
              <div>
                <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.1em;">Apollo Hospitals — Lab</div>
                <div style="font-size:14px;font-weight:700;color:var(--text);margin-top:2px;">{{ patient }}</div>
                <div style="font-size:11px;color:var(--text2);">{{ demo }}</div>
              </div>
              <span class="priority" [ngClass]="'priority-' + priority"><span class="priority-indicator" [ngClass]="'pi-' + priority"></span>{{ priority | uppercase }}</span>
            </div>

            <div class="barcode-block" style="margin:0;background:transparent;border:none;padding:0;">
              <div class="barcode-stripes">
                <div class="bc bc-thick"></div><div class="bc bc-gap"></div><div class="bc bc-thin"></div><div class="bc bc-mid"></div><div class="bc bc-gap"></div><div class="bc bc-thick"></div><div class="bc bc-thin"></div><div class="bc bc-gap"></div><div class="bc bc-mid"></div><div class="bc bc-thick"></div><div class="bc bc-gap"></div><div class="bc bc-thin"></div><div class="bc bc-mid"></div><div class="bc bc-gap"></div><div class="bc bc-thick"></div><div class="bc bc-thin"></div><div class="bc bc-gap"></div><div class="bc bc-mid"></div>
              </div>
              <div>
                <div class="barcode-text">{{ sampleId }}</div>
                <div class="barcode-sub">{{ sampleType }}</div>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:12px;font-size:11px;">
              <div><span style="color:var(--text3);">Tests:</span> <strong>{{ tests }}</strong></div>
              <div><span style="color:var(--text3);">Ward:</span> <strong>{{ ward }}</strong></div>
              <div><span style="color:var(--text3);">Collected:</span> <strong>{{ collected }}</strong></div>
              <div><span style="color:var(--text3);">By:</span> <strong>{{ collectedBy }}</strong></div>
            </div>
          </div>

          <div style="margin-top:14px;display:flex;gap:10px;align-items:center;">
            <label class="form-label" style="margin:0;">Copies</label>
            <input type="number" class="form-input" [(ngModel)]="copies" style="width:80px;" min="1" max="10" />
            <label class="form-label" style="margin:0;margin-left:auto;">Printer</label>
            <select class="form-select" [(ngModel)]="printer" style="width:200px;">
              <option>Zebra ZD420 — Lab Reception</option>
              <option>Zebra ZD420 — Collection Bay</option>
              <option>Brother QL-820 — OPD</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="act-btn" (click)="close()">Cancel</button>
          <button class="act-btn primary" (click)="submit()">Print {{ copies }} Label{{ copies > 1 ? 's' : '' }}</button>
        </div>
      </div>
    </div>
  `
})
export class PrintLabelModalComponent {
  sampleId = 'SMP-' + Date.now().toString().slice(-6);
  patient = 'Priya Sharma';
  demo = '45F · MR-10294';
  priority: 'stat' | 'urgent' | 'routine' = 'urgent';
  sampleType = 'EDTA Blood · 3 mL';
  tests = 'CBC, LFT';
  ward = 'Ward-3 · Bed 11';
  collected = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  collectedBy = 'T. Ravi';

  copies = 1;
  printer = 'Zebra ZD420 — Lab Reception';

  constructor(private modal: ModalService, private toast: ToastService) {
    const ctx = this.modal.context();
    if (ctx?.order) {
      this.patient = ctx.order.patient;
      this.demo = ctx.order.demo;
      this.priority = ctx.order.priority;
      this.tests = (ctx.order.tests || []).join(', ');
      this.sampleType = ctx.order.sampleType + ' · 3 mL';
      this.ward = ctx.order.dept || this.ward;
    }
    if (ctx?.sample) {
      this.sampleId = ctx.sample.id;
      this.patient = ctx.sample.patient;
      this.priority = ctx.sample.priority;
      this.sampleType = ctx.sample.type;
      this.collectedBy = ctx.sample.collectedBy;
    }
  }

  submit(): void {
    this.toast.success(`Printed ${this.copies} label${this.copies > 1 ? 's' : ''} to ${this.printer.split('—')[1]?.trim() || 'printer'}`);
    this.close();
  }

  close(): void { this.modal.close(); }
  onOverlay(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('modal-overlay')) { this.close(); } }
}
