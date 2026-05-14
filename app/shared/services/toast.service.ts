import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private message: MessageService) {}

  show(detail: string, severity: 'success' | 'info' | 'warn' | 'error' = 'info'): void {
    this.message.add({ severity, summary: this.summaryFor(severity), detail, life: 3000 });
  }

  success(detail: string): void { this.show(detail, 'success'); }
  warn(detail: string): void { this.show(detail, 'warn'); }
  error(detail: string): void { this.show(detail, 'error'); }
  info(detail: string): void { this.show(detail, 'info'); }

  private summaryFor(s: string): string {
    return s === 'success' ? 'Success' : s === 'warn' ? 'Notice' : s === 'error' ? 'Error' : 'Info';
  }
}
