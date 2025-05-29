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
    <div className="w-80 sm:w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <span role="img" aria-label="robot" className="text-xl">🤖</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">Vaani</h3>
              <button
                onClick={toggleModel}
                className="text-xs bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded transition-colors"
              >
                {currentModel === MODELS.GEMINI 
                  ? 'Using Gemini' 
                  : currentModel === MODELS.GPT 
                    ? 'Using GPT-4o' 
                    : 'Using Grok'}
              </button>
            </div>
            <p className={`text-xs ${showFlashingMessage ? 'text-blue-200' : 'opacity-0'} transition-opacity duration-500`}>
              Hi, it's Vaani, here to assist you
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-red-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Quick Start View */}
        {currentView === 'quickStart' && (
          <div className="p-4 overflow-y-auto">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Start - What can I help you with?</h4>
            <div className="space-y-2">
              {QUICK_START_QUESTIONS.map((question) => (
                <button
                  key={question.id}
                  onClick={() => handleQuickStart(question)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm text-gray-700 hover:text-blue-900 transition-colors border border-transparent hover:border-blue-200"
                >
                  {question.title}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Or ask me anything:</p>
            </div>
          </div>
        )}

        {/* Sub Questions View */}
        {currentView === 'subQuestions' && selectedQuestion && (
          <div className="p-4 overflow-y-auto">
            <div className="flex items-center mb-4">
              <button
                onClick={backToQuickStart}
                className="text-blue-600 hover:text-blue-800 mr-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h4 className="text-sm font-semibold text-gray-900">{selectedQuestion.title}</h4>
            </div>
            <div className="space-y-2">
              {selectedQuestion.subQuestions.map((subQuestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSubQuestion(subQuestion)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm text-gray-700 hover:text-blue-900 transition-colors border border-transparent hover:border-blue-200"
                >
                  {subQuestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat View */}
        {currentView === 'chat' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.isError
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : message.isLoading
                      ? 'bg-gray-50 text-gray-600 border border-gray-200'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.file && (
                    <div className="mb-2 text-xs opacity-75">
                      📎 {message.file.name}
                    </div>
                  )}
                  {message.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <span>{message.content}</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                  <p className="text-xs mt-1 opacity-75">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Footer - Input Area */}
      <div className="border-t border-gray-200 p-4">
        {fileUpload && (
          <div className="mb-2 flex items-center justify-between bg-blue-50 p-2 rounded text-sm">
            <span className="text-blue-800">📎 {fileUpload.name}</span>
            <button onClick={removeFile} className="text-red-600 hover:text-red-800">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={(!inputValue.trim() && !fileUpload) || isLoading}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotWindow;