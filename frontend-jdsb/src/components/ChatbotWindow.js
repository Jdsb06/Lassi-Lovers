import React, { useState, useRef, useEffect } from 'react';
import useAIBot, { MODELS } from './useGeminiBot';

const QUICK_START_QUESTIONS = [
  {
    id: 'verification',
    title: 'How does FactCheck verify claims?',
    subQuestions: [
      'What AI models do you use for verification?',
      'How accurate is your fact-checking process?',
      'What sources does FactCheck consult?'
    ]
  },
  {
    id: 'sources',
    title: 'What sources do you use?',
    subQuestions: [
      'Which news organizations are in your database?',
      'How do you ensure source credibility?',
      'Can I suggest new sources to include?'
    ]
  },
  {
    id: 'submit',
    title: 'How to submit evidence?',
    subQuestions: [
      'What file formats can I upload?',
      'How long does verification take?',
      'Can I submit anonymous claims?'
    ]
  },
  {
    id: 'trust-score',
    title: 'Understanding Trust Scores',
    subQuestions: [
      'How are trust scores calculated?',
      'What makes a high vs low trust score?',
      'Can trust scores change over time?'
    ]
  },
  {
    id: 'community',
    title: 'Community fact-checking',
    subQuestions: [
      'How can I contribute to fact-checking?',
      'What are community guidelines?',
      'How do you prevent abuse of the system?'
    ]
  }
];

const ChatbotWindow = ({ onClose }) => {
  const [currentView, setCurrentView] = useState('quickStart'); // 'quickStart', 'subQuestions', 'chat'
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [fileUpload, setFileUpload] = useState(null);
  const [showFlashingMessage, setShowFlashingMessage] = useState(true);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const { sendMessage, isLoading, error, currentModel, toggleModel } = useAIBot();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Flashing message effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowFlashingMessage(prev => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Initial welcome message
  useEffect(() => {
    setMessages([{
      id: 1,
      type: 'bot',
      content: "Hi! I'm Vaani, your fact-checking assistant. I can help you understand how FactCheck works, answer questions about misinformation, and guide you through our platform. What would you like to know?",
      timestamp: new Date()
    }]);
  }, []);

  const handleQuickStart = (question) => {
    setSelectedQuestion(question);
    setCurrentView('subQuestions');
  };

  const handleSubQuestion = async (subQuestion) => {
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: subQuestion,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setCurrentView('chat');
    
    try {
      const response = await sendMessage(subQuestion);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Sorry, something went wrong. Please try again or contact support if the issue persists.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() && !fileUpload) return;

    const messageContent = fileUpload 
      ? `${inputValue.trim()} [File: ${fileUpload.name}]`
      : inputValue.trim();

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
      file: fileUpload
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setFileUpload(null);
    
    if (currentView !== 'chat') {
      setCurrentView('chat');
    }

    try {
      // Add loading message
      const loadingId = Date.now() + 1;
      setMessages(prev => [...prev, {
        id: loadingId,
        type: 'bot',
        isLoading: true,
        content: 'Vaani is thinking...',
        timestamp: new Date()
      }]);

      // Get response from Gemini
      const response = await sendMessage(messageContent);

      // Remove loading and add response
      setMessages(prev => 
        prev
          .filter(msg => msg.id !== loadingId)
          .concat({
            id: Date.now() + 2,
            type: 'bot',
            content: response,
            timestamp: new Date()
          })
      );

    } catch (err) {
      console.error('Chat error:', err);
      
      // Remove loading and add error
      setMessages(prev => 
        prev
          .filter(msg => !msg.isLoading)
          .concat({
            id: Date.now() + 2,
            type: 'bot',
            content: err.message || "Sorry, I couldn't process that request. Please try again.",
            timestamp: new Date(),
            isError: true
          })
      );
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUpload(file);
    }
  };

  const removeFile = () => {
    setFileUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const backToQuickStart = () => {
    setCurrentView('quickStart');
    setSelectedQuestion(null);
  };

  return (
    <div className="w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-red-600 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4c4.97 0 9 3.13 9 7a6.5 6.5 0 01-2 4.5c-1.5 1.5-3.5 2.5-5.5 2.5h-3l-4 4v-4c-2.5-1-4-3-4-5.5C2.5 7.13 6.53 4 12 4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Vaani</h3>
            <p className="text-white/80 text-sm">AI Assistant</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-red-50 p-4">
        {currentView === 'quickStart' && (
          <div className="space-y-3">
            {QUICK_START_QUESTIONS.map((question) => (
              <button
                key={question.id}
                onClick={() => handleQuickStart(question)}
                className="w-full p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 group"
              >
                <h4 className="text-left font-semibold text-gray-800 group-hover:bg-gradient-to-r group-hover:from-blue-900 group-hover:to-red-600 group-hover:bg-clip-text group-hover:text-transparent">
                  {question.title}
                </h4>
              </button>
            ))}
          </div>
        )}

        {currentView === 'subQuestions' && selectedQuestion && (
          <div className="space-y-3">
            <button
              onClick={backToQuickStart}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 mb-4 group"
            >
              <svg className="w-4 h-4 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to topics</span>
            </button>
            <h3 className="font-semibold text-lg bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-4">
              {selectedQuestion.title}
            </h3>
            <div className="space-y-2">
              {selectedQuestion.subQuestions.map((subQuestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSubQuestion(subQuestion)}
                  className="w-full p-3 bg-white rounded-lg text-left hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 group"
                >
                  <span className="text-gray-700 group-hover:bg-gradient-to-r group-hover:from-blue-900 group-hover:to-red-600 group-hover:bg-clip-text group-hover:text-transparent">
                    {subQuestion}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentView === 'chat' && (
          <div className="space-y-4">
            <button
              onClick={backToQuickStart}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 group"
            >
              <svg className="w-4 h-4 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to topics</span>
            </button>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-900 to-red-600 text-white'
                        : 'bg-white'
                    } ${message.isError ? 'bg-red-50 border border-red-200' : ''}`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className={message.type === 'user' ? 'text-white' : 'text-gray-800'}>
                          {message.content}
                        </p>
                        {message.file && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span>{message.file.name}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 pr-10 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-shadow duration-200"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".txt,.pdf,.doc,.docx,image/*"
            />
            {fileUpload && (
              <div className="absolute left-2 -top-8 flex items-center space-x-2 bg-blue-50 px-2 py-1 rounded-md text-sm">
                <span className="text-blue-700">{fileUpload.name}</span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-blue-700 hover:text-blue-900"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <button
            type="submit"
            disabled={!inputValue.trim() && !fileUpload}
            className={`p-2 rounded-xl ${
              !inputValue.trim() && !fileUpload
                ? 'text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-900 to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            } transition-all duration-200`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotWindow;