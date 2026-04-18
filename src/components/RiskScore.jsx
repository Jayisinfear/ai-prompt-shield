import React from 'react';

export default function RiskScore({ result, onAllow, onBlock }) {
  const level = (result.riskLevel || 'low').toLowerCase();

  return (
    <div className="risk-card">
      {/* Header row */}
      <div className="risk-header">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
          <path d="M10 2L2 18h16L10 2z" fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth="1.2" />
          <line x1="10" y1="8" x2="10" y2="13" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="15.5" r="0.8" fill="#ef4444" />
        </svg>

        <span className="risk-title">Threat Detected — Action Required</span>
        <span className={`risk-score-inline ${level}`}>{result.score}</span>
      </div>

      {/* Body */}
      <div className="risk-body">
        <div className="risk-bar-container">
          <div className="risk-bar-bg">
            <div
              className={`risk-bar-fill ${level}`}
              style={{ width: `${Math.min(result.score, 100)}%` }}
            />
          </div>
        </div>

        <div className="risk-attack-type">{result.attackType}</div>

        <div className="risk-patterns">
          {result.detectedPatterns?.length
            ? result.detectedPatterns.join(', ')
            : 'No specific patterns flagged'}
        </div>

        <div className="risk-buttons">
          <button className="btn-allow-sm" onClick={onAllow}>
            ✓ Allow
          </button>
          <button className="btn-block-sm" onClick={onBlock}>
            ✕ Block
          </button>
        </div>
      </div>
    </div>
  );
}
