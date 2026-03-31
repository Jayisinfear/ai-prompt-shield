import React from 'react';

export default function ShieldToggle({ enabled, onToggle }) {
  return (
    <div className="shield-toggle">
      <div className="shield-status">
        <div className={`shield-status-dot ${enabled ? 'active' : 'inactive'}`} />
        <span className="shield-status-text">
          Shield {enabled ? 'Active' : 'Disabled'}
        </span>
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}
