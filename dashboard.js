// dashboard.js - Handles dashboard UI logic and interactivity
console.log('dashboard.js loaded');

// Import analytics function

function setupAccentColorButtons() {
    const accentButtons = document.querySelectorAll('.accent-btn-circle');
    accentButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const color = btn.getAttribute('data-color');
            console.log('Accent color button clicked:', color); // DEBUG
            document.documentElement.style.setProperty('--cyber-accent', color);
            // Highlight selected button
            accentButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
    // Set default selected
    if (accentButtons[0]) accentButtons[0].classList.add('selected');
}

function setupDashboardEventListeners() {
    setupAccentColorButtons();

    // 1. Render Daily Watch Time Chart
    const dailyCtx = document.getElementById('dailyChart')?.getContext('2d');
    if (dailyCtx) {
        new Chart(dailyCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    data: [4.2, 3.8, 5.1, 4.5, 6.2, 8.1, 7.3],
                    backgroundColor: '#FF0000',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 255, 0, 0.1)' },
                        ticks: { color: '#e2e8f0' }
                    },
                    x: {
                        grid: { color: 'rgba(0, 255, 0, 0.1)' },
                        ticks: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }

    // 2. Render Monthly Trends Chart
    const monthlyCtx = document.getElementById('monthlyChart')?.getContext('2d');
    if (monthlyCtx) {
        new Chart(monthlyCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    data: [120, 135, 142, 128, 155, 142],
                    borderColor: '#FF0000',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    // 3. Profile Dropdown Toggle
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', () => {
            profileDropdown.classList.toggle('hidden');
        });
    }

    // 4. Telemetry Log Toggle
    const toggleLogs = document.getElementById('toggleLogs');
    const logsContent = document.getElementById('logsContent');
    if (toggleLogs && logsContent) {
        toggleLogs.addEventListener('click', () => {
            logsContent.classList.toggle('hidden');
            const icon = toggleLogs.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        });
    }

    // 5. Save & Test button
    const saveTestBtn = document.getElementById('save-test-btn');
    console.log('Save & Test event binding attempted', saveTestBtn);
    if (saveTestBtn) {
        saveTestBtn.addEventListener('click', function () {
            console.log('Save & Test button clicked');
            const provider = document.getElementById('llm-provider-select')?.value || '';
            const apiKey = document.querySelector('#configuration input[type="password"]')?.value || '';
            if (!provider || !apiKey) {
                alert('Please select a provider and enter your API key.');
                return;
            }
            chrome.storage.local.set({ llmProvider: provider, llmApiKey: apiKey }, function () {
                if (chrome.runtime.lastError) {
                    alert('Failed to save configuration: ' + chrome.runtime.lastError.message);
                } else {
                    alert('Configuration saved!');
                }
            });
        });
    }

    // 6. Re-run Analysis button

    const mdContainer = document.getElementById('insights-markdown');
    if (chrome.storage.local.get("insights")) {
        mdContainer.innerHTML = `<div class="insight-box">${window.marked.parse(chrome.storage.local.get("insights"))}</div>`;
    }

    const rerunBtn = document.getElementById('rerun-analysis-btn');
    if (rerunBtn) {
        rerunBtn.addEventListener('click', runLLMAnalysis);
    }

    // 7. Reset button (optional: clear config fields)
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.getElementById('llm-provider-select').selectedIndex = 0;
            document.querySelector('#configuration input[type="password"]').value = '';
            alert('Configuration reset!');
        });
    }

    // Tab switching for AI Insights
    setupInsightsTabs();

    // Save Configuration
    document.getElementById('save-test-btn').addEventListener('click', function () {
        const provider = document.getElementById('llm-provider-select').value;
        const llmApiKey = document.getElementById('llm-api-key').value;
        const youtubeApiKey = document.getElementById('youtube-api-key').value;

        if (llmApiKey && youtubeApiKey) {
            chrome.storage.local.set({
                [provider]: llmApiKey,
                yt_api_key: youtubeApiKey
            }, function () {
                alert('Configuration saved!');
            });
        } else {
            alert('Please enter valid API keys for both LLM and YouTube.');
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDashboardEventListeners);
} else {
    setupDashboardEventListeners();
}

// --- LLM Analysis Integration ---
// Remove custom renderMarkdown, use marked.js instead

async function runLLMAnalysis() {
    // 1. Load provider and API key from storage
    chrome.storage.local.get(['llmProvider', 'llmApiKey'], function (config) {
        const provider = (config.llmProvider || '').trim().toLowerCase();
        const apiKey = (config.llmApiKey || '').trim();
        if (!provider || !apiKey) {
            alert('Please configure your LLM provider and API key first.');
            return;
        }

        // 2. Load today's watch history
        const today = new Date().toISOString().slice(0, 10);
        chrome.storage.local.get([today], async function (data) {
            const history = data[today] || [];
            if (!history.length) {
                alert('No watch history found for today.');
                return;
            }

            // 3. Format prompt
            const prompt = `Analyze my YouTube watch history for content distribution, viewing patterns, and recommendations. Here is the data: ${JSON.stringify(history)}`;

            // 4. Prepare payload
            let payload;
            if (provider === 'openai') {
                payload = {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant that analyzes YouTube watch history.' },
                        { role: 'user', content: prompt }
                    ]
                };
            } else if (provider === 'claude') {
                payload = {
                    model: 'claude-3-opus-20240229',
                    max_tokens: 1024,
                    messages: [
                        { role: 'user', content: prompt }
                    ]
                };
            } else if (provider === 'gemini') {
                payload = {
                    contents: [
                        { parts: [{ text: prompt }] }
                    ]
                };
            } else {
                alert('Unknown provider: ' + provider);
                return;
            }

            // 5. Show loading state
            const insightsPanel = document.getElementById('llm-insights');
            if (insightsPanel) insightsPanel.classList.add('loading');
            const btn = document.getElementById('rerun-analysis-btn');
            if (btn) btn.disabled = true;

            // 6. Call LLM
            try {
                const result = await callLLM(provider, apiKey, payload);
                // 7. Parse and display response
                let text = '';
                if (provider === 'openai') {
                    text = result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content;
                } else if (provider === 'claude') {
                    text = result.content && result.content[0] && result.content[0].text;
                } else if (provider === 'gemini') {
                    text = result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts[0].text;
                }
                if (text) {
                    // Render markdown in Overview tab using marked
                    const mdContainer = document.getElementById('insights-markdown');
                    chrome.storage.local.set({ "insights": text }, function () {
                        console.log('Insights stored:', text);
                    });
                    if (mdContainer && window.marked) {
                        mdContainer.innerHTML = `<div class="insight-box">${window.marked.parse(text)}</div>`;
                    }
                } else {
                    alert('No response from LLM.');
                }
            } catch (e) {
                alert('LLM call failed: ' + (e.message || e));
            } finally {
                if (insightsPanel) insightsPanel.classList.remove('loading');
                if (btn) btn.disabled = false;
            }
        });
    });
}

// Tab switching for AI Insights
function setupInsightsTabs() {
    const tabButtons = document.querySelectorAll('.insights-tab');
    const tabContents = {
        overview: document.getElementById('insights-overview'),
        charts: document.getElementById('insights-charts'),
        details: document.getElementById('insights-details')
    };
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabButtons.forEach(b => b.classList.remove('active'));
            // Hide all contents
            Object.values(tabContents).forEach(c => c.classList.add('hidden'));
            // Activate clicked
            btn.classList.add('active');
            const tab = btn.getAttribute('data-tab');
            if (tabContents[tab]) tabContents[tab].classList.remove('hidden');
        });
    });
}

// Function to update analytics in the dashboard
function updateAnalytics() {
    const today = new Date().toISOString().slice(0, 10);
    chrome.storage.local.get([today], function (data) {
        const history = data[today] || [];
        calculateAnalytics(history).then(analytics => {
            // Store analytics in local storage
            chrome.storage.local.set({ analytics }, function () {
                console.log('Analytics stored:', analytics);
            });

            // Update UI with analytics
            const watchHoursElement = document.getElementById('watch-hours');
            const numVideosElement = document.getElementById('num-videos');
            const topChannelElement = document.getElementById('top-channel');
            const topGenreElement = document.getElementById('top-genre');

            if (watchHoursElement) watchHoursElement.textContent = analytics.watchHours;
            if (numVideosElement) numVideosElement.textContent = analytics.numVideos;
            if (topChannelElement) topChannelElement.textContent = analytics.topChannel;
            if (topGenreElement) topGenreElement.textContent = analytics.topGenre;

            // Update summary cards
            document.getElementById('watch-time').textContent = analytics.watchHours ? analytics.watchHours + 'h' : '0.00h';
            document.getElementById('most-watched-genre').textContent = analytics.topGenre;
            document.getElementById('top-channel').textContent = analytics.topChannel;
            document.getElementById('videos-watched').textContent = analytics.numVideos;

            // Update chart sections if needed
            // Example: Update daily chart with new data
            const dailyCtx = document.getElementById('dailyChart')?.getContext('2d');
            if (dailyCtx) {
                // Destroy existing chart if it exists
                if (window.dailyChart) {
                    window.dailyChart.destroy();
                }
                // Example data update logic
                const dailyData = [analytics.numVideos, 0, 0, 0, 0, 0, 0]; // Replace with actual data
                window.dailyChart = new Chart(dailyCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            data: dailyData,
                            backgroundColor: '#FF0000',
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { color: 'rgba(0, 255, 0, 0.1)' },
                                ticks: { color: '#e2e8f0' }
                            },
                            x: {
                                grid: { color: 'rgba(0, 255, 0, 0.1)' },
                                ticks: { color: '#e2e8f0' }
                            }
                        }
                    }
                });
            }
        });
    });
}

// Call updateAnalytics when dashboard loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAnalytics);
} else {
    updateAnalytics();
}

// document.getElementById('root').innerText = 'YouTube LLM Analyzer Dashboard (UI coming soon)'; 