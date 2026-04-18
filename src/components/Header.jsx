import React from 'react';

const TICKER_ITEMS = [
  { text: '✓ All systems online',                   cls: '' },
  { text: '⚠ Jailbreak pattern detected',           cls: 'alert' },
  { text: '✓ Scan #047 — Clean',                    cls: '' },
  { text: '⚠ Role hijacking attempt blocked',       cls: 'warn' },
  { text: '✓ Pattern DB: 300+ loaded',              cls: '' },
  { text: '✓ Monitoring 7 platforms',                cls: '' },
  { text: '✕ Prompt injection — Score 92',           cls: 'alert' },
  { text: '✓ AI Auditor: Online',                    cls: '' },
];

export default function Header({ shieldEnabled }) {
  return (
    <>
      <div className="header">
        <div className="header-top">
          {/* Shield icon */}
          <div className="shield-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6L12 2z"
                fill="rgba(255,255,255,0.15)"
                stroke="#fff"
                strokeWidth="1.5"
              />
              <path
                d="M8 12.5l3 3 5-6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="header-titles">
            <div className="header-title">
              AI Prompt Shield
            </div>
            <div className="header-subtitle">Real-time threat detection</div>
          </div>

          <div className="version-badge">v2.0</div>
        </div>

        {/* Status bar */}
        <div className="status-bar">
          <div className={`status-dot${shieldEnabled ? '' : ' off'}`} />
          <span className="status-text">
            {shieldEnabled ? 'Shield Active' : 'Shield Offline'}
          </span>
          <span className="status-ping">7 platforms</span>
        </div>
      </div>

      {/* Scrolling ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className={`ticker-item${item.cls ? ' ' + item.cls : ''}`}>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
