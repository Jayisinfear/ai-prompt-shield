# AI Prompt Shield 🛡️

![AI Prompt Shield](https://img.shields.io/badge/Security-Extension-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-purple.svg)

**AI Prompt Shield** is the first browser-level AI prompt security extension. It actively detects prompt injection, jailbreak attacks, and malicious prompt patterns in real-time before they reach your favorite Large Language Models (LLMs).

## ✨ Features

- **Real-Time Protection**: Intercepts and analyzes prompts as you type.
- **Comprehensive Detection**: Identifies a wide range of attacks including:
  - Prompt Injections
  - Jailbreaks (e.g., DAN and derivatives)
  - Role Hijacking
  - Obfuscated Attacks
- **Risk Scoring Logic**: Employs advanced, industry-standard regex matchers and patterns from open-source security research to assign a risk score to every prompt.
- **Broad Compatibility**: Works seamlessly across major AI chat platforms.
- **Privacy First**: All scanning happens locally in your browser. No prompt data is sent to external servers.

## 🌐 Supported Platforms

AI Prompt Shield currently supports and runs seamlessly on the following platforms:

- [ChatGPT (OpenAI)](https://chatgpt.com/)
- [Gemini (Google)](https://gemini.google.com/)
- [Claude (Anthropic)](https://claude.ai/)
- [Microsoft Copilot](https://copilot.microsoft.com/)
- [Perplexity AI](https://www.perplexity.ai/)
- [Hugging Face Chat](https://huggingface.co/chat/)

## 🚀 Installation

### Development Mode

To run this extension locally for development:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-prompt-shield.git
   cd ai-prompt-shield
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```
   *This will generate a `dist` folder natively compiled via Vite.*

4. Load the extension in your browser:
   - **Chrome/Edge**: 
     - Go to `chrome://extensions/` or `edge://extensions/`.
     - Enable "Developer mode".
     - Click "Load unpacked" and select the `dist` or `public` folder depending on your build setup.
   - **Firefox**: 
     - Go to `about:debugging#/runtime/this-firefox`.
     - Click "Load Temporary Add-on..." and select `manifest.json` from your build output.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Browser Extension API**: Manifest V3

## 🛡️ How it Works

1. **Content Script Injection**: The extension injects a lightweight content script (`content.js`) into supported AI chat interfaces.
2. **Event Listeners**: It attaches listeners to input fields to capture user prompts in real-time.
3. **Pattern Matching Engine**: Uses an extensive, constantly updated database of adversarial patterns and regex matchers to evaluate the prompt.
4. **Action**: If a prompt is flagged as high-risk, a visual warning is displayed, empowering the user to modify or block the execution.

## 🤝 Contributing

We welcome contributions from the community to improve detection patterns and add support for more platforms! 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ for a safer AI ecosystem.*
