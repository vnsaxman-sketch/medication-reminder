import { CheckCircle2, TrendingUp } from 'lucide-react';

interface AdherenceCardProps {
  percentage: number;
  taken: number;
  total: number;
}

export default function AdherenceCard({
  percentage,
  taken,
  total,
}: AdherenceCardProps) {
  return (
    <section className="stat-card adherence-card">
      <div className="stat-card-top">
        <div>
          <span className="stat-label">Today's Adherence</span>

          <div className="stat-value">
            {percentage}%
          </div>
        </div>

        <div className="stat-icon">
          <CheckCircle2 size={24} />
        </div>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="stat-footer">
        <span>
          {taken} of {total} medications taken
        </span>

        <span className="positive">
          <TrendingUp size={15} />
          Today
        </span>
      </div>
    </section>
  );
}
