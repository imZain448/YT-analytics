// content.js - Scrapes YouTube watch history

function scrapeVisibleHistory() {
    // Each history item is a ytd-video-renderer or ytd-video-renderer-like element
    const items = Array.from(document.querySelectorAll('ytd-video-renderer, ytd-rich-item-renderer'));
    const results = items.map(item => {
        // Title
        const titleEl = item.querySelector('#video-title');
        const title = titleEl ? titleEl.textContent.trim() : '';
        // Channel
        const channelEl = item.querySelector('ytd-channel-name, #channel-name');
        const channel = channelEl ? channelEl.textContent.trim() : '';
        // Video URL
        const url = titleEl ? titleEl.href : '';
        // Thumbnail
        const isShort = url.match(/(?:v=|shorts\/)([\w-]+)/)?.[1];
        const thumbEl = item.querySelector('img#img');
        const thumbnail = thumbEl ? thumbEl.src : '';
        // Timestamp (if available)
        const timeEl = item.querySelector('div#metadata-line span');
        const timestamp = timeEl ? timeEl.textContent.trim() : '';
        // Description
        const descEl = item.querySelector('#description-text');
        const description = descEl ? descEl.textContent.trim() : '';

        const watchedPercentage = getWatchedPercentage(item);

        return { title, channel, url, thumbnail, timestamp, description, watchedPercentage: watchedPercentage.watchedPercentage };
    });
    console.log('YouTube Watch History (visible):', results);
    return results;
}

function storeTodayHistory(newItems) {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    chrome.storage.local.get([today], data => {
        const existing = data[today] || [];
        // Avoid duplicates by video URL
        const existingUrls = new Set(existing.map(item => item.url));
        const merged = [...existing];
        newItems.forEach(item => {
            if (item.url && !existingUrls.has(item.url)) {
                merged.push(item);
            }
        });
        chrome.storage.local.set({ [today]: merged }, () => {
            console.log('Updated YouTube Watch History for', today, merged);
        });
    });
}

function getWatchedPercentage(item) {
    const titleEl = item.querySelector('#video-title');
    const channelEl = item.querySelector('ytd-channel-name');
    const link = titleEl?.href;
    const videoId = link?.match(/v=([\w-]+)/)?.[1];

    const thumbnailProgress = item.querySelector('.ytd-thumbnail-overlay-resume-playback-renderer');
    const progressStyle = thumbnailProgress?.style?.width; // e.g., "57%"

    return { watchedPercentage: progressStyle || null };
}

async function autoScrapeHistory(maxScrolls = 30, delay = 1200) {
    let lastCount = 0;
    let scrolls = 0;
    while (scrolls < maxScrolls) {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(res => setTimeout(res, delay));
        const items = document.querySelectorAll('ytd-video-renderer, ytd-rich-item-renderer');
        if (items.length === lastCount) {
            break; // No new items loaded
        }
        lastCount = items.length;
        scrolls++;
    }
    const scraped = scrapeVisibleHistory();
    storeTodayHistory(scraped);
    console.log(`Auto-scrape complete. Total items: ${scraped.length}`);
}

// Run auto-scrape on script load
autoScrapeHistory();

// Placeholder: Scraping logic will be implemented here
console.log('YouTube LLM Analyzer content script loaded.'); 