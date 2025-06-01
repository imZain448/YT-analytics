// llm.js - Handles LLM API calls

/**
 * Call an LLM provider (OpenAI, Claude, Gemini) with the given payload.
 * @param {'openai'|'claude'|'gemini'} provider
 * @param {string} apiKey
 * @param {object} payload - The request body (prompt/messages/etc)
 * @returns {Promise<object>} The parsed response from the LLM API
 */
async function callLLM(provider, apiKey, payload) {
    const urlMap = {
        openai: 'https://api.openai.com/v1/chat/completions',
        claude: 'https://api.anthropic.com/v1/messages',
        gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
    };
    const headersMap = {
        openai: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        claude: { 'x-api-key': apiKey, 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
        gemini: { 'Content-Type': 'application/json' } // Gemini uses key in URL
    };
    const url = provider === 'gemini' ? `${urlMap[provider]}?key=${apiKey}` : urlMap[provider];
    const headers = headersMap[provider];
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });
    const result = await response.json();
    return result;
}

// Example usage:
// callLLM('openai', 'sk-...', { model: 'gpt-3.5-turbo', messages: [...] }) 