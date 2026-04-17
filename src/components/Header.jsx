import React from 'react';

const TICKER_ITEMS = [
  { text: 'SYS: ALL SYSTEMS NOMINAL',                    cls: '' },
  { text: 'ALERT: JAILBREAK PATTERN DETECTED',           cls: 'alert' },
  { text: 'SCAN #047 COMPLETE — CLEAN',                  cls: '' },
  { text: 'WARN: ROLE HIJACKING ATTEMPT BLOCKED',        cls: 'warn' },
  { text: 'PATTERN DB: 300+ MATCHERS LOADED',            cls: '' },
  { text: 'PLATFORMS MONITORED: 7',                      cls: '' },
  { text: 'CRITICAL: PROMPT INJECTION — SCORE 92',       cls: 'alert' },
  { text: 'ENTROPY ANALYSER: ONLINE',                    cls: '' },
];

export default function Header({ shieldEnabled }) {
  return (
    <>
      {/* ── Main header bar ── */}
      <div className="header">
        <div className="header-corner" />
        <div className="header-corner-br" />

        <div className="header-top">
          {/* Shield SVG icon */}
          <div className="shield-icon-wrap">
            <svg viewBox="0 0 44 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 2L4 9v14c0 11.1 7.6 21.5 18 24 10.4-2.5 18-12.9 18-24V9L22 2z"
                fill="rgba(0,255,157,0.08)"
                stroke="#00ff9d"
                strokeWidth="1.5"
              />
              <path
                d="M22 8L8 14v9c0 7.5 5.1 14.5 12.2 16.2l1.8.4 1.8-.4C31 37.5 36 30.5 36 23v-9L22 8z"
                fill="rgba(0,255,157,0.06)"
                stroke="rgba(0,255,157,0.4)"
                strokeWidth="0.8"
              />
              <path
                d="M14 24l5 5 11-11"
                stroke="#00ff9d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="22" cy="25" r="1.5" fill="rgba(0,212,255,0.4)" />
            </svg>
          </div>

          <div className="header-titles">
            <div className="header-title">
              AI{' '}
              <span className="glitch accent" data-text="PROMPT">
                PROMPT
              </span>{' '}
              SHIELD
            </div>
            <div className="header-subtitle">BROWSER-LEVEL THREAT INTERCEPTOR</div>
          </div>

          <div className="version-badge">V1.0</div>
        </div>

        {/* Status bar */}
        <div className="status-bar">
          <div className={`status-dot${shieldEnabled ? '' : ' off'}`} />
          <span className="status-text">
            {shieldEnabled ? 'SHIELD ACTIVE' : 'SHIELD OFFLINE'}
          </span>
          <span className="status-ping">MONITORING 7 PLATFORMS</span>
        </div>
      </div>

      {/* ── Scrolling ticker ── */}
      <div className="ticker-wrap">
        <div className="ticker">
          {/* Doubled so the loop is seamless */}
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
