const API_KEY = 'AIzaSyDIQv2fdAMaorn7yUdYDoOPbbaxpTASl90';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export function useGeminiApi() {
  // Function that takes the entire message history
  const generateResponse = async (prompt, messageHistory = []) => {
    try {
      // Format conversation history for the API
      const formattedHistory = messageHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Add the current user prompt
      const contents = formattedHistory.length > 0
        ? formattedHistory
        : [{ role: 'user', parts: [{ text: prompt }] }];

      // If we have history but it doesn't include the current prompt yet
      if (formattedHistory.length > 0 &&
        formattedHistory[formattedHistory.length - 1].role !== 'user') {
        contents.push({
          role: 'user',
          parts: [{ text: prompt }]
        });
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': API_KEY
        },
        body: JSON.stringify({ contents })
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Invalid response format', data);
        return 'Sorry, I couldn\'t process that.';
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'Sorry, there was an error processing your request.';
    }
  };

  return { generateResponse };
}