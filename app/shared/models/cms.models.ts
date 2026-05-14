export type Priority = 'stat' | 'urgent' | 'routine';
export type OrderStatus = 'pending' | 'collected' | 'processing' | 'completed' | 'rejected' | 'damaged';
export type BillStatus = 'billed' | 'pending';

export interface LabOrder {
  id: string;
  patient: string;
  demo: string;
  tests: string[];
  priority: Priority;
  orderedBy: string;
  dept: string;
  time: string;
  timeAgo: string;
  billStatus: BillStatus;
  sampleType: string;
  status: OrderStatus;
  rejectionReason?: string;
  rejectedBy?: string;
}

export interface Sample {
  id: string;
  orderId: string;
  patient: string;
  demo: string;
  tests: string[];
  priority: Priority;
  sampleType: string;
  volume: string;
  orderedBy: string;
  dept: string;
  time: string;
  status: OrderStatus;
  collectedBy?: string;
  reason?: string;
  rejectedBy?: string;
}

export interface ResultItem {
  id: string;
  sampleId: string;
  patient: string;
  demo: string;
  tests: string;
  priority: Priority;
  status: string;
  collected: string;
  tat: string;
  location: string;
  badge: string;
}

export interface ResultParam {
  name: string;
  unit: string;
  val: string;
  flag: 'H' | 'L' | 'N' | 'CRIT' | 'ABN';
  ref: string;
}

export interface ReviewItem {
  id: string;
  sampleId: string;
  patient: string;
  demo: string;
  tests: string;
  priority: Priority;
  status: string;
  flags: string[];
  technician: string;
  location: string;
  comment: string;
  params: ResultParam[];
}

export interface DispatchRecord {
  id: string;
  patient: string;
  demo: string;
  tests: string;
  priority: Priority;
  flags: string;
  authBy: string;
  authTime: string;
  location: string;
  ward: string;
  phone: string;
  dispatched: boolean;
  comment: string;
  params: ResultParam[];
}

export interface RadiologyPatient {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F';
  mrn: string;
  test: string;
  modality: 'xray' | 'ct' | 'mri' | 'usg' | 'nuc';
  priority: Priority;
  stage: 'queued' | 'scheduled' | 'checkin' | 'imaging' | 'reporting' | 'authorized';
  scheduledTime?: string;
  room?: string;
  notes?: string;
  technician?: string;
  doctor?: string;
}

export interface MachineStatus {
  id: string;
  name: string;
  modality: 'xray' | 'ct' | 'mri' | 'usg' | 'nuc';
  state: 'busy' | 'available' | 'maintenance';
  patient?: string;
  eta?: string;
}

export interface ExternalOrder {
  id: string;
  patient: string;
  demo: string;
  tests: string[];
  externalLab: string;
  workflow: string;
  expectedTat: string;
  status: 'Dispatched' | 'Awaiting' | 'Received' | 'Collected';
  scenario: 'A' | 'B';
  collection?: string;
}

export interface KpiSnapshot {
  lab: { total: number; pending: number; processing: number; ready: number; tat: string };
  re: { stat: number; urgent: number; routine: number; tat: string };
  review: { critical: number; pending: number; authorized: number; avgTime: string };
  dispatch: { authorized: number; pending: number; dispatched: number; avgTime: string };
}
