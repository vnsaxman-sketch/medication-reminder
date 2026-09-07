import type {
  Medication,
  MedicationLog,
  DailyMedication,
  MedicationStatus,
  AdherenceDay,
} from '../types';

import {
  getToday,
  getDateDaysAgo,
  timeToMinutes,
  getCurrentTimeMinutes,
} from './dates';

export function createDailyMedicationList(
  medications: Medication[],
  logs: MedicationLog[]
): DailyMedication[] {
  const today = getToday();
  const currentMinutes = getCurrentTimeMinutes();

  const items: DailyMedication[] = [];

  medications
    .filter((medication) => medication.active)
    .forEach((medication) => {
      medication.times.forEach((time) => {
        const log = logs.find(
          (item) =>
            item.medicationId === medication.id &&
            item.date === today &&
            item.time === time
        );

        let status: MedicationStatus = 'pending';

        if (log) {
          status = log.status;
        } else if (timeToMinutes(time) < currentMinutes) {
          status = 'missed';
        }

        items.push({
          medication,
          time,
          log,
          status,
        });
      });
    });

  return items.sort(
    (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)
  );
}

export function calculateTodayAdherence(
  dailyItems: DailyMedication[]
): number {
  if (dailyItems.length === 0) {
    return 100;
  }

  const completed = dailyItems.filter(
    (item) => item.status === 'taken'
  ).length;

  return Math.round((completed / dailyItems.length) * 100);
}

export function calculateAdherenceForDate(
  date: string,
  medications: Medication[],
  logs: MedicationLog[]
): number {
  const scheduled: {
    medicationId: string;
    time: string;
  }[] = [];

  medications
    .filter((medication) => medication.active)
    .forEach((medication) => {
      medication.times.forEach((time) => {
        scheduled.push({
          medicationId: medication.id,
          time,
        });
      });
    });

  if (scheduled.length === 0) {
    return 100;
  }

  const taken = scheduled.filter((item) =>
    logs.some(
      (log) =>
        log.medicationId === item.medicationId &&
        log.date === date &&
        log.time === item.time &&
        log.status === 'taken'
    )
  ).length;

  return Math.round((taken / scheduled.length) * 100);
}

export function buildWeeklyAdherence(
  medications: Medication[],
  logs: MedicationLog[]
): AdherenceDay[] {
  const days: AdherenceDay[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = getDateDaysAgo(i);
    const dateObject = new Date(`${date}T12:00:00`);

    days.push({
      date,
      label: dateObject.toLocaleDateString([], {
        weekday: 'short',
      }),
      percentage: calculateAdherenceForDate(
        date,
        medications,
        logs
      ),
      taken: countTaken(date, logs),
      scheduled: countScheduled(medications),
    });
  }

  return days;
}

function countTaken(
  date: string,
  logs: MedicationLog[]
): number {
  return logs.filter(
    (log) =>
      log.date === date &&
      log.status === 'taken'
  ).length;
}

function countScheduled(
  medications: Medication[]
): number {
  return medications
    .filter((medication) => medication.active)
    .reduce(
      (total, medication) =>
        total + medication.times.length,
      0
    );
}

export function getNextReminder(
  items: DailyMedication[]
): DailyMedication | null {
  const pending = items
    .filter((item) => item.status === 'pending')
    .sort(
      (a, b) =>
        timeToMinutes(a.time) -
        timeToMinutes(b.time)
    );

  return pending[0] ?? null;
}
