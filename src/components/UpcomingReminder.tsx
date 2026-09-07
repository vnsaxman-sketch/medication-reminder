import {
  AlarmClock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

import type { DailyMedication } from '../types';
import { formatTime } from '../utils/dates';

interface UpcomingReminderProps {
  reminder: DailyMedication | null;
}

export default function UpcomingReminder({
  reminder,
}: UpcomingReminderProps) {
  return (
    <section className="stat-card reminder-card">
      <div className="stat-card-top">
        <div>
          <span className="stat-label">
            Next Reminder
          </span>

          {reminder ? (
            <>
              <div className="reminder-time">
                {formatTime(reminder.time)}
              </div>

              <div className="reminder-name">
                {reminder.medication.name}
              </div>
            </>
          ) : (
            <>
              <div className="reminder-time">
                All Done
              </div>

              <div className="reminder-name">
                No more medications today
              </div>
            </>
          )}
        </div>

        <div className="stat-icon reminder-icon">
          <AlarmClock size={24} />
        </div>
      </div>

      {reminder ? (
        <div className="reminder-footer">
          <span>
            {reminder.medication.dosage}
          </span>

          <ArrowRight size={17} />
        </div>
      ) : (
        <div className="reminder-footer completed">
          <CheckCircle2 size={17} />
          Schedule complete
        </div>
      )}
    </section>
  );
}
