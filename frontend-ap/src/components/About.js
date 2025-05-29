import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
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
              <Link to="/about" className="text-blue-900 font-semibold border-b-2 border-red-600">About</Link>
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
                <Link to="/about" className="block text-blue-900 font-semibold">About</Link>
                <Link to="/faqs" className="block text-gray-700">FAQ/Help</Link>
                <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Login/Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* About Content */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">About Us</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-8">
                In an era where misinformation spreads faster than the truth, we believe facts should be louder than fiction.
              </p>

              <div className="bg-blue-50 rounded-xl p-8 mb-8">
                <p className="text-gray-700">
                  FactCheck is a fact-checking platform designed to evaluate public claims and provide clarity through credible, 
                  transparent, and evidence-backed verification. Our mission is to empower people with the truth by checking 
                  statements, viral posts, or any circulating claims against trusted, verifiable sources — and scoring them 
                  on a 0 to 100 credibility scale.
                </p>
              </div>

              <div className="bg-red-50 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-bold text-red-800 mb-6">Our Process</h2>
                <p className="text-gray-700 mb-4">Each claim is:</p>
                <ul className="list-none space-y-4">
                  <li className="flex items-center">
                    <span className="text-2xl mr-3">🔍</span>
                    <span className="text-gray-700">Carefully analyzed for context and accuracy</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-2xl mr-3">📚</span>
                    <span className="text-gray-700">Cross-referenced with trusted media outlets, academic sources, and official data</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-2xl mr-3">⭐</span>
                    <span className="text-gray-700">Scored based on how strongly it's supported by reliable information</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-2xl mr-3">🔗</span>
                    <span className="text-gray-700">Linked to original sources so you can verify for yourself</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-8 mb-12">
                <p className="text-gray-700">
                  Whether it's political statements, social media trends, or viral misinformation, we provide a simple, 
                  transparent, and research-driven view of what's true and what's not — all in one place.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Meet the Team</h2>
              <p className="text-gray-700 mb-8 text-center">This platform is built by a team of passionate developers and truth-seekers:</p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* Team Member 1 */}
                <a
                  href="https://www.linkedin.com/in/jdsb06/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transform hover:scale-105 transition-transform"
                >
                  <div className="bg-white shadow-lg rounded-xl p-6">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden relative">
                      <img 
                        src="/images/jashandeep.jpeg" 
                        alt="Jashandeep Singh Bedi" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-red-100 rounded-full flex items-center justify-center absolute top-0 left-0 hidden">
                        <span className="text-4xl text-red-600">JS</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 text-center">Jashandeep Singh</h3>
                    <p className="text-gray-600 text-center">Backend Architect</p>
                  </div>
                </a>


                {/* Team Member 2 */}
                <a
                  href="https://www.linkedin.com/in/kanav-kumar-b655962b5/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transform hover:scale-105 transition-transform"
                >
                  <div className="bg-white shadow-lg rounded-xl p-6">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden relative">
                      <img 
                        src="/images/kanav.jpeg" 
                        alt="Kanav Kumar" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-red-100 rounded-full flex items-center justify-center absolute top-0 left-0 hidden">
                        <span className="text-4xl text-red-600">KK</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 text-center">Kanav Kumar</h3>
                    <p className="text-gray-600 text-center">Integration Architect</p>
                  </div>
                </a>

                {/* Team Member 3 */}
                <a
                  href="https://www.linkedin.com/in/ayush-patel-72a037316/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transform hover:scale-105 transition-transform"
                >
                  <div className="bg-white shadow-lg rounded-xl p-6">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden relative">
                      <img 
                        src="/images/ayush.jpeg" 
                        alt="Ayush Patel" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center absolute top-0 left-0 hidden">
                        <span className="text-4xl text-blue-900">AP</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 text-center">Ayush Patel</h3>
                    <p className="text-gray-600 text-center">UI/UX Designer</p>
                  </div>
                </a>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-red-600 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Why It Matters</h2>
                <p className="text-white">
                  In a digital world overflowing with opinions, algorithms, and half-truths, facts matter more than ever. 
                  With FactCheck, we're building a future where anyone can get clear, unbiased, and reliable answers—backed 
                  by sources you can trust.
                </p>
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
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><a href="/submit" className="hover:text-white transition-colors">Submit Claim</a></li>
                <li><a href="#browse" className="hover:text-white transition-colors">Browse Claims</a></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
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

export default About;
