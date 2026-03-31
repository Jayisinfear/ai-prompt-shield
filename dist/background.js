/**
 * AI Prompt Shield — Background Service Worker
 * Routes messages between content script, analyser, and popup.
 */

import { analysePrompt } from './analyser/riskAnalyser.js';

// ─── State ──────────────────────────────────────────────────
let pendingAnalysis = null; // Current pending analysis awaiting user decision
let shieldEnabled = true;

// ─── Initialize Storage ─────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    shieldEnabled: true,
    scanHistory: [],
    stats: { scanned: 0, blocked: 0, allowed: 0 },
  });
  console.log('🛡️ AI Prompt Shield installed and ready.');
});

// ─── Badge Helpers ───────────────────────────────────────────
function updateBadge(score, riskLevel) {
  const colors = {
    Low: '#00C853',
    Medium: '#FFD600',
    High: '#FF6D00',
    Critical: '#FF1744',
  };

  if (score === 0) {
    chrome.action.setBadgeText({ text: '' });
  } else {
    chrome.action.setBadgeText({ text: String(score) });
    chrome.action.setBadgeBackgroundColor({ color: colors[riskLevel] || '#666' });
  }
}

// ─── Message Handler ─────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    // Content script sends prompt for analysis
    case 'ANALYZE_PROMPT': {
      const result = analysePrompt(message.prompt);
      
      // Store as pending if risky
      if (result.score >= 20) {
        pendingAnalysis = {
          ...result,
          prompt: message.prompt.substring(0, 200), // Truncate for storage
          tabId: sender.tab?.id,
          url: sender.tab?.url,
        };
      }

      // Update badge
      updateBadge(result.score, result.riskLevel);

      // Record in history
      recordScan(result, message.prompt, sender.tab?.url);

      sendResponse(result);
      break;
    }

    // Popup requests current pending analysis
    case 'GET_PENDING': {
      sendResponse({ pending: pendingAnalysis, shieldEnabled });
      break;
    }

    // Popup or overlay sends user decision
    case 'USER_DECISION': {
      const decision = message.decision; // 'allow' or 'block'
      
      // Update stats
      chrome.storage.local.get(['stats'], (data) => {
        const stats = data.stats || { scanned: 0, blocked: 0, allowed: 0 };
        if (decision === 'allow') stats.allowed++;
        else stats.blocked++;
        chrome.storage.local.set({ stats });
      });

      // Forward decision to the content script
      if (pendingAnalysis?.tabId) {
        chrome.tabs.sendMessage(pendingAnalysis.tabId, {
          type: 'DECISION',
          decision,
        });
      }

      // Clear pending
      pendingAnalysis = null;
      updateBadge(0, 'Low');

      sendResponse({ ok: true });
      break;
    }

    // Toggle shield on/off
    case 'TOGGLE_SHIELD': {
      shieldEnabled = message.enabled;
      chrome.storage.local.set({ shieldEnabled });

      // Notify all content scripts
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, {
            type: 'TOGGLE_SHIELD',
            enabled: shieldEnabled,
          }).catch(() => {}); // Ignore errors for non-matching tabs
        });
      });

      sendResponse({ ok: true });
      break;
    }

    // Get scan history and stats
    case 'GET_STATS': {
      chrome.storage.local.get(['scanHistory', 'stats', 'shieldEnabled'], (data) => {
        sendResponse({
          history: data.scanHistory || [],
          stats: data.stats || { scanned: 0, blocked: 0, allowed: 0 },
          shieldEnabled: data.shieldEnabled !== false,
        });
      });
      return true; // Keep message channel open for async response
    }

    // Clear history
    case 'CLEAR_HISTORY': {
      chrome.storage.local.set({
        scanHistory: [],
        stats: { scanned: 0, blocked: 0, allowed: 0 },
      });
      sendResponse({ ok: true });
      break;
    }
  }

  return true; // Keep message channel open
});

// ─── Record Scan to History ──────────────────────────────────
function recordScan(result, prompt, url) {
  chrome.storage.local.get(['scanHistory', 'stats'], (data) => {
    const history = data.scanHistory || [];
    const stats = data.stats || { scanned: 0, blocked: 0, allowed: 0 };

    // Add to history (keep last 50)
    history.unshift({
      prompt: prompt.substring(0, 100),
      score: result.score,
      attackType: result.attackType,
      riskLevel: result.riskLevel,
      url: url || '',
      timestamp: Date.now(),
    });

    if (history.length > 50) history.length = 50;

    stats.scanned++;

    chrome.storage.local.set({ scanHistory: history, stats });
  });
}
