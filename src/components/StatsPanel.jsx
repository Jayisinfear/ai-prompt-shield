import React from 'react';

export default function StatsPanel({ stats }) {
  return (
    <div className="stats-panel">
      <div className="stat-card">
        <div className="stat-value scanned">{stats.scanned}</div>
        <div className="stat-label">Scanned</div>
      </div>
      <div className="stat-card">
        <div className="stat-value blocked">{stats.blocked}</div>
        <div className="stat-label">Blocked</div>
      </div>
      <div className="stat-card">
        <div className="stat-value allowed">{stats.allowed}</div>
        <div className="stat-label">Allowed</div>
      </div>
    </div>
  );
}
