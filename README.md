# YouTube Watch History Analytics - Powered by Gen AI

A privacy-focused Chrome extension that leverages Large Language Models (LLMs) like OpenAI, Claude, and Gemini to analyze your YouTube watch history. Get actionable insights, interactive analytics, and full user control—all with your data stored locally.

This extension is still under development but its open for anyone if they want to contribute or try it out

---

## 🚀 Features

- **Automatic Watch History Scraping**: Collects your YouTube watch history directly from the YouTube History page, storing it locally.
- **LLM-Powered Insights**: Uses your API key to call OpenAI, Claude, or Gemini for:
  - Content category breakdowns
  - Behavioral trends (e.g., late-night viewing)
  - Personalized recommendations
- **Interactive Dashboard**: Full-page analytics dashboard with:
  - Summary cards (watch time, top genre, top channel, videos watched)
  - Daily/Monthly/Yearly charts
  - LLM-generated insights panel
  - Telemetry log viewer (local only)
- **User Configuration**:
  - Choose LLM provider and enter your API key
  - Select content categories to track
  - Toggle privacy and telemetry options
- **Modern UI**: Minimalist, dark/light mode, accent color picker, responsive design
- **Privacy First**: All data is stored locally; only LLM API calls send data externally (with your consent)

---

## 🛠️ Installation

1. **Clone or Download** this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the project folder.
5. The extension will appear in your Chrome extensions bar.

**Permissions required:**
- `tabs`, `scripting`, `storage`: For scraping and storing your history locally
- `https://www.youtube.com/*`: To access your YouTube History page

---

## 📈 Usage

1. **Collect Data**: Visit [YouTube History](https://www.youtube.com/feed/history). The extension will automatically scrape your visible watch history.
2. **Open Dashboard**: Click the extension icon or open the dashboard from the extension menu. This opens a full-page analytics dashboard (`dashboard.html`).
3. **Configure LLM**:
   - Select your preferred LLM provider (OpenAI, Claude, Gemini)
   - Enter your API key (kept local)
   - Optionally, set YouTube API key for richer metadata
4. **Run Analysis**: Click "Re-run LLM Analysis" to generate insights. Results appear in the AI Insights panel.
5. **Explore Analytics**:
   - View summary cards, charts, and LLM insights
   - Use the configuration panel to adjust settings
   - Expand the telemetry log to review LLM requests/responses (local only)

---

## 🔒 Privacy & Data Policy

- **Local Storage**: All watch history, analytics, and telemetry logs are stored in your browser's local storage.
- **External Calls**: Only LLM API requests (with your prompt and watch history) are sent externally, using your API key.
- **No Tracking**: No data is sent to any third party except the LLM provider you configure.
- **Telemetry**: All logs are local and can be reviewed or downloaded by you.

---

## 🗂️ Project Structure

```
youtube-llm-analyzer/
├── manifest.json         # Chrome extension manifest
├── background.js         # Opens dashboard, orchestrates events
├── content.js            # Scrapes YouTube watch history
├── dashboard.html        # Main analytics dashboard UI
├── dashboard.js          # Dashboard interactivity and LLM integration
├── analytics.js          # Computes analytics from watch history
├── llm.js                # Handles LLM API calls
├── config.js             # User configuration logic
├── telemetry.js          # Telemetry logging (local only)
├── style.css             # Dashboard styles
├── assets/               # Fonts, images, icons
├── vendor/               # Third-party libraries (e.g., Chart.js, FontAwesome)
└── docs/                 # UX and feature documentation
```

---

## ⚙️ Configuration

- **LLM Providers Supported**:
  - OpenAI (ChatGPT, GPT-3.5/4)
  - Claude (Anthropic)
  - Gemini (Google)
- **API Keys**:
  - Obtain your API key from your chosen provider
  - Enter it in the dashboard configuration panel (never leaves your device)
- **YouTube API Key** (optional):
  - For richer video metadata, you can add your YouTube Data API key
- **Custom Categories**: Add/remove content categories to track
- **Privacy Toggles**: Enable/disable telemetry, group short/long videos, etc.

---

## 🧑‍💻 Development & Contribution

- Fork or clone the repo
- Make your changes (UI, analytics, LLM integration, etc.)
- Test by reloading the unpacked extension in Chrome
- Pull requests welcome!

---
## Roadmap

- [x] dashboard UI
- [x] Basic data parsing with youtube
- [x] LLM configuration
- [x] youtube api integration
- [x] hueristic base analytics
      - for this there are still some works to do
- [ ] improved data parser for youtube watch history
- [ ] AI insights
- [ ] telemetry and logging
- [ ] reports and exports

---

## 🙏 Credits & License

- **Design & UX**: Inspired by minimalist, privacy-first analytics tools
- **Fonts**: Inter, Work Sans (see `assets/fonts/`)
- **Icons**: FontAwesome (see `assets/webfonts/`)
- **Charts**: Chart.js (see `vendor/`)

MIT License. See [LICENSE](LICENSE) for details.

---

## 📚 Further Reading

- [docs/UXOverview.md](docs/UXOverview.md): UX and design principles
- [docs/featureRequirementsOverview.md](docs/featureRequirementsOverview.md): Feature requirements and architecture

---

**Enjoy actionable, private YouTube analytics—powered by your favorite LLM!** 