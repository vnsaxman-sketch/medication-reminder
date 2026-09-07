import { useEffect, useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

import type { Medication } from '../types';

interface MedicationFormProps {
  medication?: Medication;
  onSave: (medication: Medication) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const colors = [
  '#2563eb',
  '#7c3aed',
  '#059669',
  '#dc2626',
  '#ea580c',
  '#0891b2',
];

export default function MedicationForm({
  medication,
  onSave,
  onDelete,
  onClose,
}: MedicationFormProps) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] =
    useState('');
  const [times, setTimes] = useState<string[]>([
    '08:00',
  ]);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState('');
  const [color, setColor] = useState(colors[0]);

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setDosage(medication.dosage);
      setInstructions(medication.instructions);
      setTimes(medication.times);
      setStartDate(medication.startDate);
      setEndDate(medication.endDate ?? '');
      setColor(medication.color);
    }
  }, [medication]);

  function addTime() {
    setTimes([...times, '12:00']);
  }

  function removeTime(index: number) {
    if (times.length === 1) return;

    setTimes(
      times.filter((_, timeIndex) => timeIndex !== index)
    );
  }

  function updateTime(
    index: number,
    value: string
  ) {
    setTimes(
      times.map((time, timeIndex) =>
        timeIndex === index ? value : time
      )
    );
  }

  function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!name.trim() || !dosage.trim()) {
      return;
    }

    const updatedMedication: Medication = {
      id:
        medication?.id ??
        `med-${Date.now()}`,
      name: name.trim(),
      dosage: dosage.trim(),
      instructions: instructions.trim(),
      times,
      startDate,
      endDate: endDate || undefined,
      color,
      active: medication?.active ?? true,
    };

    onSave(updatedMedication);
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={onClose}
    >
      <div
        className="modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <h2>
              {medication
                ? 'Edit Medication'
                : 'Add Medication'}
            </h2>

            <p>
              Create your daily medication schedule.
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="medication-form"
          onSubmit={handleSubmit}
        >
          <label>
            Medication Name
            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Morning medication"
              required
            />
          </label>

          <label>
            Dosage
            <input
              type="text"
              value={dosage}
              onChange={(event) =>
                setDosage(event.target.value)
              }
              placeholder="e.g. 1 tablet"
              required
            />
          </label>

          <label>
            Instructions
            <input
              type="text"
              value={instructions}
              onChange={(event) =>
                setInstructions(
                  event.target.value
                )
              }
              placeholder="e.g. Take with food"
            />
          </label>

          <div className="form-section">
            <div className="form-section-header">
              <span>Reminder Times</span>

              <button
                type="button"
                className="add-time-button"
                onClick={addTime}
              >
                <Plus size={15} />
                Add Time
              </button>
            </div>

            {times.map((time, index) => (
              <div
                className="time-input-row"
                key={`${index}-${time}`}
              >
                <input
                  type="time"
                  value={time}
                  onChange={(event) =>
                    updateTime(
                      index,
                      event.target.value
                    )
                  }
                />

                {times.length > 1 && (
                  <button
                    type="button"
                    className="remove-time-button"
                    onClick={() =>
                      removeTime(index)
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="date-grid">
            <label>
              Start Date
              <input
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(event.target.value)
                }
              />
            </label>

            <label>
              End Date
              <input
                type="date"
                value={endDate}
                onChange={(event) =>
                  setEndDate(event.target.value)
                }
              />
            </label>
          </div>

          <div className="form-section">
            <span>Medication Color</span>

            <div className="color-picker">
              {colors.map((itemColor) => (
                <button
                  type="button"
                  key={itemColor}
                  className={`color-option ${
                    color === itemColor
                      ? 'selected'
                      : ''
                  }`}
                  style={{
                    backgroundColor: itemColor,
                  }}
                  onClick={() =>
                    setColor(itemColor)
                  }
                  aria-label={`Select ${itemColor}`}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            {medication && onDelete && (
              <button
                type="button"
                className="delete-button"
                onClick={() =>
                  onDelete(medication.id)
                }
              >
                <Trash2 size={17} />
                Delete
              </button>
            )}

            <div className="modal-actions-right">
              <button
                type="button"
                className="secondary-button"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                {medication
                  ? 'Save Changes'
                  : 'Add Medication'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
