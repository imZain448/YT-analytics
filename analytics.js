// analytics.js - Compute general analytics from watch history

// Utility: Group by key
function groupBy(arr, key) {
    return arr.reduce((acc, item) => {
        const val = item && item[key] ? item[key] : 'Unknown';
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});
}

function cleanText(text) {
    if (!text) return '';

    // Remove extra whitespace and newlines
    let cleaned = text.trim();

    // Remove duplicate text if it appears multiple times
    const words = cleaned.split(/\s+/);
    const uniqueWords = [...new Set(words)];
    cleaned = uniqueWords.join(' ');

    // Remove any remaining newlines and extra spaces
    cleaned = cleaned.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

    return cleaned;
}

// Map YouTube category IDs to their names
const categoryMap = {
    '1': 'Film & Animation',
    '2': 'Autos & Vehicles',
    '10': 'Music',
    '15': 'Pets & Animals',
    '17': 'Sports',
    '19': 'Travel & Events',
    '20': 'Gaming',
    '22': 'People & Blogs',
    '23': 'Comedy',
    '24': 'Entertainment',
    '25': 'News & Politics',
    '26': 'Howto & Style',
    '27': 'Education',
    '28': 'Science & Technology',
    '29': 'Nonprofits & Activism'
};

// Calculate analytics from watch history
async function calculateAnalytics(history) {
    const numVideos = history.length;

    // Fetch metadata for each video
    const metadataPromises = history.map(item => fetchVideoMetadata(item.url));
    const metadataResults = await Promise.all(metadataPromises);

    // Calculate watch hours from metadata
    const totalSeconds = metadataResults.reduce((sum, metadata) => {
        if (metadata && metadata.duration) {
            const duration = metadata.duration;
            const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            const hours = parseInt(match[1] || 0);
            const minutes = parseInt(match[2] || 0);
            const seconds = parseInt(match[3] || 0);
            return sum + (hours * 3600) + (minutes * 60) + seconds;
        }
        return sum;
    }, 0);
    const watchHours = (totalSeconds / 3600).toFixed(2);

    // Top channel
    const channelCounts = groupBy(history, 'channel');
    const topChannel = cleanText(Object.entries(channelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A');

    // Top genre (if available)
    const genreCounts = groupBy(metadataResults, 'categoryId');
    const topGenreId = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const topGenre = categoryMap[topGenreId] || 'N/A';

    return { numVideos, watchHours, topChannel, topGenre };
}

// Function to fetch video metadata using YouTube Data API
async function fetchVideoMetadata(videoUrl) {
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) return null;

    // Get API key from local storage
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['yt_api_key'], function (data) {
            const apiKey = data.yt_api_key;
            if (!apiKey) {
                console.error('YouTube API key not found in local storage.');
                resolve(null);
                return;
            }

            const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,snippet&key=${apiKey}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.items && data.items.length > 0) {
                        const video = data.items[0];
                        resolve({
                            duration: video.contentDetails.duration,
                            tags: video.snippet.tags || [],
                            categoryId: video.snippet.categoryId
                        });
                    } else {
                        resolve(null);
                    }
                })
                .catch(error => {
                    console.error('Error fetching video metadata:', error);
                    resolve(null);
                });
        });
    });
}
