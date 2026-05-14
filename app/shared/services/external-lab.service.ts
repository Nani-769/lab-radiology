import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExternalOrder } from '../models/cms.models';

@Injectable({ providedIn: 'root' })
export class ExternalLabService {
  private _orders$ = new BehaviorSubject<ExternalOrder[]>([
    // Scenario A: No lab at hospital — sent out
    { id: 'EXT-A-001', patient: 'Vinod Sinha', demo: '48M · MR-30001', tests: ['Karyotyping', 'FISH'], externalLab: 'Metropolis Healthcare', workflow: 'Dispatched', expectedTat: '5–7 days', status: 'Dispatched', scenario: 'A' },
    { id: 'EXT-A-002', patient: 'Sunita Patel', demo: '52F · MR-30002', tests: ['Vitamin B12', 'Folate'], externalLab: 'Dr. Lal PathLabs', workflow: 'Awaiting Results', expectedTat: '24 hr', status: 'Awaiting', scenario: 'A' },
    { id: 'EXT-A-003', patient: 'Mahesh Kumar', demo: '60M · MR-30003', tests: ['PSA Free', 'PSA Total'], externalLab: 'SRL Diagnostics', workflow: 'Results Received', expectedTat: '24 hr', status: 'Received', scenario: 'A' },
    { id: 'EXT-A-004', patient: 'Geeta Rao', demo: '40F · MR-30004', tests: ['Anti-CCP', 'RA Factor'], externalLab: 'Metropolis Healthcare', workflow: 'Awaiting Results', expectedTat: '48 hr', status: 'Awaiting', scenario: 'A' },
    { id: 'EXT-A-005', patient: 'Rakesh Joshi', demo: '35M · MR-30005', tests: ['HIV ELISA', 'HCV Ab'], externalLab: 'Dr. Lal PathLabs', workflow: 'Dispatched', expectedTat: '12 hr', status: 'Dispatched', scenario: 'A' },
    { id: 'EXT-A-006', patient: 'Lata Iyer', demo: '55F · MR-30006', tests: ['Tumor Markers Panel'], externalLab: 'SRL Diagnostics', workflow: 'Dispatched', expectedTat: '72 hr', status: 'Dispatched', scenario: 'A' },
    { id: 'EXT-A-007', patient: 'Amit Sharma', demo: '42M · MR-30007', tests: ['Genetic Panel — Cardiac'], externalLab: 'Mapmygenome', workflow: 'Awaiting Results', expectedTat: '14 days', status: 'Awaiting', scenario: 'A' },
    // Scenario B: Sample collected here — sent to external
    { id: 'EXT-B-001', patient: 'Komal Singh', demo: '36F · MR-30101', tests: ['BRCA1 / BRCA2'], externalLab: 'Lal PathLabs', workflow: 'Collected', expectedTat: '10 days', status: 'Collected', scenario: 'B', collection: '08:45 AM' },
    { id: 'EXT-B-002', patient: 'Naveen Krishna', demo: '50M · MR-30102', tests: ['Cardiac Enzymes Panel'], externalLab: 'Metropolis', workflow: 'Dispatched', expectedTat: '24 hr', status: 'Dispatched', scenario: 'B', collection: '07:55 AM' },
    { id: 'EXT-B-003', patient: 'Smita Sharma', demo: '29F · MR-30103', tests: ['ANA Profile'], externalLab: 'SRL Diagnostics', workflow: 'Awaiting Results', expectedTat: '48 hr', status: 'Awaiting', scenario: 'B', collection: '07:30 AM' },
    { id: 'EXT-B-004', patient: 'Rohit Mehta', demo: '44M · MR-30104', tests: ['Hepatitis B DNA — Quant'], externalLab: 'Metropolis', workflow: 'Awaiting Results', expectedTat: '72 hr', status: 'Awaiting', scenario: 'B', collection: '07:10 AM' },
    { id: 'EXT-B-005', patient: 'Anitha Pillai', demo: '38F · MR-30105', tests: ['Allergy IgE Panel'], externalLab: 'Lal PathLabs', workflow: 'Dispatched', expectedTat: '5 days', status: 'Dispatched', scenario: 'B', collection: '06:50 AM' }
  ]);

  orders$ = this._orders$.asObservable();
  getOrders(): ExternalOrder[] { return this._orders$.value; }
  getByScenario(s: 'A' | 'B'): ExternalOrder[] { return this._orders$.value.filter(o => o.scenario === s); }
  getReceived(): ExternalOrder[] { return this._orders$.value.filter(o => o.status === 'Received'); }

  addOrder(o: Partial<ExternalOrder>): void {
    const id = (o.scenario === 'B' ? 'EXT-B-' : 'EXT-A-') + (Math.floor(Math.random() * 900) + 100);
    this._orders$.next([{
      id,
      patient: o.patient || 'New Patient',
      demo: o.demo || '',
      tests: o.tests || [],
      externalLab: o.externalLab || '—',
      workflow: 'Dispatched',
      expectedTat: o.expectedTat || '24 hr',
      status: 'Dispatched',
      scenario: o.scenario || 'A',
      collection: o.collection
    }, ...this._orders$.value]);
  }
}
