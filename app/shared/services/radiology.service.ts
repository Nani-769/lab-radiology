import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RadiologyPatient, MachineStatus } from '../models/cms.models';

@Injectable({ providedIn: 'root' })
export class RadiologyService {
  private _patients$ = new BehaviorSubject<RadiologyPatient[]>([
    // X-Ray
    { id: 'RAD-001', name: 'Anil Mehra', age: 58, sex: 'M', mrn: 'MR-22001', test: 'Chest PA', modality: 'xray', priority: 'stat', stage: 'queued', notes: 'Suspected pneumonia' },
    { id: 'RAD-002', name: 'Vimala Iyer', age: 45, sex: 'F', mrn: 'MR-22002', test: 'L-Spine AP/Lat', modality: 'xray', priority: 'urgent', stage: 'scheduled', scheduledTime: '10:30 AM' },
    { id: 'RAD-003', name: 'Suresh Kumar', age: 32, sex: 'M', mrn: 'MR-22003', test: 'Right Knee AP', modality: 'xray', priority: 'routine', stage: 'checkin', room: 'XR-1' },
    { id: 'RAD-004', name: 'Lakshmi Devi', age: 67, sex: 'F', mrn: 'MR-22004', test: 'Chest PA', modality: 'xray', priority: 'routine', stage: 'imaging', room: 'XR-1', technician: 'R. Reddy' },
    { id: 'RAD-005', name: 'Rakesh Sharma', age: 51, sex: 'M', mrn: 'MR-22005', test: 'Abdominal Series', modality: 'xray', priority: 'urgent', stage: 'reporting', doctor: 'Dr. Krishnan' },
    { id: 'RAD-006', name: 'Pooja Singh', age: 28, sex: 'F', mrn: 'MR-22006', test: 'Ankle AP/Lat', modality: 'xray', priority: 'routine', stage: 'authorized' },
    // CT
    { id: 'RAD-101', name: 'Ramesh Babu', age: 64, sex: 'M', mrn: 'MR-22101', test: 'CT Head — Non-contrast', modality: 'ct', priority: 'stat', stage: 'queued', notes: 'Stroke protocol' },
    { id: 'RAD-102', name: 'Sneha Verma', age: 39, sex: 'F', mrn: 'MR-22102', test: 'CT Abdomen — Contrast', modality: 'ct', priority: 'urgent', stage: 'scheduled', scheduledTime: '11:00 AM' },
    { id: 'RAD-103', name: 'Arjun Patel', age: 47, sex: 'M', mrn: 'MR-22103', test: 'CT Chest HRCT', modality: 'ct', priority: 'routine', stage: 'imaging', room: 'CT-1', technician: 'S. Babu' },
    { id: 'RAD-104', name: 'Maya Reddy', age: 56, sex: 'F', mrn: 'MR-22104', test: 'CT Pelvis', modality: 'ct', priority: 'routine', stage: 'reporting', doctor: 'Dr. Krishnan' },
    // MRI
    { id: 'RAD-201', name: 'Vikram Joshi', age: 42, sex: 'M', mrn: 'MR-22201', test: 'MRI Brain', modality: 'mri', priority: 'urgent', stage: 'queued', notes: 'Headache, vision loss' },
    { id: 'RAD-202', name: 'Anjali Pillai', age: 35, sex: 'F', mrn: 'MR-22202', test: 'MRI L-Spine', modality: 'mri', priority: 'routine', stage: 'scheduled', scheduledTime: '02:00 PM' },
    { id: 'RAD-203', name: 'Kiran Rao', age: 50, sex: 'M', mrn: 'MR-22203', test: 'MRI Knee', modality: 'mri', priority: 'routine', stage: 'imaging', room: 'MRI-1', technician: 'P. Kumar' },
    // USG
    { id: 'RAD-301', name: 'Geetha Krishnan', age: 30, sex: 'F', mrn: 'MR-22301', test: 'USG Abdomen', modality: 'usg', priority: 'routine', stage: 'queued' },
    { id: 'RAD-302', name: 'Madhuri Nair', age: 26, sex: 'F', mrn: 'MR-22302', test: 'Obstetric USG', modality: 'usg', priority: 'routine', stage: 'imaging', room: 'USG-1', technician: 'L. Nair' },
    // Nuc Med
    { id: 'RAD-401', name: 'Prakash Menon', age: 60, sex: 'M', mrn: 'MR-22401', test: 'PET-CT Whole Body', modality: 'nuc', priority: 'urgent', stage: 'scheduled', scheduledTime: '09:30 AM' },
    { id: 'RAD-402', name: 'Ravi Krishnamurthy', age: 55, sex: 'M', mrn: 'MR-22402', test: 'Bone Scan', modality: 'nuc', priority: 'routine', stage: 'queued' }
  ]);

  private _machines$ = new BehaviorSubject<MachineStatus[]>([
    { id: 'XR-1', name: 'X-Ray Room 1', modality: 'xray', state: 'busy', patient: 'Lakshmi Devi', eta: '5m' },
    { id: 'XR-2', name: 'X-Ray Room 2', modality: 'xray', state: 'available' },
    { id: 'XR-3', name: 'X-Ray Room 3', modality: 'xray', state: 'maintenance' },
    { id: 'CT-1', name: 'CT Suite 1', modality: 'ct', state: 'busy', patient: 'Arjun Patel', eta: '12m' },
    { id: 'CT-2', name: 'CT Suite 2', modality: 'ct', state: 'available' },
    { id: 'MRI-1', name: 'MRI 3T', modality: 'mri', state: 'busy', patient: 'Kiran Rao', eta: '25m' },
    { id: 'MRI-2', name: 'MRI 1.5T', modality: 'mri', state: 'available' },
    { id: 'USG-1', name: 'USG Room 1', modality: 'usg', state: 'busy', patient: 'Madhuri Nair', eta: '8m' },
    { id: 'USG-2', name: 'USG Room 2', modality: 'usg', state: 'available' },
    { id: 'USG-3', name: 'USG Room 3', modality: 'usg', state: 'available' },
    { id: 'PET-1', name: 'PET-CT', modality: 'nuc', state: 'busy', patient: 'Prakash Menon', eta: '35m' },
    { id: 'SPE-1', name: 'SPECT-CT', modality: 'nuc', state: 'available' }
  ]);

  patients$ = this._patients$.asObservable();
  machines$ = this._machines$.asObservable();

  getPatients(): RadiologyPatient[] { return this._patients$.value; }
  getMachines(): MachineStatus[] { return this._machines$.value; }

  getPatientsByModality(modality: RadiologyPatient['modality']): RadiologyPatient[] {
    return this._patients$.value.filter(p => p.modality === modality);
  }
  getMachinesByModality(modality: MachineStatus['modality']): MachineStatus[] {
    return this._machines$.value.filter(m => m.modality === modality);
  }

  setStage(id: string, stage: RadiologyPatient['stage']): void {
    this._patients$.next(this._patients$.value.map(p => p.id === id ? { ...p, stage } : p));
  }

  assignRoom(id: string, room: string): void {
    this._patients$.next(this._patients$.value.map(p => p.id === id ? { ...p, room, stage: 'imaging' } : p));
    this._machines$.next(this._machines$.value.map(m => m.id === room ? { ...m, state: 'busy', patient: this._patients$.value.find(p => p.id === id)?.name } : m));
  }
}
