import { LucideIcon } from 'lucide-react';
import './StatCard.css'; // استدعاء ملف CSS

export function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-text">
          <p className="stat-card-title">{title}</p>
          <p className="stat-card-value">{value.toLocaleString()}</p>
        </div>
        <div className="stat-card-icon">
          <Icon size={24} className="icon" />
        </div>
      </div>
    </div>
  );
}
