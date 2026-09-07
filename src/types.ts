export type MedicationStatus = 'taken' | 'pending' | 'missed' | 'skipped';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  times: string[];
  startDate: string;
  endDate?: string;
  color: string;
  active: boolean;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  date: string;
  time: string;
  status: MedicationStatus;
  takenAt?: string;
}

export interface DailyMedication {
  medication: Medication;
  time: string;
  log?: MedicationLog;
  status: MedicationStatus;
}

export interface AdherenceDay {
  date: string;
  label: string;
  percentage: number;
  taken: number;
  scheduled: number;
}
