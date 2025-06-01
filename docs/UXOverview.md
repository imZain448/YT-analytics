# Youtube Analytics - UX overview


### 🔷 Overview

Design a **dashboard interface for a Chrome extension** called **"YouTube LLM Analyzer"**. This extension analyzes a user’s YouTube watch history using LLMs (OpenAI, Claude, or Gemini). It shows detailed consumption patterns over time, allows user configuration, and emphasizes privacy (local storage except for LLM API calls).

The extension does **not use a popup**—it opens a **dedicated full-page tab** (`dashboard.html`) for analytics.

---

### 🖥️ Page Layout

#### **Top Navigation Bar**

* App name: *YouTube LLM Analyzer*
* Profile icon (top right) with dropdown:

  * View API Keys
  * Download Telemetry
  * Settings

---

### 🧩 Sections in Main Dashboard

#### 📊 1. **Analytics Summary Section (Top Cards)**

* Total Watch Time This Month (hours)
* Most Watched Genre
* Top Channel
* Number of Videos Watched

> Display as info cards with small icon and value

---

#### 📆 2. **Time-Based Visualizations**

* **Daily Timeline (Bar chart)** → Hours watched per day
* **Monthly Heatmap (Calendar-style)** → Watch frequency
* **Yearly Consumption Trends (Line chart)** → Total minutes/month

---

#### 🔎 3. **LLM-Generated Insights Panel**

* Card with LLM logo + provider name
* Shows:

  * Content category summary (e.g., “You watched 42% education, 31% entertainment…”)
  * Behavior trends (e.g., “You mostly watch tech content after 10PM…”)
  * Personalized message: “You might consider reducing late-night binge-watching of drama series”

> Include a refresh button: “Re-run LLM Analysis”

---

#### ⚙️ 4. **User Configurations**

* Select LLM Provider (Dropdown): OpenAI / Claude / Gemini
* Enter API Key field (masked input)
* Content Categories to Track (add/remove tags)
* Toggle:

  * [ ] Track specific keywords
  * [ ] Group short vs long videos
  * [ ] Enable telemetry logging (show warning about local-only storage)

> Save & Test button at the bottom

---

#### 📂 5. **Telemetry Log Viewer**

* Expandable panel
* Table showing:

  * Timestamp
  * LLM provider
  * Prompt (click to expand)
  * Response (click to expand)

---

### 🎨 Style Guide

* Minimalist and privacy-focused aesthetic
* Clean sans-serif typography (e.g., Inter, Roboto)
* Dark + light mode toggle
* Consistent use of YouTube red as accent, muted backgrounds

---

### 🧭 User Flow Hints

1. User installs extension → visits YouTube History → data is collected silently.
2. User clicks on extension icon → opens full dashboard tab.
3. They enter their API key and LLM provider → trigger analysis.
4. Dashboard updates with charts + summaries.
5. User can view or download telemetry logs at any time.

---

This prompt should guide most AI UX tools to generate a clean, usable layout. If needed, I can also help convert this into a rough Figma prototype or wireframe. Let me know.
