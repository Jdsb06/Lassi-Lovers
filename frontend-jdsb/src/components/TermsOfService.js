import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';

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
              <AuthButton />
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
                <div className="mt-2">
                  <AuthButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24">
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

          <h1 className="text-4xl font-bold text-blue-900 mb-8">Terms of Service</h1>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-gray-500">Effective Date: {currentDate}</p>
            
            <p className="mt-6">
              Welcome to FactCheck.com. By accessing or using our website, you agree to be bound by the following 
              Terms of Service ("Terms"). Please read them carefully.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By using FactCheck.com, you agree to comply with and be legally bound by these Terms. 
              If you do not agree, please do not use the site.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">2. Purpose of the Website</h2>
            <p>
              FactCheck.com is a platform created to fact-check public claims by analyzing them against 
              trustworthy sources. We assign a credibility score (0-100) and provide linked sources for transparency.
            </p>
            <p className="text-gray-600 italic mt-2">
              Disclaimer: We strive for accuracy, but we do not guarantee the completeness, reliability, 
              or timeliness of the information provided. All content is for informational purposes only, 
              and should not be construed as legal, political, or professional advice.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">3. Use of Content</h2>
            <p>You may:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>View and share links to our content for personal, non-commercial use</li>
              <li>Use the information for educational and awareness purposes</li>
            </ul>
            <p>You may not:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Copy, reproduce, or republish content without credit</li>
              <li>Misrepresent or alter our content for misleading purposes</li>
              <li>Use the site to promote false information or spam</li>
            </ul>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">4. User Submissions</h2>
            <p>If users are allowed to submit claims, comments, or feedback:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>You are responsible for the content you submit</li>
              <li>You must not post anything illegal, harmful, defamatory, or misleading</li>
              <li>We reserve the right to remove or moderate any content at our discretion</li>
            </ul>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">5. Intellectual Property</h2>
            <p>
              All content on FactCheck.com—including text, design, logo, and analysis—is the intellectual 
              property of the team unless otherwise stated. Unauthorized use is prohibited.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">6. External Links</h2>
            <p>
              We include links to third-party websites as references. We are not responsible for the 
              content or privacy practices of these external sites.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">7. Limitation of Liability</h2>
            <p>
              FactCheck.com and its creators are not liable for any damages, losses, or consequences 
              resulting from the use of our content or reliance on our fact-checks.
            </p>
            <p className="mt-2">Use of the website is at your own risk.</p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">8. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. When we do, we'll revise the "Effective Date" 
              above. Continued use of the site after changes means you accept the updated Terms.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">9. Contact Us</h2>
            <p>For questions, concerns, or feedback, feel free to contact us at:</p>
            <p className="mt-2">
              <strong>Website:</strong>{' '}
              <a href="https://factcheck.com" className="text-blue-600 hover:text-blue-800">
                factcheck.com
              </a>
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:ayushpatel11m@gmail.com" className="text-blue-600 hover:text-blue-800">
                ayushpatel11m@gmail.com
              </a>
            </p>
            <p className="mt-4">
              <strong>Developed by:</strong> Jashadeep Singh Bedi, Kanav Kumar, and Ayush Patel
            </p>
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

export default TermsOfService;