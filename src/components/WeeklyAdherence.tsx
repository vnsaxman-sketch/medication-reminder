import { BarChart3 } from 'lucide-react';

import type { AdherenceDay } from '../types';

interface WeeklyAdherenceProps {
  data: AdherenceDay[];
}

export default function WeeklyAdherence({
  data,
}: WeeklyAdherenceProps) {
  const average =
    data.length > 0
      ? Math.round(
          data.reduce(
            (sum, day) => sum + day.percentage,
            0
          ) / data.length
        )
      : 100;

  return (
    <section className="section-card weekly-card">
      <div className="section-header">
        <div>
          <h2>7-Day Adherence</h2>
          <p>Your medication consistency this week.</p>
        </div>

        <div className="weekly-summary">
          <BarChart3 size={18} />
          <strong>{average}%</strong>
          <span>average</span>
        </div>
      </div>

      <div className="weekly-chart">
        {data.map((day) => (
          <div className="chart-day" key={day.date}>
            <div className="chart-value">
              {day.percentage}%
            </div>

            <div className="chart-bar-area">
              <div
                className="chart-bar"
                style={{
                  height: `${Math.max(
                    day.percentage,
                    4
                  )}%`,
                }}
              />
            </div>

            <span className="chart-label">
              {day.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
