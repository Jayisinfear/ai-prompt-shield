import React from 'react';

export default function RiskScore({ result, onAllow, onBlock }) {
  const level = result.riskLevel?.toLowerCase() || 'low';

  return (
    <div className="risk-card">
      <div className="risk-header">
        <span className="risk-title">⚠️ Pending Analysis</span>
        <span className={`risk-score-inline ${level}`}>{result.score}</span>
      </div>

      <div className="risk-bar-container">
        <div className="risk-bar-bg">
          <div
            className={`risk-bar-fill ${level}`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      <div className="risk-attack-type">{result.attackType}</div>
      <div className="risk-patterns">
        {result.detectedPatterns?.join(', ') || 'No specific patterns'}
      </div>

      <div className="risk-buttons">
        <button className="btn-allow-sm" onClick={onAllow}>✅ Allow</button>
        <button className="btn-block-sm" onClick={onBlock}>🚫 Block</button>
      </div>
    </div>
  );
}
