import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';

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

      {/* Privacy Policy Content */}
      <div className="pt-24 bg-gradient-to-br from-blue-50 to-red-50">
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
            <h1 className="text-4xl font-bold text-blue-900 mb-4 text-center">Privacy Policy</h1>
            <p className="text-gray-600 mb-8 text-center">Effective Date: {currentDate}</p>

            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-8">
                Welcome to FactCheck.com. We are committed to safeguarding your privacy and ensuring that your 
                personal data is protected. This Privacy Policy outlines how we collect, use, disclose, and 
                safeguard your information when you visit our website.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">1. Information We Collect</h2>
                <p className="mb-4">We may collect and process the following data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Personal Identification Information:</strong> Such as your name, email address, 
                    and any other information you voluntarily provide when contacting us or submitting claims.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Including your IP address, browser type, operating system, 
                    referral URLs, and pages visited on our site.
                  </li>
                  <li>
                    <strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance user experience, 
                    analyze site traffic, and for security purposes. For more details, please refer to our Cookie Policy.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">Your information is used for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and maintain our services.</li>
                  <li>To communicate with you, including responding to inquiries and providing updates.</li>
                  <li>To analyze usage patterns and improve our website's functionality.</li>
                  <li>To ensure the security and integrity of our website.</li>
                  <li>To comply with legal obligations and enforce our terms and policies.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">3. Sharing Your Information</h2>
                <p className="mb-4">
                  We do not sell, trade, or rent your personal identification information to others. 
                  However, we may share your information with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> Trusted third parties who assist us in operating our 
                    website and conducting our business, provided they agree to keep this information confidential.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> If required by law or in response to valid requests 
                    by public authorities.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">4. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal data 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">5. Your Data Protection Rights</h2>
                <p className="mb-4">Depending on your location, you may have the following rights:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> You have the right to request copies of your personal data.</li>
                  <li><strong>Rectification:</strong> You can request correction of any inaccurate or incomplete data.</li>
                  <li><strong>Erasure:</strong> You can request the deletion of your personal data under certain conditions.</li>
                  <li><strong>Restriction:</strong> You can request that we restrict the processing of your personal data.</li>
                  <li><strong>Objection:</strong> You can object to our processing of your personal data.</li>
                  <li>
                    <strong>Data Portability:</strong> You can request that we transfer the data we have 
                    collected to another organization or directly to you.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">6. Third-Party Links</h2>
                <p>
                  Our website may contain links to external sites. We are not responsible for the privacy 
                  practices or content of these third-party websites.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">7. Children's Privacy</h2>
                <p>
                  Our services are not directed to individuals under the age of 13. We do not knowingly 
                  collect personal information from children under 13.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">8. Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by 
                  posting the new Privacy Policy on this page with an updated effective date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">9. Contact Us</h2>
                <p className="mb-4">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
                <p>
                  <strong>Email: </strong>
                  <a 
                    href="mailto:ayushpatel11m@gmail.com" 
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    ayushpatel11m@gmail.com
                  </a>
                </p>
                <p className="mt-4">
                  <strong>Website: </strong>
                  <a 
                    href="https://factcheck.com" 
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    factcheck.com
                  </a>
                </p>
                <p className="mt-4">
                  <strong>Developed by:</strong> Jashadeep Singh Bedi, Kanav Kumar, and Ayush Patel
                </p>
              </section>
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

export default PrivacyPolicy;
