import React, { useState, useEffect } from 'react';
import ChatbotWindow from './ChatbotWindow';

const ChatbotLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showHelpMessage, setShowHelpMessage] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Effect for periodic help message
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setShowHelpMessage(true);
        // Hide the message after 4 seconds
        setTimeout(() => {
          setShowHelpMessage(false);
        }, 4000);
      }, 20000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50">
          <ChatbotWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Floating Launcher Button */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* Help Message Tooltip */}
        {(showHelpMessage || showTooltip) && !isOpen && (
          <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gradient-to-r from-blue-900 to-red-600 text-white text-sm rounded-lg whitespace-nowrap shadow-lg animate-bounce">
            How may I help you?
            <div className="absolute top-full right-4 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-red-600"></div>
          </div>
        )}

        <button
          onClick={toggleChat}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
            isOpen 
              ? 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rotate-45' 
              : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
          }`}
        >
          {isOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="relative w-6 h-6">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4c4.97 0 9 3.13 9 7a6.5 6.5 0 01-2 4.5c-1.5 1.5-3.5 2.5-5.5 2.5h-3l-4 4v-4c-2.5-1-4-3-4-5.5C2.5 7.13 6.53 4 12 4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01"
                />
              </svg>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default ChatbotLauncher;