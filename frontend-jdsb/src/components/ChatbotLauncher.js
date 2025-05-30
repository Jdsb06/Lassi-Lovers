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
          className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-50 animate-slideUp">
          <ChatbotWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Floating Launcher Button */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* Help Message Tooltip */}
        {(showHelpMessage || showTooltip) && !isOpen && (
          <div className="absolute bottom-full right-0 mb-3">
            <div className="relative bg-gradient-to-r from-blue-900 to-red-600 text-white px-4 py-2 rounded-xl shadow-lg">
              <p className="text-sm font-medium">How may I help you?</p>
              {/* Animated wave effect */}
              <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-900 to-red-600 rounded-xl opacity-50 blur group-hover:opacity-75 animate-pulse -z-10"></div>
              {/* Arrow */}
              <div className="absolute -bottom-2 right-4 w-4 h-4 bg-red-600 transform rotate-45"></div>
            </div>
          </div>
        )}

        <button
          onClick={toggleChat}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`group relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-500 ${
            isOpen 
              ? 'bg-gradient-to-br from-red-600 to-red-700 rotate-[135deg]' 
              : 'bg-gradient-to-br from-blue-900 to-red-600'
          }`}
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-900 to-red-600 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
          
          {/* Icon */}
          <div className="relative">
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
                {/* Notification dot */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </span>
              </div>
            )}
          </div>
        </button>
      </div>
    </>
  );
};

export default ChatbotLauncher;