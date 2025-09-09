import {useEffect, useState} from 'react';
import {useGeminiApi} from "./studioAi.jsx";
import Markdown from 'react-markdown';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {generateResponse} = useGeminiApi();

  // Add a system message at the beginning of conversation
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'bot',
        content: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn hôm nay?'
      }]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = {role: 'user', content: input};
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Pass the entire message history along with the current input
      const responseText = await generateResponse(input, updatedMessages);
      const botMessage = {role: 'bot', content: responseText};
      setMessages([...updatedMessages, botMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages([...updatedMessages, {
        role: 'bot',
        content: 'Sorry, there was an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  // Rest of your component remains the same...
  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            Send a message to start the conversation
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-200 text-gray-800 mr-auto'
              } max-w-[80%]`}
            >
              {message.role === 'user' ? (
                message.content
              ) : (
                <div className="markdown-body">
                  <Markdown>{message.content}</Markdown>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="bg-gray-200 text-gray-800 p-3 rounded-lg mr-auto max-w-[80%]">
            <div className="flex space-x-2">
              <div className="animate-bounce">●</div>
              <div className="animate-bounce delay-75">●</div>
              <div className="animate-bounce delay-150">●</div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBot;