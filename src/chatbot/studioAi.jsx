const API_KEY = 'AIzaSyDIQv2fdAMaorn7yUdYDoOPbbaxpTASl90';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export function useGeminiApi() {
  const generateResponse = async (prompt, messageHistory = []) => {
    try {
      // Create a properly formatted conversation for the Gemini API
      const contents = [];

      // Process all messages in history
      for (const msg of messageHistory) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }

      console.log('Sending to Gemini API:', JSON.stringify(contents, null, 2));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          contents,
          // Add these parameters to improve context retention
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Invalid response format', data);
        if (data.error) {
          return `Error: ${data.error.message || 'Unknown error'}`;
        }
        return 'Sorry, I couldn\'t process that.';
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'Sorry, there was an error processing your request.';
    }
  };

  return { generateResponse };
}