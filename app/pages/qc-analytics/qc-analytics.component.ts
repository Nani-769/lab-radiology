import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '@shared/services/toast.service';

interface QcCard {
  instrument: string;
  passRate: number;
  passColor: string;
  violations: number;
  samples: number;
  rows: { label: string; status: 'In control' | 'Warning'; statusColor: string; pct: number; barColor: string; legend: string; mean: string; legendHi: string; }[];
}

interface TatBar { h: number; color: string; opacity?: number; }
interface TatItem { label: string; bars: TatBar[]; value: string; valueColor: string; target: string; }

@Component({
  selector: 'app-qc-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qc-analytics.component.html',
  styleUrls: ['./qc-analytics.component.scss']
})
export class QcAnalyticsComponent {

  qcCards: QcCard[] = [
    {
      instrument: 'Sysmex XN-1000',
      passRate: 98.4, passColor: 'var(--success)', violations: 0, samples: 247,
      rows: [
        { label: 'Hemoglobin QC', status: 'In control', statusColor: 'var(--success)', pct: 94, barColor: 'var(--success)', legend: 'L2: 11.8', mean: 'Mean: 13.2 (Target: 13.4)', legendHi: 'L2: 14.6' },
        { label: 'Platelet QC', status: 'Warning', statusColor: 'var(--warning)', pct: 78, barColor: 'var(--warning)', legend: 'L2: 180', mean: 'Mean: 248 (Target: 260)', legendHi: 'L2: 340' }
      ]
    },
    {
      instrument: 'Roche Cobas C501',
      passRate: 99.1, passColor: 'var(--success)', violations: 0, samples: 183,
      rows: [
        { label: 'Glucose QC (L1)', status: 'In control', statusColor: 'var(--success)', pct: 92, barColor: 'var(--success)', legend: 'L2: 4.2', mean: 'Mean: 5.1 mmol/L (Target: 5.0)', legendHi: 'L2: 5.8' },
        { label: 'Creatinine QC', status: 'In control', statusColor: 'var(--success)', pct: 97, barColor: 'var(--success)', legend: 'L2: 88', mean: 'Mean: 106 µmol/L (Target: 104)', legendHi: 'L2: 122' }
      ]
    }
  ];

  tatItems: TatItem[] = [
    { label: 'Hematology', valueColor: 'var(--success)', value: '1.8h avg', target: 'Target: 2h ✓',
      bars: [{ h: 55, color: 'var(--brand)' }, { h: 60, color: 'var(--brand)' }, { h: 50, color: 'var(--brand)' }, { h: 65, color: 'var(--brand)' }, { h: 58, color: 'var(--brand)', opacity: 0.5 }] },
    { label: 'Biochemistry', valueColor: 'var(--warning)', value: '3.8h avg', target: 'Target: 4h ✓',
      bars: [{ h: 75, color: 'var(--warning)' }, { h: 72, color: 'var(--warning)' }, { h: 80, color: 'var(--warning)' }, { h: 70, color: 'var(--warning)' }, { h: 75, color: 'var(--warning)', opacity: 0.5 }] },
    { label: 'Microbiology', valueColor: 'var(--teal)', value: '48h avg', target: 'Target: 72h ✓',
      bars: [{ h: 40, color: 'var(--teal)' }, { h: 45, color: 'var(--teal)' }, { h: 38, color: 'var(--teal)' }, { h: 50, color: 'var(--teal)' }, { h: 42, color: 'var(--teal)', opacity: 0.5 }] },
    { label: 'Radiology', valueColor: 'var(--danger)', value: '4.2h avg', target: 'Target: 4h ⚠',
      bars: [{ h: 90, color: 'var(--danger)' }, { h: 88, color: 'var(--danger)' }, { h: 95, color: 'var(--danger)' }, { h: 92, color: 'var(--danger)' }, { h: 90, color: 'var(--danger)', opacity: 0.5 }] }
  ];

  constructor(private toast: ToastService) {}

  exportReport(): void { this.toast.success('QC Report exported as PDF'); }
}
