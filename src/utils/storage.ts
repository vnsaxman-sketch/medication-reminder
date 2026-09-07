import type { Medication, MedicationLog } from '../types';

const MEDICATIONS_KEY = 'medication-reminder-medications';
const LOGS_KEY = 'medication-reminder-logs';

const defaultMedications: Medication[] = [
  {
    id: 'med-1',
    name: 'Morning Medication',
    dosage: '0 tablet',
    instructions: 'Take with water',
    times: ['08:00'],
    startDate: '2026-01-01',
    color: '#2563eb',
    active: true,
  },
  {
    id: 'med-2',
    name: 'Afternoon Medication',
    dosage: '0 tablet',
    instructions: 'Take after lunch',
    times: ['14:00'],
    startDate: '2026-01-01',
    color: '#7c3aed',
    active: true,
  },
  {
    id: 'med-3',
    name: 'Evening Medication',
    dosage: '0 tablets',
    instructions: 'Take with dinner',
    times: ['20:00'],
    startDate: '2026-01-01',
    color: '#059669',
    active: true,
  },
];

export function getMedications(): Medication[] {
  try {
    const saved = localStorage.getItem(MEDICATIONS_KEY);

    if (!saved) {
      localStorage.setItem(
        MEDICATIONS_KEY,
        JSON.stringify(defaultMedications)
      );
      return defaultMedications;
    }

    return JSON.parse(saved) as Medication[];
  } catch {
    return defaultMedications;
  }
}

export function saveMedications(medications: Medication[]): void {
  localStorage.setItem(
    MEDICATIONS_KEY,
    JSON.stringify(medications)
  );
}

export function getLogs(): MedicationLog[] {
  try {
    const saved = localStorage.getItem(LOGS_KEY);

    if (!saved) {
      return [];
    }

    return JSON.parse(saved) as MedicationLog[];
  } catch {
    return [];
  }
}

export function saveLogs(logs: MedicationLog[]): void {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function clearAllMedicationData(): void {
  localStorage.removeItem(MEDICATIONS_KEY);
  localStorage.removeItem(LOGS_KEY);
}
