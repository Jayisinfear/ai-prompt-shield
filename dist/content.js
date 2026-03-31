/**
 * AI Prompt Shield — Content Script
 * Injected into AI chatbot pages. Intercepts prompts, sends for analysis,
 * and shows a premium overlay with risk info + Allow/Block buttons.
 * Self-contained (no ES module imports).
 */

(function () {
  'use strict';

  // ─── State ────────────────────────────────────────────────
  let isAllowedSubmission = false;
  let shieldEnabled = true;
  let overlayHost = null;
  let pendingInputEl = null;

  // ─── Platform Config ─────────────────────────────────────
  const hostname = window.location.hostname;

  const PLATFORMS = {
    'chatgpt.com': {
      name: 'ChatGPT',
      inputSelector: '#prompt-textarea, div[contenteditable="true"][id="prompt-textarea"]',
      sendButtonSelector: '[data-testid="send-button"], button[aria-label="Send prompt"], button[data-testid="send-button"]',
    },
    'chat.openai.com': {
      name: 'ChatGPT',
      inputSelector: '#prompt-textarea, div[contenteditable="true"]',
      sendButtonSelector: '[data-testid="send-button"], button[aria-label="Send prompt"]',
    },
    'gemini.google.com': {
      name: 'Gemini',
      inputSelector: '.ql-editor, div[contenteditable="true"], rich-textarea .textarea, .text-input-field_textarea textarea',
      sendButtonSelector: 'button[aria-label="Send message"], button.send-button, .send-button',
    },
    'claude.ai': {
      name: 'Claude',
      inputSelector: 'div[contenteditable="true"].ProseMirror, div.ProseMirror[contenteditable="true"], fieldset div[contenteditable="true"]',
      sendButtonSelector: 'button[aria-label="Send Message"], button[aria-label="Send message"], fieldset button:last-of-type',
    },
    'copilot.microsoft.com': {
      name: 'Copilot',
      inputSelector: '#searchbox, textarea, #userInput',
      sendButtonSelector: 'button[aria-label="Submit"], button[aria-label="Send"]',
    },
    'www.perplexity.ai': {
      name: 'Perplexity',
      inputSelector: 'textarea[placeholder], textarea',
      sendButtonSelector: 'button[aria-label="Submit"], button[aria-label="Send"], button[type="submit"]',
    },
    'huggingface.co': {
      name: 'HuggingChat',
      inputSelector: 'textarea',
      sendButtonSelector: 'button[type="submit"]',
    },
  };

  const platform = PLATFORMS[hostname];
  if (!platform) return;

  console.log(`🛡️ AI Prompt Shield active on ${platform.name}`);

  // ─── Helpers ──────────────────────────────────────────────
  function getInputElement() {
    const selectors = platform.inputSelector.split(', ');
    for (const sel of selectors) {
      const el = document.querySelector(sel.trim());
      if (el) return el;
    }
    return null;
  }

  function getSendButton() {
    const selectors = platform.sendButtonSelector.split(', ');
    for (const sel of selectors) {
      const el = document.querySelector(sel.trim());
      if (el) return el;
    }
    return null;
  }

  function getPromptText(el) {
    if (!el) return '';
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      return el.value;
    }
    return el.innerText || el.textContent || '';
  }

  // ─── Overlay Styles ───────────────────────────────────────
  const OVERLAY_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    :host {
      all: initial;
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    .aps-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(255, 23, 68, 0.3); }
      50% { box-shadow: 0 0 40px rgba(255, 23, 68, 0.6); }
    }

    @keyframes scoreCountUp {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }

    .aps-modal {
      background: linear-gradient(145deg, #0f0f1e 0%, #1a1a35 50%, #0d1b2a 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 36px 32px 28px;
      width: 420px;
      max-width: 92vw;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7), 0 0 1px rgba(255, 255, 255, 0.1);
      animation: slideUp 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
      color: #e2e8f0;
      position: relative;
      overflow: hidden;
    }

    .aps-modal::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: var(--risk-gradient);
    }

    /* Header */
    .aps-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 28px;
    }

    .aps-shield-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    }

    .aps-title {
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.3px;
    }

    .aps-subtitle {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    /* Score Section */
    .aps-score-section {
      text-align: center;
      margin-bottom: 24px;
    }

    .aps-score-ring {
      width: 120px;
      height: 120px;
      margin: 0 auto 16px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .aps-score-ring svg {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      transform: rotate(-90deg);
    }

    .aps-score-ring .aps-ring-bg {
      fill: none;
      stroke: rgba(255, 255, 255, 0.06);
      stroke-width: 8;
    }

    .aps-score-ring .aps-ring-fill {
      fill: none;
      stroke: var(--risk-color);
      stroke-width: 8;
      stroke-linecap: round;
      stroke-dasharray: var(--dash-array);
      stroke-dashoffset: var(--dash-offset);
      transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1);
      filter: drop-shadow(0 0 8px var(--risk-color));
    }

    .aps-score-value {
      font-size: 36px;
      font-weight: 800;
      color: var(--risk-color);
      animation: scoreCountUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      letter-spacing: -1px;
    }

    .aps-score-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #64748b;
      font-weight: 600;
    }

    .aps-risk-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      border-radius: 20px;
      background: var(--risk-bg);
      color: var(--risk-color);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      border: 1px solid var(--risk-border);
    }

    .aps-risk-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--risk-color);
      animation: pulseGlow 2s infinite;
      box-shadow: none;
    }

    /* Attack Info */
    .aps-attack-section {
      margin-bottom: 24px;
    }

    .aps-attack-type {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      margin-bottom: 12px;
    }

    .aps-attack-icon {
      font-size: 20px;
    }

    .aps-attack-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .aps-attack-name {
      font-size: 16px;
      font-weight: 700;
      color: #f1f5f9;
    }

    /* Patterns */
    .aps-patterns {
      padding: 0 4px;
    }

    .aps-patterns-title {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }

    .aps-pattern-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 6px 0;
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.4;
    }

    .aps-pattern-dot {
      width: 5px;
      height: 5px;
      min-width: 5px;
      border-radius: 50%;
      background: var(--risk-color);
      margin-top: 6px;
    }

    .aps-pattern-keyword {
      color: #fbbf24;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      background: rgba(251, 191, 36, 0.1);
      padding: 1px 6px;
      border-radius: 4px;
    }

    /* Buttons */
    .aps-buttons {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .aps-btn {
      flex: 1;
      padding: 14px 20px;
      border: none;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      letter-spacing: 0.3px;
      font-family: 'Inter', sans-serif;
    }

    .aps-btn:active {
      transform: scale(0.97);
    }

    .aps-btn-allow {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
    }

    .aps-btn-allow:hover {
      box-shadow: 0 6px 24px rgba(16, 185, 129, 0.5);
      transform: translateY(-1px);
    }

    .aps-btn-block {
      background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
      color: white;
      box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
    }

    .aps-btn-block:hover {
      box-shadow: 0 6px 24px rgba(239, 68, 68, 0.5);
      transform: translateY(-1px);
    }

    /* Prompt Preview */
    .aps-prompt-preview {
      margin-top: 16px;
      padding: 10px 14px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      font-size: 12px;
      color: #64748b;
      max-height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.5;
    }

    .aps-prompt-label {
      font-size: 10px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
      font-weight: 600;
    }

    /* Clean Prompt Toast */
    .aps-toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #0f0f1e, #1a1a35);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 16px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #e2e8f0;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.4s ease, fadeOut 0.4s ease 2.5s forwards;
      z-index: 2147483647;
    }

    @keyframes fadeOut {
      to { opacity: 0; transform: translateY(10px); }
    }

    .aps-toast-icon {
      font-size: 18px;
    }

    .aps-toast-score {
      color: #10b981;
      font-weight: 700;
    }
  `;

  // ─── Build Overlay HTML ───────────────────────────────────
  function buildOverlayHTML(result, promptText) {
    const score = result.score;
    const riskLevel = result.riskLevel;

    // Risk-based colors
    const riskColors = {
      Low: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', gradient: 'linear-gradient(90deg,#10b981,#34d399)' },
      Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', gradient: 'linear-gradient(90deg,#f59e0b,#fbbf24)' },
      High: { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)', gradient: 'linear-gradient(90deg,#f97316,#fb923c)' },
      Critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', gradient: 'linear-gradient(90deg,#ef4444,#f87171)' },
    };

    const rc = riskColors[riskLevel] || riskColors.Critical;

    // SVG circle math
    const circumference = 2 * Math.PI * 46; // radius 46
    const offset = circumference - (score / 100) * circumference;

    // Attack type icons
    const attackIcons = {
      'Jailbreak Prompt': '🔓',
      'Prompt Injection': '💉',
      'Role Hijacking': '🎭',
      'Data Exfiltration': '📤',
      'Encoding Bypass': '🔐',
      'Hidden Text Injection': '👻',
      'Delimiter Attack': '📌',
      'Social Engineering': '🕵️',
      'Recursive / Loop Attack': '🔄',
      'Payload Smuggling': '📦',
      'Multi-language Obfuscation': '🌐',
      'Emotional Manipulation': '🎭',
      'Clean': '✅',
    };

    const icon = attackIcons[result.attackType] || '⚠️';

    let patternsHTML = '';
    if (result.details && result.details.length > 0) {
      const patternItems = result.details.slice(0, 4).map(d => {
        const keywords = d.matchedKeywords.slice(0, 2).map(k =>
          `<span class="aps-pattern-keyword">${escapeHTML(k)}</span>`
        ).join(' ');
        return `<div class="aps-pattern-item"><div class="aps-pattern-dot"></div><div>${escapeHTML(d.name)}: ${keywords}</div></div>`;
      }).join('');

      patternsHTML = `
        <div class="aps-patterns">
          <div class="aps-patterns-title">Suspicious Patterns Detected</div>
          ${patternItems}
        </div>`;
    }

    return `
      <div class="aps-backdrop" id="aps-backdrop"
        style="--risk-color:${rc.color};--risk-bg:${rc.bg};--risk-border:${rc.border};--risk-gradient:${rc.gradient};--dash-array:${circumference};--dash-offset:${offset}">
        <div class="aps-modal">
          <div class="aps-header">
            <div class="aps-shield-icon">🛡️</div>
            <div>
              <div class="aps-title">AI Prompt Shield</div>
              <div class="aps-subtitle">Threat Analysis Report</div>
            </div>
          </div>

          <div class="aps-score-section">
            <div class="aps-score-ring">
              <svg viewBox="0 0 100 100">
                <circle class="aps-ring-bg" cx="50" cy="50" r="46" />
                <circle class="aps-ring-fill" cx="50" cy="50" r="46" />
              </svg>
              <div>
                <div class="aps-score-value">${score}</div>
                <div class="aps-score-label">Risk Score</div>
              </div>
            </div>
            <div class="aps-risk-badge">
              <span class="aps-risk-dot"></span>
              ${riskLevel} Risk
            </div>
          </div>

          <div class="aps-attack-section">
            <div class="aps-attack-type">
              <span class="aps-attack-icon">${icon}</span>
              <div>
                <div class="aps-attack-label">Primary Attack Type</div>
                <div class="aps-attack-name">${escapeHTML(result.attackType)}</div>
              </div>
            </div>
            ${patternsHTML}
          </div>

          <div class="aps-prompt-preview">
            <div class="aps-prompt-label">Intercepted Prompt</div>
            ${escapeHTML(promptText.substring(0, 120))}${promptText.length > 120 ? '...' : ''}
          </div>

          <div class="aps-buttons">
            <button class="aps-btn aps-btn-allow" id="aps-allow">✅ Allow</button>
            <button class="aps-btn aps-btn-block" id="aps-block">🚫 Block</button>
          </div>
        </div>
      </div>`;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── Show Overlay ─────────────────────────────────────────
  function showOverlay(result, promptText, inputEl) {
    removeOverlay();
    pendingInputEl = inputEl;

    overlayHost = document.createElement('aps-shield-overlay');
    overlayHost.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:auto;';
    const shadow = overlayHost.attachShadow({ mode: 'closed' });

    const styleEl = document.createElement('style');
    styleEl.textContent = OVERLAY_CSS;
    shadow.appendChild(styleEl);

    const container = document.createElement('div');
    container.innerHTML = buildOverlayHTML(result, promptText);
    shadow.appendChild(container);

    document.documentElement.appendChild(overlayHost);

    // Button handlers
    const allowBtn = shadow.getElementById('aps-allow');
    const blockBtn = shadow.getElementById('aps-block');

    if (allowBtn) {
      allowBtn.addEventListener('click', () => {
        removeOverlay();
        chrome.runtime.sendMessage({ type: 'USER_DECISION', decision: 'allow' });
        allowSubmission(inputEl);
      });
    }

    if (blockBtn) {
      blockBtn.addEventListener('click', () => {
        removeOverlay();
        chrome.runtime.sendMessage({ type: 'USER_DECISION', decision: 'block' });
        // Don't re-submit — prompt is blocked
      });
    }

    // Close on backdrop click
    const backdrop = shadow.getElementById('aps-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          removeOverlay();
          chrome.runtime.sendMessage({ type: 'USER_DECISION', decision: 'block' });
        }
      });
    }
  }

  // ─── Show Toast (for clean prompts) ───────────────────────
  function showCleanToast(score) {
    const toastHost = document.createElement('aps-shield-toast');
    toastHost.style.cssText = 'position:fixed;z-index:2147483647;pointer-events:none;bottom:0;right:0;';
    const shadow = toastHost.attachShadow({ mode: 'closed' });

    const style = document.createElement('style');
    style.textContent = OVERLAY_CSS;
    shadow.appendChild(style);

    const toast = document.createElement('div');
    toast.className = 'aps-toast';
    toast.innerHTML = `
      <span class="aps-toast-icon">🛡️</span>
      <span>Prompt scanned — <span class="aps-toast-score">Safe (${score}/100)</span></span>
    `;
    shadow.appendChild(toast);

    document.documentElement.appendChild(toastHost);

    setTimeout(() => toastHost.remove(), 3000);
  }

  function removeOverlay() {
    if (overlayHost) {
      overlayHost.remove();
      overlayHost = null;
    }
    pendingInputEl = null;
  }

  // ─── Submission Control ───────────────────────────────────
  function allowSubmission(inputEl) {
    isAllowedSubmission = true;

    // Try clicking the send button first
    const sendBtn = getSendButton();
    if (sendBtn) {
      sendBtn.click();
    } else if (inputEl) {
      // Fallback: dispatch Enter key event
      inputEl.focus();
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
      });
      inputEl.dispatchEvent(enterEvent);
    }

    setTimeout(() => {
      isAllowedSubmission = false;
    }, 1500);
  }

  // ─── Analyze Prompt ───────────────────────────────────────
  function analyzePrompt(text, inputEl) {
    chrome.runtime.sendMessage(
      { type: 'ANALYZE_PROMPT', prompt: text },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('🛡️ Shield error:', chrome.runtime.lastError);
          allowSubmission(inputEl);
          return;
        }

        if (!response) {
          allowSubmission(inputEl);
          return;
        }

        if (response.score >= 20) {
          // Risky — show overlay
          showOverlay(response, text, inputEl);
        } else {
          // Clean — auto-allow with toast
          showCleanToast(response.score);
          allowSubmission(inputEl);
        }
      }
    );
  }

  // ─── Event Interception ───────────────────────────────────
  function handleKeyDown(e) {
    if (!shieldEnabled || isAllowedSubmission) return;

    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const inputEl = getInputElement();
      if (!inputEl) return;

      // Check if the active element is inside the input area
      const active = document.activeElement;
      if (active !== inputEl && !inputEl.contains(active)) return;

      const text = getPromptText(inputEl).trim();
      if (text.length < 3) return; // Skip very short inputs

      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();

      analyzePrompt(text, inputEl);
    }
  }

  function handleClick(e) {
    if (!shieldEnabled || isAllowedSubmission) return;

    // Check if clicked element is (or is inside) the send button
    const selectors = platform.sendButtonSelector.split(', ');
    let isSendBtn = false;

    for (const sel of selectors) {
      if (e.target.closest && e.target.closest(sel.trim())) {
        isSendBtn = true;
        break;
      }
    }

    if (!isSendBtn) return;

    const inputEl = getInputElement();
    if (!inputEl) return;

    const text = getPromptText(inputEl).trim();
    if (text.length < 3) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    analyzePrompt(text, inputEl);
  }

  // Use capture phase to fire before app's event handlers
  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('click', handleClick, true);

  // ─── Listen for Messages from Background ──────────────────
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'TOGGLE_SHIELD') {
      shieldEnabled = msg.enabled;
      console.log(`🛡️ Shield ${shieldEnabled ? 'enabled' : 'disabled'}`);
    }

    if (msg.type === 'DECISION') {
      if (msg.decision === 'allow') {
        allowSubmission(pendingInputEl);
      }
      removeOverlay();
    }
  });

  // ─── Check initial shield state ───────────────────────────
  chrome.runtime.sendMessage({ type: 'GET_STATS' }, (response) => {
    if (response) {
      shieldEnabled = response.shieldEnabled !== false;
    }
  });

})();
