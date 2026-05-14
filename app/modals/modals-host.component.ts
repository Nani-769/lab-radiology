import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ModalService, ModalState } from '@shared/services/modal.service';

import { NewOrderModalComponent } from './new-order-modal.component';
import { CollectModalComponent } from './collect-modal.component';
import { RejectModalComponent } from './reject-modal.component';
import { RecollectModalComponent } from './recollect-modal.component';
import { ResultEntryModalComponent } from './result-entry-modal.component';
import { ExtSendAModalComponent } from './ext-send-a-modal.component';
import { ExtSendBModalComponent } from './ext-send-b-modal.component';
import { ExtResultEntryModalComponent } from './ext-result-entry-modal.component';
import { BillingModalComponent } from './billing-modal.component';
import { SchedModalComponent } from './sched-modal.component';
import { RoomModalComponent } from './room-modal.component';
import { CheckoutModalComponent } from './checkout-modal.component';
import { PrintLabelModalComponent } from './print-label-modal.component';
import { DpReportModalComponent } from './dp-report-modal.component';

@Component({
  selector: 'app-modals-host',
  standalone: true,
  imports: [
    CommonModule,
    NewOrderModalComponent,
    CollectModalComponent,
    RejectModalComponent,
    RecollectModalComponent,
    ResultEntryModalComponent,
    ExtSendAModalComponent,
    ExtSendBModalComponent,
    ExtResultEntryModalComponent,
    BillingModalComponent,
    SchedModalComponent,
    RoomModalComponent,
    CheckoutModalComponent,
    PrintLabelModalComponent,
    DpReportModalComponent
  ],
  template: `
    <ng-container *ngIf="state$ | async as s">
      <app-new-order-modal       *ngIf="s.id === 'new-order'"></app-new-order-modal>
      <app-collect-modal         *ngIf="s.id === 'collect'"></app-collect-modal>
      <app-reject-modal          *ngIf="s.id === 'reject'"></app-reject-modal>
      <app-recollect-modal       *ngIf="s.id === 'recollect'"></app-recollect-modal>
      <app-result-entry-modal    *ngIf="s.id === 'result-entry'"></app-result-entry-modal>
      <app-ext-send-a-modal      *ngIf="s.id === 'ext-send-a'"></app-ext-send-a-modal>
      <app-ext-send-b-modal      *ngIf="s.id === 'ext-send-b'"></app-ext-send-b-modal>
      <app-ext-result-entry-modal *ngIf="s.id === 'ext-result-entry'"></app-ext-result-entry-modal>
      <app-billing-modal         *ngIf="s.id === 'billing'"></app-billing-modal>
      <app-sched-modal           *ngIf="s.id === 'sched'"></app-sched-modal>
      <app-room-modal            *ngIf="s.id === 'room'"></app-room-modal>
      <app-checkout-modal        *ngIf="s.id === 'checkout'"></app-checkout-modal>
      <app-print-label-modal     *ngIf="s.id === 'print-label'"></app-print-label-modal>
      <app-dp-report-modal       *ngIf="s.id === 'dp-report'"></app-dp-report-modal>
    </ng-container>
  `
})
export class ModalsHostComponent implements OnInit {
  state$!: Observable<ModalState>;
  constructor(private svc: ModalService) {}
  ngOnInit(): void { this.state$ = this.svc.state$; }
}
