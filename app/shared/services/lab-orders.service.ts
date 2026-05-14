import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LabOrder, Sample, BillStatus, OrderStatus } from '../models/cms.models';

@Injectable({ providedIn: 'root' })
export class LabOrdersService {
  private _orders$ = new BehaviorSubject<LabOrder[]>([
    { id: 'ORD-2024-4822', patient: 'Sanjay Patel', demo: '38M · MR-15011 · Ward-2 Bed 3', tests: ['CBC', 'CRP', 'Procalcitonin'], priority: 'stat', orderedBy: 'Dr. Ali', dept: 'Critical Care', time: '09:05 AM', timeAgo: '55m ago', billStatus: 'billed', sampleType: 'EDTA Blood', status: 'pending' },
    { id: 'ORD-2024-4821', patient: 'Priya Venkatesh', demo: '45F · MR-10294 · ICU-B Bed 4', tests: ['CBC', 'LFT', 'HbA1c'], priority: 'urgent', orderedBy: 'Dr. Mehta', dept: 'Medicine', time: '08:14 AM', timeAgo: '1h 46m ago', billStatus: 'billed', sampleType: 'EDTA Blood', status: 'pending' },
    { id: 'ORD-2024-4820', patient: 'Arun Kumar', demo: '62M · MR-08811 · Ward-3 Bed 11', tests: ['RFT', 'Creatinine', 'eGFR'], priority: 'routine', orderedBy: 'Dr. Lakshmi', dept: 'Nephrology', time: '08:02 AM', timeAgo: '1h 58m ago', billStatus: 'pending', sampleType: 'Plain Blood', status: 'pending' },
    { id: 'ORD-2024-4819', patient: 'Kavitha Reddy', demo: '33F · MR-12045 · OPD', tests: ['Thyroid Panel', 'Vitamin D'], priority: 'routine', orderedBy: 'Dr. Sharma', dept: 'Endocrinology', time: '07:55 AM', timeAgo: '2h 05m ago', billStatus: 'billed', sampleType: 'Plain Blood', status: 'pending' },
    { id: 'ORD-2024-4815', patient: 'Deepa Nair', demo: '38F · MR-13509 · OPD', tests: ['LFT', 'Total Bilirubin'], priority: 'routine', orderedBy: 'Dr. Mehta', dept: 'Gastro', time: '07:40 AM', timeAgo: '2h 20m ago', billStatus: 'billed', sampleType: 'Plain Blood', status: 'pending' },
    { id: 'ORD-2024-4812', patient: 'Venkat Rao', demo: '52M · MR-16002 · ICU-A', tests: ['PT/INR', 'APTT'], priority: 'stat', orderedBy: 'Dr. Reddy', dept: 'Hematology', time: '09:12 AM', timeAgo: '48m ago', billStatus: 'billed', sampleType: 'Citrate Blood', status: 'pending' },
    { id: 'ORD-2024-4811', patient: 'Raju Naidu', demo: '67M · MR-18700 · ICU-B Bed 1', tests: ['Blood Culture'], priority: 'stat', orderedBy: 'Dr. Ali', dept: 'Critical Care', time: '06:48 AM', timeAgo: '3h 12m ago', billStatus: 'billed', sampleType: 'Blood Culture', status: 'rejected', rejectionReason: 'Haemolysed Sample', rejectedBy: 'S. Kumar' },
    { id: 'ORD-2024-4808', patient: 'Lalitha Devi', demo: '55F · MR-20111 · OPD', tests: ['LFT', 'GGT'], priority: 'routine', orderedBy: 'Dr. Mehta', dept: 'Gastro', time: '07:10 AM', timeAgo: '2h 50m ago', billStatus: 'billed', sampleType: 'Plain Blood', status: 'damaged', rejectionReason: 'Insufficient Volume', rejectedBy: 'T. Priya' }
  ]);

  private _samples$ = new BehaviorSubject<Sample[]>([
    { id: 'SMP-2024-4823', orderId: 'ORD-2024-4812', patient: 'Venkat Rao', demo: '52M · MR-16002 · ICU-A', tests: ['PT/INR', 'APTT'], priority: 'stat', sampleType: 'Citrate Blood', volume: '2.7 mL', orderedBy: 'Dr. Reddy', dept: 'Hematology', time: '09:12 AM', status: 'pending' },
    { id: 'SMP-2024-4822', orderId: 'ORD-2024-4822', patient: 'Sanjay Patel', demo: '38M · MR-15011 · Ward-2 Bed 3', tests: ['CBC', 'CRP'], priority: 'urgent', sampleType: 'EDTA Blood', volume: '3 mL', orderedBy: 'Dr. Ali', dept: 'Critical Care', time: '09:05 AM', status: 'pending' },
    { id: 'SMP-2024-4811', orderId: 'ORD-2024-4811', patient: 'Raju Naidu', demo: '67M · MR-18700 · ICU-B Bed 1', tests: ['Blood Culture'], priority: 'stat', sampleType: 'Blood Culture', volume: '10 mL', orderedBy: 'Dr. Ali', dept: 'Critical Care', time: '06:48 AM', status: 'rejected', reason: 'Haemolysed Sample', rejectedBy: 'S. Kumar (Lab Tech)' },
    { id: 'SMP-2024-4808', orderId: 'ORD-2024-4808', patient: 'Lalitha Devi', demo: '55F · MR-20111 · OPD', tests: ['LFT', 'GGT'], priority: 'routine', sampleType: 'Plain Blood', volume: '3 mL', orderedBy: 'Dr. Mehta', dept: 'Gastro', time: '07:10 AM', status: 'damaged', reason: 'Insufficient Volume', rejectedBy: 'T. Priya (Lab Tech)' }
  ]);

  orders$ = this._orders$.asObservable();
  samples$ = this._samples$.asObservable();

  getOrders(): LabOrder[] { return this._orders$.value; }
  getSamples(): Sample[] { return this._samples$.value; }

  addOrder(order: Partial<LabOrder>): void {
    const id = 'ORD-' + Date.now().toString().slice(-6);
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const newOrder: LabOrder = {
      id,
      patient: order.patient || 'New Patient',
      demo: order.demo || '',
      tests: order.tests || [],
      priority: order.priority || 'routine',
      orderedBy: order.orderedBy || 'Dr. Unknown',
      dept: order.dept || 'General',
      time: now,
      timeAgo: 'just now',
      billStatus: order.billStatus || 'pending',
      sampleType: order.sampleType || 'Plain Blood',
      status: 'pending'
    };
    this._orders$.next([newOrder, ...this._orders$.value]);
  }

  setBillStatus(id: string, billStatus: BillStatus): void {
    this._orders$.next(this._orders$.value.map(o => o.id === id ? { ...o, billStatus } : o));
  }

  setOrderStatus(id: string, status: OrderStatus): void {
    this._orders$.next(this._orders$.value.map(o => o.id === id ? { ...o, status } : o));
  }

  collectSample(orderId: string, data: { sampleType?: string; volume?: string; collectedBy?: string }): void {
    const order = this._orders$.value.find(o => o.id === orderId);
    if (!order) { return; }
    this.setOrderStatus(orderId, 'collected');
    const sample: Sample = {
      id: 'SMP-' + Date.now().toString().slice(-6),
      orderId,
      patient: order.patient,
      demo: order.demo,
      tests: order.tests,
      priority: order.priority,
      sampleType: data.sampleType || order.sampleType,
      volume: data.volume || '3 mL',
      orderedBy: order.orderedBy,
      dept: order.dept,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'collected',
      collectedBy: data.collectedBy || 'Lab Tech'
    };
    this._samples$.next([...this._samples$.value, sample]);
  }

  rejectSample(sampleId: string, reason: string, rejectedBy: string): void {
    this._samples$.next(this._samples$.value.map(s => s.id === sampleId ? { ...s, status: 'rejected', reason, rejectedBy } : s));
  }
}
