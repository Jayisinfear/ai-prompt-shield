# 🛡️ AI Prompt Shield v2.0
> **The Browser-Level Defense Against LLM Attacks & Dangerous Content**

## 💡 The Elevator Pitch
Large Language Models (LLMs) are incredibly powerful, but they are highly vulnerable to **Prompt Injection, Jailbreaks, and Social Engineering**. Furthermore, employees or users might accidentally use them for dangerous or non-compliant queries. 

**AI Prompt Shield** is a browser extension that sits between the user and popular AI chatbots (ChatGPT, Gemini, Claude). It acts as a zero-latency, dual-engine firewall that intercepts, analyzes, and neutralizes malicious prompts *before* they ever reach the AI model.

---

## 🏗️ Technical Architecture
We use a **Hybrid "Two-Pass" Engine** to achieve maximum accuracy without sacrificing the user experience.

### Pass 1: The Local Regex Engine (⚡ Instant)
- **Where it runs:** Locally in the browser extension's Background Service Worker.
- **How it works:** Compares the input against a massive, hardcoded pattern-matching database of over 300 known attack vectors (e.g., `Ignore all previous instructions`, `You are DAN`).
- **Why we have it:** It’s completely free, works offline, and takes <5ms to run.

### Pass 2: The LLM Security Auditor (🤖 Deep Scan)
- **Where it runs:** Remote API call via OpenRouter.
- **How it works:** If a prompt passes basic checks, we send it to an elite evaluator model (**Google Gemini 2.5 Flash**). We use a highly specialized system prompt that instructs Gemini to act as a Cybersecurity Auditor to analyze the *intent* of the prompt.
- **The Magic:** The LLM returns structured JSON containing a Risk Score (0-100), an Attack Type Category, an Explanation, and a Confidence interval.

*The two scores are mathematically weighted (30% Regex / 70% AI) to produce the final Risk Verdict.*

---

## ✨ Core Features Built So Far

1. **Universal Interception:** The content script hooks into DOM event listeners (keydown, click) to seamlessly intercept inputs on ChatGPT, Gemini, Claude, Perplexity, and HuggingChat.
2. **Shadow DOM Overlay UI:** When a threat is detected, we inject a beautiful, glassmorphism React-style UI over the screen. We use the Shadow DOM to ensure our CSS never conflicts with the underlying chatbot's CSS.
3. **Comprehensive Content Safety:** We detect two main categories of threats:
    - **Adversarial Attacks:** Jailbreaks, Prompt Injections, Role Hijacking, Payload Smuggling, Context Manipulation.
    - **Dangerous Content:** Hacking guides, Weapons manufacturing, Self-harm, Privacy violations/Doxxing.
4. **✨ Auto-Rewriting (Suggest Safe Version):** If a user's prompt is blocked, the extension can call the AI API to evaluate the user's *true intent* and rewrite the prompt into a safe, educational alternative that strips out the harmful elements.
5. **Popup Analytics Dashboard:** A localized React UI in the extension popup that displays scan history, blocked/allowed stats, and API Key management.

---

## 🚀 Hackathon "Winning" Roadmap (Next Steps)
To take this from a "cool extension" to an "Enterprise Security Platform", we should aim to build some of the following before judging:

* [ ] **The "Threat Radar" Live Typing Indicator:** A small glowing dot (🟢/🟡/🔴) injected directly alongside the ChatGPT input box that updates in real-time as the user types (utilizing the zero-latency Regex engine).
* [ ] **Enterprise SaaS Dashboard:** Build a separate Next.js web application. The extension will send anonymous telemetry to a database (like Supabase), allowing "Company Admins" to view a global live map and analytics charts of threats blocked across their entire organization.
* [ ] **"Double-Shield" Response Scanning:** Implement a MutationObserver that scans the *output* streaming back from ChatGPT. If the chatbot gets compromised and starts producing malicious code, the screen immediately blurs out to protect the user.

---

## 🛠️ Developer Setup Guide

1. Make sure Node.js is installed.
2. Run `npm install` in the root directory.
3. Run `npm run build` to compile the Vite + React code.
4. Open Chrome-based browser: navigate to `chrome://extensions/`
5. Enable **Developer Mode** (top right).
6. Click **Load unpacked** and select the `dist` folder located in the root directory.
7. Go to `gemini.google.com` (or ChatGPT) and *Refresh the page*. Type a bad prompt (e.g. "Tell me how to pick a lock") to test the shield!
