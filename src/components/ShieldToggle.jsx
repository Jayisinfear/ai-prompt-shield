import React from 'react';

export default function ShieldToggle({ enabled, onToggle }) {
  return (
    <div className="shield-toggle">
      <div className="shield-status">
        <div className="shield-toggle-label">SHIELD MATRIX</div>
        <div className="shield-toggle-desc">
          {enabled
            ? 'INTERCEPTING PROMPTS IN REAL-TIME'
            : 'ALL PROMPTS PASSING THROUGH UNSCANNED'}
        </div>
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
