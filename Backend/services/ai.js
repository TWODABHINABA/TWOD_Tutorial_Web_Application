const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function askGemini(prompt) {
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  const body = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  const headers = {
    'Content-Type': 'application/json',
    'x-goog-api-key': GEMINI_API_KEY,
  };

  try {
    const response = await axios.post(endpoint, body, { headers });
    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "I couldn't understand that.";
  } catch (error) {
    console.error("Gemini error:", error?.response?.data || error.message);
    return "An error occurred while talking to AI.";
  }
}

module.exports = { askGemini };