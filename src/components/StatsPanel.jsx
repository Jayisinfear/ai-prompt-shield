import React from 'react';

export default function StatsPanel({ stats }) {
  return (
    <div className="stats-panel">
      <div className="stat-card">
        <span className="stat-value scanned">{stats.scanned}</span>
        <span className="stat-label">SCANNED</span>
      </div>

      <div className="stat-card">
        <span className="stat-value blocked">{stats.blocked}</span>
        <span className="stat-label">BLOCKED</span>
      </div>

      <div className="stat-card">
        <span className="stat-value allowed">{stats.allowed}</span>
        <span className="stat-label">ALLOWED</span>
      </div>
    </div>
  );
}
