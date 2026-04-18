import React from 'react';

export default function ShieldToggle({ enabled, onToggle }) {
  return (
    <div className="shield-toggle">
      <div className="shield-status">
        <div className="shield-toggle-label">Shield Protection</div>
        <div className="shield-toggle-desc">
          {enabled
            ? 'Scanning all prompts in real-time'
            : 'All prompts passing through unscanned'}
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
