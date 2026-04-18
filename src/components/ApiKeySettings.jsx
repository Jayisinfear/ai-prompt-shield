import React, { useState, useEffect } from 'react';

/* global chrome */

export default function ApiKeySettings() {
  const [apiKey, setApiKey] = useState('');
  const [preview, setPreview] = useState(null);
  const [hasKey, setHasKey] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadKeyStatus();
  }, []);

  function loadKeyStatus() {
    if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
      setHasKey(true);
      setPreview('sk-or-v1...fb9c');
      return;
    }

    chrome.runtime.sendMessage({ type: 'GET_API_KEY' }, (response) => {
      if (response) {
        setHasKey(response.hasKey);
        setPreview(response.preview);
      }
    });
  }

  function handleSave() {
    if (!apiKey.trim()) return;

    setSaving(true);
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'SET_API_KEY', apiKey: apiKey.trim() }, (response) => {
        if (response?.ok) {
          setPreview(response.preview);
          setHasKey(true);
          setApiKey('');
          setTestResult(null);
        }
        setSaving(false);
      });
    } else {
      setTimeout(() => {
        setPreview(apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4));
        setHasKey(true);
        setApiKey('');
        setSaving(false);
      }, 500);
    }
  }

  function handleTest() {
    const keyToTest = apiKey.trim() || null;
    if (!keyToTest) {
      setTestResult({ valid: false, message: 'Enter an API key first' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'TEST_API_KEY', apiKey: keyToTest }, (response) => {
        setTestResult(response);
        setTesting(false);
      });
    } else {
      setTimeout(() => {
        setTestResult({ valid: true, message: 'API key validated ✓' });
        setTesting(false);
      }, 1500);
    }
  }

  return (
    <div className="settings-section">
      <button
        className="settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="settings-toggle-left">
          <span className="settings-icon">⚙️</span>
          <span className="settings-toggle-text">AI Engine Settings</span>
        </div>
        <div className="settings-toggle-right">
          <span className={`settings-status-badge ${hasKey ? 'connected' : 'disconnected'}`}>
            {hasKey ? '● AI Online' : '○ Regex Only'}
          </span>
          <span className={`settings-chevron ${isOpen ? 'open' : ''}`}>›</span>
        </div>
      </button>

      {isOpen && (
        <div className="settings-panel">
          <div className="settings-info">
            Uses <strong>OpenRouter API</strong> to access Gemini 2.5 Flash for deep AI-powered threat analysis.
          </div>

          {hasKey && preview && (
            <div className="settings-current-key">
              <span className="settings-key-label">Active Key</span>
              <span className="settings-key-value">{preview}</span>
            </div>
          )}

          <div className="settings-input-group">
            <input
              type="password"
              className="settings-input"
              placeholder="sk-or-v1-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>

          <div className="settings-buttons">
            <button
              className="settings-btn settings-btn-test"
              onClick={handleTest}
              disabled={testing || !apiKey.trim()}
            >
              {testing ? 'Testing...' : '▶ Test'}
            </button>
            <button
              className="settings-btn settings-btn-save"
              onClick={handleSave}
              disabled={saving || !apiKey.trim()}
            >
              {saving ? 'Saving...' : '✓ Save Key'}
            </button>
          </div>

          {testResult && (
            <div className={`settings-test-result ${testResult.valid ? 'success' : 'error'}`}>
              {testResult.message}
            </div>
          )}

          <div className="settings-hint">
            Get a free API key at <strong>openrouter.ai</strong>
          </div>
        </div>
      )}
    </div>
  );
}
