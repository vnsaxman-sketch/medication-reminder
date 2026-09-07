import {
  Check,
  Clock,
  MoreVertical,
  SkipForward,
} from 'lucide-react';

import type {
  DailyMedication,
  MedicationStatus,
} from '../types';

import { formatTime } from '../utils/dates';

interface MedicationCardProps {
  item: DailyMedication;
  onStatusChange: (
    item: DailyMedication,
    status: MedicationStatus
  ) => void;
  onEdit: (medicationId: string) => void;
}

export default function MedicationCard({
  item,
  onStatusChange,
  onEdit,
}: MedicationCardProps) {
  const { medication, time, status } = item;

  return (
    <article className={`medication-card ${status}`}>
      <div
        className="medication-color"
        style={{
          backgroundColor: medication.color,
        }}
      />

      <div className="medication-time">
        <Clock size={16} />
        <span>{formatTime(time)}</span>
      </div>

      <div className="medication-info">
        <div className="medication-title-row">
          <h3>{medication.name}</h3>

          <button
            type="button"
            className="more-button"
            onClick={() => onEdit(medication.id)}
            title="Edit medication"
            aria-label={`Edit ${medication.name}`}
          >
            <MoreVertical size={18} />
          </button>
        </div>

        <p className="dosage">
          {medication.dosage}
        </p>

        {medication.instructions && (
          <p className="instructions">
            {medication.instructions}
          </p>
        )}
      </div>

      <div className="medication-actions">
        {status === 'taken' ? (
          <button
            type="button"
            className="status-button taken-button"
            onClick={() =>
              onStatusChange(item, 'pending')
            }
          >
            <Check size={17} />
            Taken
          </button>
        ) : status === 'missed' ? (
          <>
            <button
              type="button"
              className="status-button take-button"
              onClick={() =>
                onStatusChange(item, 'taken')
              }
            >
              <Check size={17} />
              Take
            </button>

            <button
              type="button"
              className="skip-button"
              onClick={() =>
                onStatusChange(item, 'skipped')
              }
            >
              <SkipForward size={16} />
              Skip
            </button>
          </>
        ) : status === 'skipped' ? (
          <button
            type="button"
            className="status-button skipped-button"
            onClick={() =>
              onStatusChange(item, 'pending')
            }
          >
            Skipped
          </button>
        ) : (
          <>
            <button
              type="button"
              className="status-button take-button"
              onClick={() =>
                onStatusChange(item, 'taken')
              }
            >
              <Check size={17} />
              Take Now
            </button>

            <button
              type="button"
              className="skip-button"
              onClick={() =>
                onStatusChange(item, 'skipped')
              }
            >
              Skip
            </button>
          </>
        )}
      </div>
    </article>
  );
}
