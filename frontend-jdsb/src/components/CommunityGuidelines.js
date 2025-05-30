import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const CommunityGuidelines = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
      <Header />
      
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
              Community Guidelines
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              At FactCheck.com, our mission is to promote truth, transparency, and respectful dialogue.
              To maintain a safe and trustworthy environment, we ask all users to follow these community guidelines.
            </p>
          </div>

          {/* What's Encouraged Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6 flex items-center">
                <span className="text-3xl mr-3 animate-bounce">✨</span> What's Encouraged
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: '🤝',
                    title: 'Respectful Discussion',
                    description: 'Engage in constructive conversations, even when you disagree. Treat everyone with courtesy.'
                  },
                  {
                    icon: '🔍',
                    title: 'Truth-Seeking',
                    description: 'Share information that is backed by credible sources. Fact-based input is always welcome.'
                  },
                  {
                    icon: '🌟',
                    title: 'Transparency',
                    description: 'When providing feedback or submitting claims, be clear and honest about context and sources.'
                  },
                  {
                    icon: '💝',
                    title: 'Civility First',
                    description: 'Use polite and inclusive language. Everyone deserves to feel safe and heard here.'
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

          {/* What's Not Allowed Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-900 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent mb-6 flex items-center">
                <span className="text-3xl mr-3 animate-pulse">⛔</span> What's Not Allowed
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: '🚫',
                    title: 'Hate Speech or Discrimination',
                    description: 'Any language that targets people based on race, gender, religion, nationality, sexual orientation, or disability will not be tolerated.'
                  },
                  {
                    icon: '❌',
                    title: 'Misinformation',
                    description: 'Do not knowingly spread false or misleading information.'
                  },
                  {
                    icon: '⚠️',
                    title: 'Harassment or Threats',
                    description: 'Bullying, intimidation, or targeting individuals is strictly prohibited.'
                  },
                  {
                    icon: '🚯',
                    title: 'Spam or Self-Promotion',
                    description: 'Irrelevant links, repetitive comments, and promotional content are not allowed.'
                  },
                  {
                    icon: '📝',
                    title: 'Plagiarism',
                    description: 'Do not copy or present others work as your own without proper credit.'
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start p-4 rounded-lg bg-gradient-to-r from-red-50 to-red-100 
                      transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="text-3xl mr-4 animate-pulse">{item.icon}</span>
                    <div>
                      <h3 className="font-semibold bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Submissions Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6 flex items-center">
                <span className="text-3xl mr-3 animate-bounce">📮</span> User Submissions
              </h2>
              <p className="text-gray-700 mb-6">If you submit claims or comments:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: '📊',
                    text: 'Ensure they are fact-based or clearly labeled as opinion.'
                  },
                  {
                    icon: '🔄',
                    text: 'Be open to discussion and correction.'
                  },
                  {
                    icon: '⚖️',
                    text: 'Understand that your content may be moderated or removed if it violates these guidelines.'
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

          {/* Moderation Policy Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6 flex items-center">
                <span className="text-3xl mr-3 animate-bounce">👮</span> Moderation Policy
              </h2>
              <p className="text-gray-700 mb-6">Our team reserves the right to:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: '🗑️',
                    text: 'Remove content that violates these guidelines'
                  },
                  {
                    icon: '🚷',
                    text: 'Suspend or ban repeat or severe offenders'
                  },
                  {
                    icon: '📝',
                    text: 'Update these guidelines as the community evolves'
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

          {/* Reporting Violations Section */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6 flex items-center">
                <span className="text-3xl mr-3 animate-bounce">🚨</span> Reporting Violations
              </h2>
              <p className="text-gray-700 mb-6">If you see behavior that goes against these guidelines, please let us know.</p>
              <div className="flex items-center justify-center">
                <div className="flex items-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-red-50 
                  transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <span className="text-3xl mr-4 animate-bounce">📧</span>
                  <div>
                    <p className="text-gray-700">Contact us at:</p>
                    <a 
                      href="mailto:fact-checkers@gmail.com" 
                      className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-red-600 font-semibold 
                        hover:from-red-600 hover:to-blue-900 transition-all duration-300"
                    >
                      fact-checker@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Message */}
          <div className="text-center">
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">
              Together, let's build a community grounded in respect, curiosity, and integrity. 
              <span className="inline-block animate-bounce ml-2">🌟</span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityGuidelines;
