import React from 'react';

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60)  return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)  return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)    return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function levelClass(score) {
  if (score <= 20) return 'low';
  if (score <= 50) return 'medium';
  if (score <= 80) return 'high';
  return 'critical';
}

export default function ScanHistory({ history, onClear }) {
  return (
    <div className="history-section">
      {/* Header */}
      <div className="history-header">
        <span className="history-title">RECENT_SCANS.LOG</span>
        {history.length > 0 && (
          <button className="history-clear" onClick={onClear}>
            CLR
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          <div className="history-empty-icon">⟳</div>
          <div className="history-empty-text">
            NO SCANS RECORDED — VISIT AN AI CHATBOT TO START
          </div>
        </div>
      ) : (
        <div className="history-list">
          {history.slice(0, 8).map((item, i) => {
            const level   = levelClass(item.score);
            const isClean = item.score < 20;
            const barPct  = `${Math.min(item.score, 100)}%`;

            return (
              <div className="history-item" key={i}>
                {/* Score number */}
                <div className={`history-score ${level}`}>
                  {item.score}
                </div>

                {/* Vertical bar */}
                <div className="history-bar-track">
                  <div
                    className={`history-bar-fill ${level}`}
                    style={{ height: barPct }}
                  />
                </div>

                {/* Info */}
                <div className="history-info">
                  <div className="history-prompt">{item.prompt}</div>
                  <div className="history-meta">
                    <span className={`history-type-badge ${isClean ? 'clean' : 'risky'}`}>
                      {item.attackType}
                    </span>
                    <span className="history-time">{timeAgo(item.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
