// background.js - Orchestrator for YouTube LLM Analyzer

chrome.runtime.onInstalled.addListener(() => {
    console.log('YouTube LLM Analyzer extension installed.');
});

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
});

// Placeholder for future event listeners (e.g., open dashboard, handle messages) 