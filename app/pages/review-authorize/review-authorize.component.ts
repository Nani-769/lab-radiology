import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ReviewService } from '@shared/services/results.service';
import { ToastService } from '@shared/services/toast.service';
import { ReviewItem } from '@shared/models/cms.models';

type Filter = 'all' | 'critical' | 'pending';

@Component({
  selector: 'app-review-authorize',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-authorize.component.html',
  styleUrls: ['./review-authorize.component.scss']
})
export class ReviewAuthorizeComponent implements OnInit {

  view: 'grid' | 'detail' = 'grid';
  filter: Filter = 'all';
  query = '';

  items$!: Observable<ReviewItem[]>;
  selected?: ReviewItem;
  selectedIndex = 0;

  constructor(private reviewSvc: ReviewService, private toast: ToastService) {}

  ngOnInit(): void { this.items$ = this.reviewSvc.items$; }

  filtered(items: ReviewItem[]): ReviewItem[] {
    return items.filter(i => {
      if (this.filter === 'critical' && i.status !== 'critical') { return false; }
      if (this.filter === 'pending' && i.status !== 'pending') { return false; }
      if (this.query) {
        const q = this.query.toLowerCase();
        return i.patient.toLowerCase().includes(q) || i.sampleId.toLowerCase().includes(q);
      }
      return true;
    });
  }

  openDetail(item: ReviewItem, list: ReviewItem[]): void {
    this.selected = item;
    this.selectedIndex = list.indexOf(item);
    this.view = 'detail';
  }
  closeDetail(): void { this.view = 'grid'; }

  navDetail(dir: -1 | 1, list: ReviewItem[]): void {
    const next = this.selectedIndex + dir;
    if (next < 0 || next >= list.length) { return; }
    this.selectedIndex = next;
    this.selected = list[next];
  }

  authorize(item: ReviewItem): void {
    this.toast.success(`Authorized & Released — ${item.patient} (${item.sampleId})`);
    this.reviewSvc.authorize(item.id);
    this.view = 'grid';
  }

  returnForRevision(item: ReviewItem): void {
    this.toast.warn(`Returned for revision — ${item.patient}`);
  }

  holdRelease(item: ReviewItem): void {
    this.toast.warn(`Held — ${item.patient}`);
  }

  batchAuthorizeRoutine(items: ReviewItem[]): void {
    const routines = items.filter(i => i.priority === 'routine');
    routines.forEach(r => this.reviewSvc.authorize(r.id));
    this.toast.success(`Batch authorized ${routines.length} routine reports`);
  }

  statusBadge(s: string): string {
    return s === 'critical' ? 'badge-critical'
      : s === 'pending' ? 'badge-ready'
      : 'badge-ordered';
  }

  flagPillClass(flag: string): string {
    if (flag.includes('CRIT')) { return 'flag-C'; }
    if (flag.includes('H')) { return 'flag-H'; }
    if (flag.includes('L')) { return 'flag-L'; }
    return 'flag-N';
  }

  count(items: ReviewItem[], pred: (i: ReviewItem) => boolean): number { return items.filter(pred).length; }
  countCritical(items: ReviewItem[]): number { return items.filter(i => i.status === 'critical').length; }
  countPending(items: ReviewItem[]): number { return items.filter(i => i.status === 'pending').length; }

  trackById(_: number, item: ReviewItem): string { return item.id; }
}
