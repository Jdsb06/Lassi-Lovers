import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';
import Header from './Header';
import Footer from './Footer';

const TermsOfService = () => {
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
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Effective Date: {currentDate}
            </p>
          </div>

          {/* Introduction */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                Welcome to FactCheck.com. By accessing or using our website, you agree to be bound by the following 
                Terms of Service ("Terms"). Please read them carefully.
              </p>
            </div>
          </div>

          {/* Acceptance Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                By using FactCheck.com, you agree to comply with and be legally bound by these Terms. 
                If you do not agree, please do not use the site.
              </p>
            </div>
          </div>

          {/* Purpose Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
                2. Purpose of the Website
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 text-lg leading-relaxed">
                  FactCheck.com is a platform created to fact-check public claims by analyzing them against 
                  trustworthy sources. We assign a credibility score (0-100) and provide linked sources for transparency.
                </p>
                <p className="text-gray-600 italic">
                  Disclaimer: We strive for accuracy, but we do not guarantee the completeness, reliability, 
                  or timeliness of the information provided. All content is for informational purposes only, 
                  and should not be construed as legal, political, or professional advice.
                </p>
              </div>
            </div>
          </div>

          {/* Content Usage Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
                3. Use of Content
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-transparent mb-4">
                    You may:
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: '👁️',
                        text: 'View and share links to our content for personal, non-commercial use'
                      },
                      {
                        icon: '📚',
                        text: 'Use the information for educational and awareness purposes'
                      }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 
                          transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        <span className="text-3xl mr-4 animate-bounce">{item.icon}</span>
                        <p className="text-gray-700">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent mb-4">
                    You may not:
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: '❌',
                        text: 'Copy, reproduce, or republish content without credit'
                      },
                      {
                        icon: '⛔',
                        text: 'Misrepresent or alter our content for misleading purposes'
                      },
                      {
                        icon: '🚫',
                        text: 'Use the site to promote false information or spam'
                      }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-4 rounded-lg bg-gradient-to-r from-red-50 to-red-100 
                          transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        <span className="text-3xl mr-4 animate-pulse">{item.icon}</span>
                        <p className="text-gray-700">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Submissions Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
                4. User Submissions
              </h2>
              <p className="text-gray-700 mb-6">If users are allowed to submit claims, comments, or feedback:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: '📝',
                    text: 'You are responsible for the content you submit'
                  },
                  {
                    icon: '⚠️',
                    text: 'You must not post anything illegal, harmful, defamatory, or misleading'
                  },
                  {
                    icon: '🔄',
                    text: 'We reserve the right to remove or moderate any content at our discretion'
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

          {/* Contact Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
                Contact Us
              </h2>
              <div className="text-center">
                <p className="text-gray-700 mb-6">
                  For questions, concerns, or feedback about these Terms of Service, please contact us:
                </p>
                <div className="space-y-4">
                  <a 
                    href="mailto:ayushpatel11m@gmail.com" 
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-red-600 
                      hover:from-red-600 hover:to-blue-900 transition-all duration-300 transform hover:scale-110"
                  >
                    ayushpatel11m@gmail.com
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

export default TermsOfService;
