const API_KEY = 'AIzaSyDIQv2fdAMaorn7yUdYDoOPbbaxpTASl90';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export function useGeminiApi() {
  const generateResponse = async (prompt) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
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