# 🛡️ AI Prompt Shield

> A Chrome extension that protects users from prompt injection attacks, jailbreaks, and dangerous content on AI chatbots — in real time.

![Chrome Extension](https://img.shields.io/badge/Platform-Chrome%20Extension-blue?logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![React](https://img.shields.io/badge/Frontend-React%2018-61dafb?logo=react&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-4285F4?logo=google&logoColor=white)

---

## 🤔 What is this?

AI chatbots like ChatGPT, Gemini, and Claude are powerful — but vulnerable. Users can exploit them with **prompt injections**, **jailbreaks**, and **social engineering** to bypass safety guidelines.

**AI Prompt Shield** sits between the user and the chatbot. It intercepts every prompt, analyzes it for threats using a **hybrid two-pass engine**, and blocks dangerous prompts before they ever reach the AI model.

---

## ✨ Features

- **🔍 Real-Time Interception** — Catches prompts on ChatGPT, Gemini, Claude, Copilot, Perplexity & HuggingChat
- **⚡ Instant Regex Analysis** — 300+ attack patterns, runs in <5ms, works offline
- **🤖 AI-Powered Deep Scan** — Uses Gemini 2.5 Flash to understand prompt *intent*, not just keywords
- **🎯 Dual Threat Detection** — Catches both adversarial attacks (jailbreaks, injections) and dangerous content (hacking, self-harm)
- **✏️ Smart Rewriting** — Suggests a safe version of blocked prompts using AI
- **🎨 Premium Overlay UI** — Glassmorphism design with animated risk scores, injected via Shadow DOM
- **📊 Analytics Dashboard** — Popup UI with scan history, stats, and API key management
- **🔄 Graceful Fallback** — If AI is unavailable, falls back to regex-only mode automatically

---

## 🏗️ How It Works

```
User types a prompt in ChatGPT/Gemini/Claude
                ↓
        Content Script intercepts it
                ↓
    ┌───────────┴───────────┐
    ↓                       ↓
Pass 1: Regex Engine    Pass 2: AI Auditor
  (local, <5ms)        (Gemini 2.5 Flash)
  300+ patterns         Semantic analysis
    ↓                       ↓
    └───────────┬───────────┘
                ↓
     Combined Score (30% Regex + 70% AI)
                ↓
        Score < 20 → ✅ Allow
        Score ≥ 20 → 🛑 Show warning overlay
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, CSS3, Vite 5 |
| Extension | Chrome Manifest V3 |
| AI Model | Google Gemini 2.5 Flash |
| API Gateway | OpenRouter |
| Analysis | Regex Pattern Matching + AI |
| Storage | Chrome Storage API |
| UI Isolation | Shadow DOM |

---

## 📸 Screenshots

### Extension Popup Dashboard
The popup shows scan statistics, recent scan history with risk levels, and API key management.

### Threat Detection Overlay
When a threat is detected, a premium overlay appears with the risk score, attack type, AI explanation, and action buttons.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- A Chrome-based browser (Chrome, Edge, Brave, etc.)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/ai-prompt-shield.git
   cd ai-prompt-shield
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Go to `chrome://extensions/`
   - Enable **Developer Mode** (top right)
   - Click **Load unpacked**
   - Select the `dist` folder

5. **Test it out**
   - Visit [gemini.google.com](https://gemini.google.com) or [chatgpt.com](https://chatgpt.com)
   - Refresh the page
   - Try typing a suspicious prompt like *"Ignore all previous instructions"*

---

## 📁 Project Structure

```
ai-prompt-shield/
├── public/
│   ├── manifest.json          # Chrome extension config
│   ├── background.js          # Service worker — message routing & analysis
│   ├── content.js             # Injected into chatbot pages — intercepts prompts
│   ├── analyser/
│   │   ├── riskAnalyser.js    # Pass 1: Regex pattern matching engine
│   │   └── aiAnalyser.js      # Pass 2: AI analysis via Gemini
│   ├── patterns/
│   │   └── attackPatterns.js  # 300+ regex attack patterns
│   └── icons/                 # Extension icons
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Main popup component
│   ├── App.css                # Global styles & design system
│   └── components/
│       ├── Header.jsx         # Top bar with logo & mode badge
│       ├── StatsPanel.jsx     # Scanned / Blocked / Allowed counters
│       ├── RiskScore.jsx      # Current threat display
│       ├── ScanHistory.jsx    # Recent scans list
│       ├── ShieldToggle.jsx   # Enable/disable toggle
│       └── ApiKeySettings.jsx # API key management
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔑 API Key Setup

The extension uses [OpenRouter](https://openrouter.ai/) to access Google Gemini 2.5 Flash.

1. Get an API key from [openrouter.ai](https://openrouter.ai/)
2. Click the extension icon → expand **API Key Settings**
3. Paste your key and click **Test & Save**

> The extension works without an API key too — it just uses regex-only mode.

---

## 🎯 Supported Platforms

| Platform | Status |
|----------|--------|
| ChatGPT | ✅ |
| Google Gemini | ✅ |
| Claude | ✅ |
| Microsoft Copilot | ✅ |
| Perplexity | ✅ |
| HuggingChat | ✅ |

---

## 🧠 What It Detects

### Adversarial Attacks
- Prompt Injection (*"Ignore all previous instructions"*)
- Jailbreaks (*"You are DAN, do anything now"*)
- Role Hijacking (*"Pretend you are an evil AI"*)
- Payload Smuggling
- Context Manipulation

### Dangerous Content
- Hacking & cybercrime guides
- Weapons manufacturing
- Self-harm content
- Privacy violations & doxxing

---

## 👥 Team

**Team Anti Gravity**

---

## 📄 License

This project is for educational purposes.
