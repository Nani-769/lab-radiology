import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResultItem, ReviewItem, DispatchRecord } from '../models/cms.models';

@Injectable({ providedIn: 'root' })
export class ResultsService {
  private _items$ = new BehaviorSubject<ResultItem[]>([
    { id: 'r1', sampleId: 'SMP-2024-4821', patient: 'Priya Venkatesh', demo: '45F · MR-10294', tests: 'CBC with Differential', priority: 'stat', status: 'critical', collected: '08:14 AM', tat: '2h 10m', location: 'ICU-B · B4', badge: 'CRIT' },
    { id: 'r2', sampleId: 'SMP-2024-4816', patient: 'Ravi Shankar', demo: '38M · MR-09812', tests: 'Culture & Sensitivity', priority: 'stat', status: 'processing', collected: '06:58 AM', tat: '3h 26m', location: 'Ward-2 · B9', badge: 'Processing' },
    { id: 'r3', sampleId: 'SMP-2024-4820', patient: 'Arun Kumar', demo: '62M · MR-08811', tests: 'RFT · Creatinine · eGFR', priority: 'urgent', status: 'pending', collected: '08:02 AM', tat: '2h 22m', location: 'OPD · Room 3', badge: 'Pending' },
    { id: 'r4', sampleId: 'SMP-2024-4817', patient: 'Meena Krishnan', demo: '29F · MR-11422', tests: 'Beta-HCG · Progesterone', priority: 'urgent', status: 'processing', collected: '07:22 AM', tat: '3h 02m', location: 'Ward-3 · B14', badge: 'Processing' },
    { id: 'r5', sampleId: 'SMP-2024-4819', patient: 'Kavitha Reddy', demo: '33F · MR-12045', tests: 'Thyroid Panel · Vitamin D', priority: 'routine', status: 'collected', collected: '07:55 AM', tat: '2h 29m', location: 'OPD', badge: 'Collected' },
    { id: 'r6', sampleId: 'SMP-2024-4815', patient: 'Deepa Nair', demo: '41F · MR-07631', tests: 'LFT · Total Bilirubin', priority: 'routine', status: 'processing', collected: '07:40 AM', tat: '2h 44m', location: 'Ward-1 · B11', badge: 'Processing' },
    { id: 'r7', sampleId: 'SMP-2024-4814', patient: 'Suresh Babu', demo: '55M · MR-09333', tests: 'Lipid Profile · Glucose-F', priority: 'routine', status: 'collected', collected: '07:30 AM', tat: '2h 54m', location: 'Ward-1 · B6', badge: 'Collected' },
    { id: 'r8', sampleId: 'SMP-2024-4813', patient: 'Ramesh Iyer', demo: '50M · MR-06541', tests: 'HbA1c · Fasting Glucose', priority: 'routine', status: 'processing', collected: '07:10 AM', tat: '3h 14m', location: 'OPD', badge: 'Processing' },
    { id: 'r9', sampleId: 'SMP-2024-4812', patient: 'Anita Sharma', demo: '28F · MR-13208', tests: 'Urine R/M · Culture', priority: 'routine', status: 'collected', collected: '06:55 AM', tat: '3h 29m', location: 'OPD', badge: 'Collected' }
  ]);

  items$ = this._items$.asObservable();
  getItems(): ResultItem[] { return this._items$.value; }
  remove(id: string): void { this._items$.next(this._items$.value.filter(i => i.id !== id)); }
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private _items$ = new BehaviorSubject<ReviewItem[]>([
    {
      id: 'rv1', sampleId: 'SMP-2024-4821', patient: 'Priya Venkatesh', demo: '45F · MR-10294', tests: 'CBC with Differential',
      priority: 'stat', status: 'critical', flags: ['CRIT', 'L×2'], technician: 'T. Ravi', location: 'ICU-B · B4',
      comment: 'Critical platelet count (42×10³/µL). Verbal notification given to Dr. Mehta at 09:30 AM.',
      params: [
        { name: 'Hemoglobin', unit: 'g/dL', val: '11.2', flag: 'L', ref: '12.0–17.0' },
        { name: 'Platelet Count', unit: '×10³/µL', val: '42', flag: 'CRIT', ref: '150–400' },
        { name: 'WBC Count', unit: '×10³/µL', val: '8.4', flag: 'N', ref: '4.5–11.0' },
        { name: 'Hematocrit', unit: '%', val: '34.6', flag: 'L', ref: '36.0–52.0' }
      ]
    },
    {
      id: 'rv2', sampleId: 'SMP-2024-4818', patient: 'Suresh Babu', demo: '55M · MR-09333', tests: 'Lipid Profile + Glucose-F',
      priority: 'routine', status: 'pending', flags: ['H×3', 'L×1'], technician: 'S. Kumar', location: 'Ward-1 · B6',
      comment: 'Total cholesterol and LDL elevated. Dietary modification and statin review advised.',
      params: [
        { name: 'Total Cholesterol', unit: 'mg/dL', val: '218', flag: 'H', ref: '<200' },
        { name: 'Fasting Glucose', unit: 'mg/dL', val: '118', flag: 'H', ref: '70–100' },
        { name: 'HDL Cholesterol', unit: 'mg/dL', val: '38', flag: 'L', ref: '40–60' },
        { name: 'LDL Cholesterol', unit: 'mg/dL', val: '148', flag: 'H', ref: '<130' },
        { name: 'Triglycerides', unit: 'mg/dL', val: '160', flag: 'H', ref: '<150' }
      ]
    },
    {
      id: 'rv3', sampleId: 'SMP-2024-4819', patient: 'Kavitha Reddy', demo: '33F · MR-12045', tests: 'Thyroid Panel + Vitamin D',
      priority: 'routine', status: 'pending', flags: ['H×1', 'L×3'], technician: 'A. Priya', location: 'OPD',
      comment: 'TSH elevated, T3/T4 suppressed. Consistent with hypothyroidism. Vitamin D deficient.',
      params: [
        { name: 'TSH', unit: 'mIU/L', val: '6.8', flag: 'H', ref: '0.4–4.0' },
        { name: 'Free T3', unit: 'pg/mL', val: '2.8', flag: 'L', ref: '3.1–6.8' },
        { name: 'Free T4', unit: 'ng/dL', val: '0.82', flag: 'L', ref: '0.9–1.8' },
        { name: 'Vitamin D (25-OH)', unit: 'ng/mL', val: '14.2', flag: 'L', ref: '30–100' }
      ]
    }
  ]);

  items$ = this._items$.asObservable();
  getItems(): ReviewItem[] { return this._items$.value; }
  authorize(id: string): void { this._items$.next(this._items$.value.filter(i => i.id !== id)); }
}

@Injectable({ providedIn: 'root' })
export class DispatchService {
  private _records$ = new BehaviorSubject<DispatchRecord[]>([
    { id: 'SMP-2024-4821', patient: 'Priya Venkatesh', demo: '45F · MR-10294 · ICU-B Bed 4', tests: 'CBC with Differential', priority: 'stat', flags: 'CRIT, L×2', authBy: 'Dr. Ravi Sharma', authTime: '10:32 AM', location: 'ICU-B', ward: 'ICU-B Bed 4', phone: '9876543210', dispatched: false, comment: 'Critical platelet count.', params: [{ name: 'Hemoglobin', unit: 'g/dL', val: '11.2', flag: 'L', ref: '12.0–17.0' }, { name: 'Platelet Count', unit: '×10³/µL', val: '42', flag: 'CRIT', ref: '150–400' }] },
    { id: 'SMP-2024-4818', patient: 'Suresh Babu', demo: '55M · MR-09333 · Ward-1 Bed 6', tests: 'Lipid Profile + Glucose-F', priority: 'routine', flags: 'H×3, L×1', authBy: 'Dr. Ravi Sharma', authTime: '10:44 AM', location: 'Ward-1', ward: 'Ward-1 Bed 6', phone: '9876543211', dispatched: false, comment: 'LDL elevated. Statin review advised.', params: [{ name: 'Total Cholesterol', unit: 'mg/dL', val: '218', flag: 'H', ref: '<200' }, { name: 'LDL', unit: 'mg/dL', val: '148', flag: 'H', ref: '<130' }] },
    { id: 'SMP-2024-4819', patient: 'Kavitha Reddy', demo: '33F · MR-12045 · OPD', tests: 'Thyroid Panel + Vitamin D', priority: 'routine', flags: 'H×1, L×3', authBy: 'Dr. Ravi Sharma', authTime: '10:51 AM', location: 'OPD', ward: 'OPD', phone: '9876543212', dispatched: false, comment: 'Hypothyroidism. Vit D deficient.', params: [{ name: 'TSH', unit: 'mIU/L', val: '6.8', flag: 'H', ref: '0.4–4.0' }, { name: 'Vitamin D', unit: 'ng/mL', val: '14.2', flag: 'L', ref: '30–100' }] },
    { id: 'SMP-2024-4810', patient: 'Ravi Shankar', demo: '70M · MR-07122 · ICU-A Bed 2', tests: 'Culture & Sensitivity', priority: 'stat', flags: 'ABN', authBy: 'Dr. Ravi Sharma', authTime: '09:15 AM', location: 'ICU-A', ward: 'ICU-A Bed 2', phone: '9876543213', dispatched: true, comment: 'GPC clusters on Gram stain.', params: [{ name: 'Gram Stain', unit: '—', val: 'GPC clusters', flag: 'ABN', ref: 'No organisms' }] },
    { id: 'SMP-2024-4808', patient: 'Meena Krishnan', demo: '28F · MR-11287 · Gynec OPD', tests: 'Beta-HCG + Progesterone', priority: 'urgent', flags: 'H×1', authBy: 'Dr. Ravi Sharma', authTime: '09:55 AM', location: 'OPD', ward: 'Gynec OPD', phone: '9876543214', dispatched: true, comment: 'Beta-HCG positive.', params: [{ name: 'Beta-HCG', unit: 'mIU/mL', val: '4820', flag: 'H', ref: 'Non-preg <5' }] },
    { id: 'SMP-2024-4807', patient: 'Deepa Nair', demo: '38F · MR-13509 · OPD', tests: 'LFT + Total Bilirubin', priority: 'routine', flags: 'H×3', authBy: 'Dr. Ravi Sharma', authTime: '09:40 AM', location: 'OPD', ward: 'OPD', phone: '9876543215', dispatched: true, comment: 'Bilirubin elevated. Hepatitis panel recommended.', params: [{ name: 'Total Bilirubin', unit: 'mg/dL', val: '3.8', flag: 'H', ref: '0.2–1.2' }] },
    { id: 'SMP-2024-4805', patient: 'Arun Kumar', demo: '62M · MR-08811 · Ward-3 Bed 11', tests: 'RFT + Creatinine + eGFR', priority: 'urgent', flags: 'H×3, L×1', authBy: 'Dr. Ravi Sharma', authTime: '09:20 AM', location: 'Ward-3', ward: 'Ward-3 Bed 11', phone: '9876543216', dispatched: true, comment: 'Creatinine markedly elevated. Urgent nephrology review.', params: [{ name: 'Creatinine', unit: 'mg/dL', val: '3.8', flag: 'H', ref: '0.7–1.3' }, { name: 'eGFR', unit: 'mL/min', val: '18', flag: 'L', ref: '>60' }] }
  ]);

  records$ = this._records$.asObservable();
  getRecords(): DispatchRecord[] { return this._records$.value; }

  markDispatched(id: string): void {
    this._records$.next(this._records$.value.map(r => r.id === id ? { ...r, dispatched: true } : r));
  }
}
