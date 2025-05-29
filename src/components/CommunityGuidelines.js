import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center relative">
                <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-900 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">FactCheck</h1>
                <p className="text-xs text-red-600 font-semibold -mt-1">NO MISINFO</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-900 transition-colors">Home</Link>
              <Link to="/submit" className="text-gray-700 hover:text-blue-900 transition-colors">Submit a Claim</Link>
              <Link to="/browse" className="text-gray-700 hover:text-blue-900 transition-colors">Browse Claims</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-900 transition-colors">About</Link>
              <Link to="/faqs" className="text-gray-700 hover:text-blue-900 transition-colors">FAQ/Help</Link>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Login/Sign Up
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-4 py-3 space-y-3">
                <Link to="/" className="block text-gray-700">Home</Link>
                <Link to="/submit" className="block text-gray-700">Submit a Claim</Link>
                <Link to="/browse" className="block text-gray-700">Browse Claims</Link>
                <Link to="/about" className="block text-gray-700">About</Link>
                <Link to="/faqs" className="block text-gray-700">FAQ/Help</Link>
                <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Login/Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back to Home Button */}
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-900 hover:text-blue-700 mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4 text-center">Community Guidelines</h1>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-xl text-gray-600 mb-8">
                At FactCheck.com, our mission is to promote truth, transparency, and respectful dialogue. 
                To maintain a safe and trustworthy environment, we ask all users to follow these community guidelines.
              </p>

              {/* What's Encouraged Section */}
              <section className="mb-12 bg-green-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                  <span className="text-3xl mr-3">✨</span> What's Encouraged
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🤝</span>
                    <div>
                      <h3 className="font-semibold text-green-700">Respectful Discussion</h3>
                      <p className="text-gray-700">Engage in constructive conversations, even when you disagree. Treat everyone with courtesy.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🔍</span>
                    <div>
                      <h3 className="font-semibold text-green-700">Truth-Seeking</h3>
                      <p className="text-gray-700">Share information that is backed by credible sources. Fact-based input is always welcome.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🌟</span>
                    <div>
                      <h3 className="font-semibold text-green-700">Transparency</h3>
                      <p className="text-gray-700">When providing feedback or submitting claims, be clear and honest about context and sources.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">💝</span>
                    <div>
                      <h3 className="font-semibold text-green-700">Civility First</h3>
                      <p className="text-gray-700">Use polite and inclusive language. Everyone deserves to feel safe and heard here.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* What's Not Allowed Section */}
              <section className="mb-12 bg-red-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                  <span className="text-3xl mr-3">⛔</span> What's Not Allowed
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🚫</span>
                    <div>
                      <h3 className="font-semibold text-red-700">Hate Speech or Discrimination</h3>
                      <p className="text-gray-700">Any language that targets people based on race, gender, religion, nationality, sexual orientation, or disability will not be tolerated.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">❌</span>
                    <div>
                      <h3 className="font-semibold text-red-700">Misinformation</h3>
                      <p className="text-gray-700">Do not knowingly spread false or misleading information.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">⚠️</span>
                    <div>
                      <h3 className="font-semibold text-red-700">Harassment or Threats</h3>
                      <p className="text-gray-700">Bullying, intimidation, or targeting individuals is strictly prohibited.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🚯</span>
                    <div>
                      <h3 className="font-semibold text-red-700">Spam or Self-Promotion</h3>
                      <p className="text-gray-700">Irrelevant links, repetitive comments, and promotional content are not allowed.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📝</span>
                    <div>
                      <h3 className="font-semibold text-red-700">Plagiarism</h3>
                      <p className="text-gray-700">Do not copy or present others' work as your own without proper credit.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* User Submissions Section */}
              <section className="mb-12 bg-blue-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                  <span className="text-3xl mr-3">📮</span> User Submissions
                </h2>
                <p className="text-gray-700 mb-4">If you submit claims or comments:</p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📊</span>
                    <p className="text-gray-700">Ensure they are fact-based or clearly labeled as opinion.</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🔄</span>
                    <p className="text-gray-700">Be open to discussion and correction.</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">⚖️</span>
                    <p className="text-gray-700">Understand that your content may be moderated or removed if it violates these guidelines.</p>
                  </div>
                </div>
              </section>

              {/* Moderation Policy Section */}
              <section className="mb-12 bg-yellow-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-yellow-800 mb-6 flex items-center">
                  <span className="text-3xl mr-3">👮</span> Moderation Policy
                </h2>
                <p className="text-gray-700 mb-4">Our team reserves the right to:</p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🗑️</span>
                    <p className="text-gray-700">Remove content that violates these guidelines</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🚷</span>
                    <p className="text-gray-700">Suspend or ban repeat or severe offenders</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📝</span>
                    <p className="text-gray-700">Update these guidelines as the community evolves</p>
                  </div>
                </div>
              </section>

              {/* Reporting Violations Section */}
              <section className="mb-12 bg-purple-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                  <span className="text-3xl mr-3">🚨</span> Reporting Violations
                </h2>
                <p className="text-gray-700 mb-4">If you see behavior that goes against these guidelines, please let us know.</p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📧</span>
                    <div>
                      <p className="text-gray-700">Contact us at:</p>
                      <a 
                        href="mailto:ayushpatel11m@gmail.com" 
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        ayushpatel11m@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Final Message */}
              <div className="text-center text-xl text-blue-900 py-8">
                <p>Together, let's build a community grounded in respect, curiosity, and integrity. 🌟</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center relative">
                  <div className="w-5 h-5 bg-blue-900 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold">FactCheck</h3>
                  <p className="text-xs text-red-400">NO MISINFO</p>
                </div>
              </div>
              <p className="text-gray-400">
                Fighting misinformation with AI-powered fact-checking and community collaboration.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/submit" className="hover:text-white transition-colors">Submit Claim</a></li>
                <li><a href="#browse" className="hover:text-white transition-colors">Browse Claims</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/faqs" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/guidelines" className="hover:text-white transition-colors">Community Guidelines</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="/" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <span className="text-sm font-bold">f</span>
                </a>
                <a href="/" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <span className="text-sm font-bold">t</span>
                </a>
                <a href="/" className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                  <span className="text-sm font-bold">in</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} FactCheck - No Misinfo. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommunityGuidelines;