# 🧠 Chrome Extension: “YouTube Watch LLM Analyzer”

### ✅ **Core Features**

| Feature                                  | Implementation Summary                                                      |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| 🔍 **Watch history scraping**             | Uses `content.js` on `https://www.youtube.com/feed/history` to extract data |
| 🧠 **LLM-based analysis**                 | Calls OpenAI, Claude, or Gemini API with user-provided API key              |
| 📅 **Daily → Monthly/Yearly aggregation** | Stores daily stats in `chrome.storage.local` and aggregates                 |
| 📊 **Analytics in new tab**               | Opens a `chrome-extension://.../dashboard.html` tab UI instead of popup     |
| ⚙️ **Custom configurations**              | User can define genres or specific content to track                         |
| 🔐 **Local storage only**                 | All data remains on device; LLM calls are the only external interaction     |
| 📈 **Telemetry**                          | Logs inputs/outputs of each LLM request (locally) for review/debugging      |

---

## 🗂️ Project Structure

```
youtube-llm-analyzer/
├── manifest.json
├── background.js
├── content.js
├── dashboard.html
├── dashboard.js
├── llm.js
├── config.js
├── telemetry.js
├── style.css
└── icons/
```

---

## 📄 manifest.json

Key points:

```json
{
  "manifest_version": 3,
  "name": "YouTube Watch LLM Analyzer",
  "version": "1.0",
  "description": "LLM-powered watch history insights with full user control.",
  "permissions": [
    "tabs", "scripting", "storage"
  ],
  "host_permissions": [
    "https://www.youtube.com/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_title": "YouTube LLM Analyzer"
  },
  "content_scripts": [
    {
      "matches": ["https://www.youtube.com/feed/history"],
      "js": ["content.js"]
    }
  ],
  "web_accessible_resources": [{
    "resources": ["dashboard.html"],
    "matches": ["<all_urls>"]
  }]
}
```

---

## 💻 Key Functional Modules

### 📌 content.js – Watch History Collector

Scrapes the YouTube History page for video title, channel, duration, timestamp.

---

### 📌 background.js – Orchestrator

Listens for events (e.g., scrape done), stores daily snapshots, opens dashboard when triggered.

---

### 📌 llm.js – LLM Client

```js
async function callLLM(provider, apiKey, payload) {
  const urlMap = {
    openai: "https://api.openai.com/v1/chat/completions",
    claude: "https://api.anthropic.com/v1/messages",
    gemini: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
  };

  const headersMap = {
    openai: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    claude: { "x-api-key": apiKey, "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
    gemini: { "Content-Type": "application/json" } // Add key to URL for Gemini
  };

  const url = provider === "gemini" ? `${urlMap[provider]}?key=${apiKey}` : urlMap[provider];
  const headers = headersMap[provider];

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  return result;
}
```

---

### 📌 dashboard.html / dashboard.js

Renders analytics:

* Heatmap of time vs views
* Pie chart of genres (user-defined)
* Trends over months
* Search/filter tools
* LLM-generated summary

---

### 📌 config.js

Handles:

* API key input
* Provider selection
* Content categories to track
* Auto-scheduling LLM analysis

---

### 📌 telemetry.js

```js
function logTelemetry(request, response) {
  chrome.storage.local.get("telemetry", (data) => {
    const log = data.telemetry || [];
    log.push({ timestamp: new Date().toISOString(), request, response });
    chrome.storage.local.set({ telemetry: log });
  });
}
```

---

## 📎 Optional Enhancements

* [ ] Import/export configuration
* [ ] Local model fallback (e.g., WebLLM later)
* [ ] "Privacy mode" toggle
* [ ] Snapshot download as CSV or PDF

---

Would you like me to generate the base files as a downloadable `.zip` or paste initial core files (like `manifest.json`, `content.js`, and `llm.js`) to get you started right away?
