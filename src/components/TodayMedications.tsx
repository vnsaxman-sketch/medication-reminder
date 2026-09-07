import { CalendarDays } from 'lucide-react';

import type {
  DailyMedication,
  MedicationStatus,
} from '../types';

import MedicationCard from './MedicationCard';

interface TodayMedicationsProps {
  items: DailyMedication[];
  onStatusChange: (
    item: DailyMedication,
    status: MedicationStatus
  ) => void;
  onEdit: (medicationId: string) => void;
}

export default function TodayMedications({
  items,
  onStatusChange,
  onEdit,
}: TodayMedicationsProps) {
  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Today's Medications</h2>
          <p>
            Keep your daily medication schedule on track.
          </p>
        </div>

        <div className="section-icon">
          <CalendarDays size={20} />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💊</div>
          <h3>No medications scheduled</h3>
          <p>
            Add a medication to begin your daily
            schedule.
          </p>
        </div>
      ) : (
        <div className="medication-list">
          {items.map((item) => (
            <MedicationCard
              key={`${item.medication.id}-${item.time}`}
              item={item}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </section>
  );
}
