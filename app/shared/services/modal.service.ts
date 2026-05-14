import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ModalId =
  | 'new-order'
  | 'collect'
  | 'reject'
  | 'recollect'
  | 'result-entry'
  | 'ext-send-a'
  | 'ext-send-b'
  | 'ext-result-entry'
  | 'billing'
  | 'sched'
  | 'room'
  | 'checkout'
  | 'print-label'
  | 'dp-report'
  | null;

export interface ModalState {
  id: ModalId;
  ctx?: any;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private _state$ = new BehaviorSubject<ModalState>({ id: null });
  state$ = this._state$.asObservable();

  open(id: ModalId, ctx?: any): void { this._state$.next({ id, ctx }); }
  close(): void { this._state$.next({ id: null }); }
  isOpen(id: ModalId): boolean { return this._state$.value.id === id; }
  context(): any { return this._state$.value.ctx; }
}
