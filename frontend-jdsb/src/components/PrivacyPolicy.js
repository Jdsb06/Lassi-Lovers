import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';
import Header from './Header';
import Footer from './Footer';

const PrivacyPolicy = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
      <Header />
      
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Effective Date: {currentDate}
            </p>
          </div>

          {/* Back to Home Button */}
          <div className="text-center mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-red-600 
                hover:from-red-600 hover:to-blue-900 transition-all duration-300 transform hover:scale-110"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Introduction */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                Welcome to FactCheck.com. We are committed to safeguarding your privacy and ensuring that your 
                personal data is protected. This Privacy Policy outlines how we collect, use, disclose, and 
                safeguard your information when you visit our website.
              </p>
            </div>
          </div>

          {/* Information Collection Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
                1. Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">We may collect and process the following data:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: '👤',
                    title: 'Personal Information',
                    description: 'Name, email address, and any other information you voluntarily provide.'
                  },
                  {
                    icon: '📊',
                    title: 'Usage Data',
                    description: 'IP address, browser type, operating system, and pages visited.'
                  },
                  {
                    icon: '🍪',
                    title: 'Cookies',
                    description: 'Used to enhance user experience and analyze site traffic.'
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start p-4 rounded-lg bg-gradient-to-r from-blue-50 to-red-50 
                      transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="text-3xl mr-4 animate-bounce">{item.icon}</span>
                    <div>
                      <h3 className="font-semibold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Data Usage Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
                2. How We Use Your Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: '🛠️',
                    text: 'To provide and maintain our services'
                  },
                  {
                    icon: '💬',
                    text: 'To communicate with you and respond to inquiries'
                  },
                  {
                    icon: '📈',
                    text: 'To analyze usage patterns and improve functionality'
                  },
                  {
                    icon: '🔒',
                    text: 'To ensure website security and integrity'
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-red-50 
                      transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="text-3xl mr-4 animate-bounce">{item.icon}</span>
                    <p className="text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Data Sharing Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
                3. Sharing Your Information
              </h2>
              <p className="text-gray-700 mb-6">
                We do not sell, trade, or rent your personal identification information to others. 
                However, we may share your information with:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: '🤝',
                    title: 'Service Providers',
                    description: 'Trusted third parties who assist in operating our website, subject to confidentiality.'
                  },
                  {
                    icon: '⚖️',
                    title: 'Legal Requirements',
                    description: 'When required by law or in response to valid requests by public authorities.'
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start p-4 rounded-lg bg-gradient-to-r from-blue-50 to-red-50 
                      transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="text-3xl mr-4 animate-bounce">{item.icon}</span>
                    <div>
                      <h3 className="font-semibold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Your Rights Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
                4. Your Data Protection Rights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: '🔍',
                    title: 'Access',
                    description: 'Request copies of your personal data'
                  },
                  {
                    icon: '✏️',
                    title: 'Rectification',
                    description: 'Request correction of inaccurate data'
                  },
                  {
                    icon: '🗑️',
                    title: 'Erasure',
                    description: 'Request deletion of your data'
                  },
                  {
                    icon: '⛔',
                    title: 'Restriction',
                    description: 'Limit how we use your data'
                  },
                  {
                    icon: '❌',
                    title: 'Objection',
                    description: 'Object to data processing'
                  },
                  {
                    icon: '📤',
                    title: 'Portability',
                    description: 'Transfer your data elsewhere'
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start p-4 rounded-lg bg-gradient-to-r from-blue-50 to-red-50 
                      transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="text-3xl mr-4 animate-bounce">{item.icon}</span>
                    <div>
                      <h3 className="font-semibold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
                Contact Us
              </h2>
              <div className="text-center">
                <p className="text-gray-700 mb-6">
                  If you have any questions or concerns about this Privacy Policy, please contact us:
                </p>
                <div className="space-y-4">
                  <a 
                    href="mailto:fact-checkers@gmail.com" 
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-red-600 
                      hover:from-red-600 hover:to-blue-900 transition-all duration-300 transform hover:scale-110"
                  >
                    fact-checker@gmail.com
                  </a>
                  <a 
                    href="https://factcheck.com" 
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-red-600 
                      hover:from-red-600 hover:to-blue-900 transition-all duration-300 transform hover:scale-110"
                  >
                    factcheck.com
                  </a>
                  <p className="text-gray-700 mt-6">
                    Developed by: Jashadeep Singh Bedi, Kanav Kumar, and Ayush Patel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
