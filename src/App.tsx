import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Pill,
  Settings,
} from 'lucide-react';

import type {
  Medication,
  MedicationLog,
  MedicationStatus,
  DailyMedication,
} from './types';

import DashboardHeader from './components/DashboardHeader';
import AdherenceCard from './components/AdherenceCard';
import UpcomingReminder from './components/UpcomingReminder';
import TodayMedications from './components/TodayMedications';
import WeeklyAdherence from './components/WeeklyAdherence';
import MedicationForm from './components/MedicationForm';

import {
  getMedications,
  getLogs,
  saveMedications,
  saveLogs,
} from './utils/storage';

import {
  createDailyMedicationList,
  calculateTodayAdherence,
  buildWeeklyAdherence,
  getNextReminder,
} from './utils/reminders';

import { getToday } from './utils/dates';

import './index.css';

function App() {
  const [medications, setMedications] =
    useState<Medication[]>(() =>
      getMedications()
    );

  const [logs, setLogs] = useState<MedicationLog[]>(
    () => getLogs()
  );

  const [showForm, setShowForm] =
    useState(false);

  const [editingMedicationId, setEditingMedicationId] =
    useState<string | null>(null);

  const [currentTime, setCurrentTime] =
    useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  const dailyItems = useMemo(
    () =>
      createDailyMedicationList(
        medications,
        logs
      ),
    [medications, logs, currentTime]
  );

  const adherence = useMemo(
    () =>
      calculateTodayAdherence(dailyItems),
    [dailyItems]
  );

  const weeklyData = useMemo(
    () =>
      buildWeeklyAdherence(
        medications,
        logs
      ),
    [medications, logs]
  );

  const nextReminder = useMemo(
    () => getNextReminder(dailyItems),
    [dailyItems]
  );

  const takenCount = dailyItems.filter(
    (item) => item.status === 'taken'
  ).length;

  const missedCount = dailyItems.filter(
    (item) => item.status === 'missed'
  ).length;

  const editingMedication =
    medications.find(
      (medication) =>
        medication.id === editingMedicationId
    );

  function openAddForm() {
    setEditingMedicationId(null);
    setShowForm(true);
  }

  function openEditForm(id: string) {
    setEditingMedicationId(id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingMedicationId(null);
  }

  function handleSaveMedication(
    medication: Medication
  ) {
    setMedications((current) => {
      const exists = current.some(
        (item) => item.id === medication.id
      );

      const updated = exists
        ? current.map((item) =>
            item.id === medication.id
              ? medication
              : item
          )
        : [...current, medication];

      saveMedications(updated);

      return updated;
    });

    closeForm();
  }

  function handleDeleteMedication(
    id: string
  ) {
    const confirmed = window.confirm(
      'Delete this medication and its schedule?'
    );

    if (!confirmed) return;

    setMedications((current) => {
      const updated = current.filter(
        (medication) =>
          medication.id !== id
      );

      saveMedications(updated);

      return updated;
    });

    setLogs((current) => {
      const updated = current.filter(
        (log) =>
          log.medicationId !== id
      );

      saveLogs(updated);

      return updated;
    });

    closeForm();
  }

  function handleStatusChange(
    item: DailyMedication,
    status: MedicationStatus
  ) {
    const today = getToday();

    setLogs((current) => {
      const existingIndex = current.findIndex(
        (log) =>
          log.medicationId ===
            item.medication.id &&
          log.date === today &&
          log.time === item.time
      );

      const updatedLog: MedicationLog = {
        id:
          existingIndex >= 0
            ? current[existingIndex].id
            : `log-${Date.now()}-${Math.random()}`,
        medicationId:
          item.medication.id,
        date: today,
        time: item.time,
        status,
        takenAt:
          status === 'taken'
            ? new Date().toISOString()
            : undefined,
      };

      let updated: MedicationLog[];

      if (existingIndex >= 0) {
        updated = [...current];
        updated[existingIndex] =
          updatedLog;
      } else {
        updated = [
          ...current,
          updatedLog,
        ];
      }

      saveLogs(updated);

      return updated;
    });
  }

  return (
    <div className="app">
      <DashboardHeader
        onAddMedication={openAddForm}
      />

      <main className="dashboard">
        <div className="welcome-row">
          <div>
            <h2>Good day 👋</h2>
            <p>
              Stay on schedule and keep track of
              today's medications.
            </p>
          </div>

          <div className="live-status">
            <span className="live-dot" />
            Dashboard active
          </div>
        </div>

        <div className="stats-grid">
          <AdherenceCard
            percentage={adherence}
            taken={takenCount}
            total={dailyItems.length}
          />

          <UpcomingReminder
            reminder={nextReminder}
          />

          <section className="stat-card">
            <div className="stat-card-top">
              <div>
                <span className="stat-label">
                  Today's Schedule
                </span>

                <div className="stat-value">
                  {dailyItems.length}
                </div>
              </div>

              <div className="stat-icon blue">
                <Pill size={24} />
              </div>
            </div>

            <div className="stat-footer">
              <span>
                {takenCount} completed
              </span>

              <span>
                {dailyItems.length -
                  takenCount}
                {' '}remaining
              </span>
            </div>
          </section>

          <section className="stat-card">
            <div className="stat-card-top">
              <div>
                <span className="stat-label">
                  Missed Today
                </span>

                <div className="stat-value">
                  {missedCount}
                </div>
              </div>

              <div className="stat-icon orange">
                <Clock3 size={24} />
              </div>
            </div>

            <div className="stat-footer">
              <span>
                {missedCount === 0
                  ? 'Great job!'
                  : 'Needs attention'}
              </span>
            </div>
          </section>
        </div>

        <div className="dashboard-grid">
          <div className="main-column">
            <TodayMedications
              items={dailyItems}
              onStatusChange={
                handleStatusChange
              }
              onEdit={openEditForm}
            />

            <WeeklyAdherence
              data={weeklyData}
            />
          </div>

          <aside className="side-column">
            <section className="info-card">
              <div className="info-card-icon">
                <CheckCircle2 size={20} />
              </div>

              <h3>Daily Goal</h3>

              <p>
                Take all scheduled medications
                according to your prescribed
                instructions.
              </p>

              <div className="goal-progress">
                <div
                  style={{
                    width: `${adherence}%`,
                  }}
                />
              </div>

              <strong>
                {adherence}% complete
              </strong>
            </section>

            <section className="info-card safety-card">
              <div className="info-card-icon warning">
                <AlertTriangle size={20} />
              </div>

              <h3>Medication Safety</h3>

              <p>
                This app is a reminder and
                tracking tool. It does not provide
                medical advice or determine when
                you should take a medication.
              </p>

              <p>
                Always follow the instructions
                provided by your doctor or
                pharmacist.
              </p>
            </section>

            <section className="info-card">
              <div className="info-card-icon">
                <Settings size={20} />
              </div>

              <h3>Quick Settings</h3>

              <div className="settings-row">
                <span>Active medications</span>
                <strong>
                  {
                    medications.filter(
                      (medication) =>
                        medication.active
                    ).length
                  }
                </strong>
              </div>

              <div className="settings-row">
                <span>Reminder events</span>
                <strong>
                  {dailyItems.length}
                </strong>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <footer className="app-footer">
        <span>
          Medication Reminder Dashboard
        </span>

        <span>
          Personal tracking tool • Not medical
          advice
        </span>
      </footer>

      {showForm && (
        <MedicationForm
          medication={editingMedication}
          onSave={handleSaveMedication}
          onDelete={
            editingMedication
              ? handleDeleteMedication
              : undefined
          }
          onClose={closeForm}
        />
      )}
    </div>
  );
}

export default App;
