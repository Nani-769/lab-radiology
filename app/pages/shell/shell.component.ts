import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ModalService } from '@shared/services/modal.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
  tabs = [
    { id: 'lab-orders', label: 'Lab Orders', pill: '28', svg: 'flask' },
    { id: 'radiology', label: 'Radiology', pill: '12', svg: 'radiology' },
    { id: 'result-entry', label: 'Result Entry', pill: '9', svg: 'doc' },
    { id: 'review-authorize', label: 'Review & Authorize', pill: '3', alert: true, svg: 'shield' },
    { id: 'dispatch', label: 'Dispatch', pill: '18', svg: 'truck' },
    { id: 'qc-analytics', label: 'QC & Analytics', pill: '', svg: 'chart' },
    { id: 'external-lab', label: 'External Lab', pill: '5', orange: true, svg: 'ext' }
  ];

  constructor(public modal: ModalService) {}

  openNewOrder(): void { this.modal.open('new-order'); }
  openPrintLabel(): void { this.modal.open('print-label'); }
}
