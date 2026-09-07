import { Bell, Pill } from 'lucide-react';

interface DashboardHeaderProps {
  onAddMedication: () => void;
}

export default function DashboardHeader({
  onAddMedication,
}: DashboardHeaderProps) {
  const today = new Date();

  const dateText = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="dashboard-header">
      <div className="brand">
        <div className="brand-icon">
          <Pill size={25} />
        </div>

        <div>
          <h1>Medication Reminder</h1>	
          <p>{dateText}</p>
	  <p>
 	   Developed by: Long Nguyen
	  </p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="icon-button"
          title="Notifications"
          type="button"
        >
          <Bell size={20} />
        </button>

        <button
          className="primary-button"
          type="button"
          onClick={onAddMedication}
        >
          + Add Medication
        </button>
      </div>
    </header>
  );
}
