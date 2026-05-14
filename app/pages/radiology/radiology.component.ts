import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { RadiologyService } from '@shared/services/radiology.service';
import { ModalService } from '@shared/services/modal.service';
import { ToastService } from '@shared/services/toast.service';
import { RadiologyPatient, MachineStatus } from '@shared/models/cms.models';

type Modality = 'xray' | 'ct' | 'mri' | 'usg' | 'nuc';

interface ColumnDef {
  key: Modality;
  name: string;
  equip: string;
  iconBg: string;
  color: string;
  totalKey: string;
  stats: { label: string; count: number; kind?: string }[];
}

@Component({
  selector: 'app-radiology',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './radiology.component.html',
  styleUrls: ['./radiology.component.scss']
})
export class RadiologyComponent implements OnInit {

  workspaceOpen = true;
  machinesOpen = true;

  // Filters
  stageFilter: 'all' | 'queued' | 'scheduled' | 'checkin' | 'imaging' | 'reporting' | 'authorized' = 'all';
  priorityFilter: 'all' | 'stat' | 'urgent' | 'routine' = 'all';
  modalityFilter: Modality | 'all' = 'all';

  patients$!: Observable<RadiologyPatient[]>;
  machines$!: Observable<MachineStatus[]>;

  collapsedCols: Record<Modality, boolean> = { xray: false, ct: false, mri: false, usg: false, nuc: false };

  columns: ColumnDef[] = [
    { key: 'xray', name: 'X-Ray',       equip: 'GE Optima · Siemens Multix', iconBg: '#e3f2fd',   color: '#0277bd', totalKey: '21',
      stats: [{ label: 'Total', count: 21 }, { label: 'STAT', count: 4, kind: 'stat' }, { label: 'Scanning', count: 2, kind: 'scan' }, { label: 'Done', count: 12, kind: 'done' }] },
    { key: 'ct',   name: 'CT Scan',      equip: '64-slice Siemens SOMATOM',    iconBg: 'var(--purple-bg)', color: 'var(--purple)', totalKey: '14',
      stats: [{ label: 'Total', count: 14 }, { label: 'STAT', count: 2, kind: 'stat' }, { label: 'Scanning', count: 2, kind: 'scan' }, { label: 'Done', count: 7, kind: 'done' }] },
    { key: 'mri',  name: 'MRI',          equip: '3T GE SIGNA · 1.5T Philips',  iconBg: 'var(--teal-bg)',   color: 'var(--teal)', totalKey: '8',
      stats: [{ label: 'Total', count: 8 }, { label: 'Urgent', count: 1, kind: 'urgent' }, { label: 'Scanning', count: 1, kind: 'scan' }, { label: 'Safety', count: 2 }] },
    { key: 'usg',  name: 'Ultrasound',   equip: 'Philips · GE Voluson · Mindray', iconBg: 'var(--orange-bg)', color: 'var(--orange)', totalKey: '4',
      stats: [{ label: 'Total', count: 4 }, { label: 'Scanning', count: 1, kind: 'scan' }, { label: 'Reporting', count: 1 }, { label: 'Done', count: 2, kind: 'done' }] },
    { key: 'nuc',  name: 'Nuclear Med',  equip: 'PET-CT · SPECT-CT',            iconBg: 'var(--success-bg)', color: 'var(--success)', totalKey: '2',
      stats: [{ label: 'Total', count: 2 }, { label: 'Radiopharmacy', count: 2 }] }
  ];

  constructor(
    private radSvc: RadiologyService,
    private modal: ModalService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.patients$ = this.radSvc.patients$;
    this.machines$ = this.radSvc.machines$;
  }

  // ── Section toggles ──
  toggleWorkspace(): void { this.workspaceOpen = !this.workspaceOpen; }
  toggleMachines(): void { this.machinesOpen = !this.machinesOpen; }
  toggleColumn(k: Modality): void { this.collapsedCols[k] = !this.collapsedCols[k]; }

  // ── Filtering ──
  patientsFor(col: Modality, all: RadiologyPatient[] | null): RadiologyPatient[] {
    if (!all) { return []; }
    return all.filter(p => p.modality === col)
      .filter(p => this.stageFilter === 'all' || p.stage === this.stageFilter)
      .filter(p => this.priorityFilter === 'all' || p.priority === this.priorityFilter);
  }

  machinesFor(col: Modality, all: MachineStatus[] | null): MachineStatus[] {
    if (!all) { return []; }
    return all.filter(m => m.modality === col);
  }

  setStageFilter(s: typeof this.stageFilter): void { this.stageFilter = s; }
  setPriorityFilter(p: typeof this.priorityFilter): void { this.priorityFilter = p; }

  // ── Actions ──
  openScheduleModal(modality: Modality): void { this.modal.open('sched', { modality }); }
  openRoomModal(modality: Modality, patientId: string): void { this.modal.open('room', { modality, patientId }); }
  openCheckout(patientId: string): void { this.modal.open('checkout', { patientId }); }
  openDicom(): void { this.toast.success('Launching DICOM viewer…'); }

  generateQueueToken(p: any): void {
    this.toast.success('Queue token generated successfully');
    p.queueNo = Math.floor(Math.random() * 10) + 1; // Mock queue number
  }

  // ── Styling Helpers ──
  getEpcClass(p: any): string {
    const classes = [];
    if (p.stage === 'checkin') classes.push('epc-checkin');
    if (p.stage === 'imaging') classes.push('epc-scanning');
    if (p.stage === 'reporting' || p.stage === 'authorized') classes.push('epc-done');
    if (p.queueNo) classes.push('epc-has-queue');
    return classes.join(' ');
  }

  getStripeColor(p: any): string {
    const colors: Record<string, string> = {
      queued: '#3b82f6',
      scheduled: 'var(--info)',
      checkin: 'var(--warning)',
      imaging: 'var(--purple)',
      reporting: 'var(--brand)',
      authorized: 'var(--success)'
    };
    return colors[p.stage] || 'var(--border)';
  }

  stageBadgeClass(s: string): string {
    switch (s) {
      case 'queued': return 'badge-ordered';
      case 'scheduled': return 'badge-scheduled';
      case 'checkin': return 'badge-processing';
      case 'imaging': return 'badge-imaging';
      case 'reporting': return 'badge-reported';
      case 'authorized': return 'badge-approved';
      default: return 'badge-pending';
    }
  }

  stageLabel(s: string): string {
    const map: Record<string, string> = { queued: 'Queued', scheduled: 'Scheduled', checkin: 'Check-in', imaging: 'Imaging', reporting: 'Reporting', authorized: 'Authorized' };
    return map[s] || s;
  }

  machineStateClass(s: string): string {
    return s === 'busy' ? 'mgcb-busy' : s === 'available' ? 'mgcb-avail' : 'mgcb-maint';
  }

  machineStateLabel(s: string): string {
    return s === 'busy' ? 'Busy' : s === 'available' ? 'Available' : 'Maintenance';
  }

  trackById(_: number, item: any): string { return item.id; }
  trackByKey(_: number, item: ColumnDef): string { return item.key; }
}