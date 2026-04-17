/**
 * AI Prompt Shield — Background Service Worker v2.0
 * Routes messages between content script, analysers (regex + AI), and popup.
 * Now includes hybrid AI+regex analysis via OpenRouter API.
 */

import { analysePrompt } from './analyser/riskAnalyser.js';
import { analyseWithAI, combineResults, testApiKey, rewritePrompt } from './analyser/aiAnalyser.js';

// ─── State ──────────────────────────────────────────────────
let pendingAnalysis = null; // Current pending analysis awaiting user decision
let shieldEnabled = true;

// ─── Default API Key ────────────────────────────────────────
const DEFAULT_API_KEY = ''; // Set your OpenRouter API key via the extension popup, or replace this with your key

// ─── Initialize Storage ─────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['apiKey'], (data) => {
    const initData = {
      shieldEnabled: true,
      scanHistory: [],
      stats: { scanned: 0, blocked: 0, allowed: 0 },
    };
    // Set default API key if none exists
    if (!data.apiKey) {
      initData.apiKey = DEFAULT_API_KEY;
    }
    chrome.storage.local.set(initData);
  });
  console.log('🛡️ AI Prompt Shield v2.0 installed — AI-powered analysis ready.');
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

// ─── Get API Key from Storage ────────────────────────────────
function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['apiKey'], (data) => {
      resolve(data.apiKey || DEFAULT_API_KEY);
    });
  });
}

// ─── Message Handler ─────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    // Content script sends prompt for analysis
    case 'ANALYZE_PROMPT': {
      // Run regex analysis immediately (synchronous, instant)
      const regexResult = analysePrompt(message.prompt);

      // Send regex result to content script first for fast UI
      // Then run AI analysis async and send an update
      (async () => {
        try {
          const apiKey = await getApiKey();
          const aiResult = await analyseWithAI(message.prompt, apiKey);
          const combined = combineResults(regexResult, aiResult);

          // Store as pending if risky
          if (combined.score >= 20) {
            pendingAnalysis = {
              ...combined,
              prompt: message.prompt.substring(0, 200),
              tabId: sender.tab?.id,
              url: sender.tab?.url,
            };
          }

          // Update badge
          updateBadge(combined.score, combined.riskLevel);

          // Record in history
          recordScan(combined, message.prompt, sender.tab?.url);

          // Send the AI-enhanced result back to content script
          if (sender.tab?.id) {
            chrome.tabs.sendMessage(sender.tab.id, {
              type: 'AI_RESULT',
              result: combined,
            }).catch(() => {}); // Ignore if tab closed
          }

          sendResponse(combined);
        } catch (err) {
          console.error('🛡️ AI analysis error:', err);
          // Fallback to regex-only result
          const fallback = {
            ...regexResult,
            aiPowered: false,
            aiError: err.message,
            scanMode: 'regex',
          };

          if (fallback.score >= 20) {
            pendingAnalysis = {
              ...fallback,
              prompt: message.prompt.substring(0, 200),
              tabId: sender.tab?.id,
              url: sender.tab?.url,
            };
          }

          updateBadge(fallback.score, fallback.riskLevel);
          recordScan(fallback, message.prompt, sender.tab?.url);
          sendResponse(fallback);
        }
      })();

      return true; // Keep message channel open for async response
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
      chrome.storage.local.get(['scanHistory', 'stats', 'shieldEnabled', 'apiKey'], (data) => {
        sendResponse({
          history: data.scanHistory || [],
          stats: data.stats || { scanned: 0, blocked: 0, allowed: 0 },
          shieldEnabled: data.shieldEnabled !== false,
          hasApiKey: !!data.apiKey,
          apiKeyPreview: data.apiKey ? maskKey(data.apiKey) : null,
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

    // Set API key
    case 'SET_API_KEY': {
      chrome.storage.local.set({ apiKey: message.apiKey });
      sendResponse({ ok: true, preview: maskKey(message.apiKey) });
      break;
    }

    // Get API key (masked)
    case 'GET_API_KEY': {
      chrome.storage.local.get(['apiKey'], (data) => {
        sendResponse({
          hasKey: !!data.apiKey,
          preview: data.apiKey ? maskKey(data.apiKey) : null,
        });
      });
      return true;
    }

    // Test API key
    case 'TEST_API_KEY': {
      (async () => {
        const result = await testApiKey(message.apiKey);
        sendResponse(result);
      })();
      return true;
    }

    // Rewrite a risky prompt into a safe version
    case 'REWRITE_PROMPT': {
      (async () => {
        try {
          const apiKey = await getApiKey();
          const result = await rewritePrompt(message.prompt, message.attackType, apiKey);
          sendResponse(result);
        } catch (err) {
          sendResponse({ error: 'failed', message: err.message });
        }
      })();
      return true;
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
      // AI fields
      aiPowered: result.aiPowered || false,
      aiScore: result.aiScore,
      aiExplanation: result.aiExplanation,
      aiConfidence: result.aiConfidence,
      scanMode: result.scanMode || 'regex',
      regexScore: result.regexScore || result.score,
    });

    if (history.length > 50) history.length = 50;

    stats.scanned++;

    chrome.storage.local.set({ scanHistory: history, stats });
  });
}

// ─── Mask API Key for Display ────────────────────────────────
function maskKey(key) {
  if (!key || key.length < 10) return '****';
  return key.substring(0, 8) + '...' + key.substring(key.length - 4);
}
