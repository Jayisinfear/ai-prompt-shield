import React from 'react';

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ScanHistory({ history, onClear }) {
  return (
    <div className="history-section">
      <div className="history-header">
        <span className="history-title">📜 Recent Scans</span>
        {history.length > 0 && (
          <button className="history-clear" onClick={onClear}>Clear All</button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          <div className="history-empty-icon">🔍</div>
          <div>No scans yet. Visit an AI chatbot to start.</div>
        </div>
      ) : (
        <div className="history-list">
          {history.slice(0, 8).map((item, i) => {
            const level = (item.riskLevel || 'low').toLowerCase();
            const isClean = item.score < 20;
            return (
              <div className="history-item" key={i}>
                <div className={`history-score ${level}`}>
                  {item.score}
                </div>
                <div className="history-info">
                  <div className="history-prompt">{item.prompt}</div>
                  <div className="history-meta">
                    <span className={`history-type-badge ${isClean ? 'clean' : 'risky'}`}>
                      {item.attackType}
                    </span>
                    <span>{timeAgo(item.timestamp)}</span>
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
