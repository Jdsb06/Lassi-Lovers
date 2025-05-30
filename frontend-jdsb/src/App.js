import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './index.css';
import About from './components/About';
import TermsOfService from './components/TermsOfService';
import CommunityGuidelines from './components/CommunityGuidelines';
import PrivacyPolicy from './components/PrivacyPolicy';
import SubmitClaimPage from './components/SubmitClaimPage';
import BrowseClaimsPage from './components/BrowseClaimsPage';
import FAQ from './components/FAQ';
import TrustScoreDisplay from './components/TrustScoreDisplay';
import ChatbotLauncher from './components/ChatbotLauncher';
import AuthButton from './components/AuthButton';
import { AuthProvider } from './components/AuthContext';
import Footer from './components/Footer';
import Header from './components/Header';

// ScrollToTop component to handle scroll restoration
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const FactCheckHomepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to handle internal page links
  const handleInternalLink = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-16 bg-gradient-to-br from-blue-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Verify the Truth. 
              <span className="text-red-600"> Stop the Spread</span> of 
              <span className="text-blue-900"> Misinformation.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              <span className="font-bold">FactCheck - No Misinfo</span> is an <span className="font-bold">AI-powered platform</span> that helps you<br />
              verify claims and <span className="font-bold">stop misinformation</span> in its tracks.
            </p>
            <button 
              onClick={(e) => handleInternalLink(e, 'cta-section')}
              className="bg-gradient-to-r from-blue-900 to-red-600 text-white px-10 py-5 rounded-lg text-lg font-semibold hover:from-blue-800 hover:to-red-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
            >
              Start Fact-Checking
              <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
              Powerful Features
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              This comprehensive platform provides everything you need to combat misinformation effectively.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative bg-white">
              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-900 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px' }}>
                <div className="h-full w-full bg-white rounded-2xl"></div>
              </div>
              {/* Content */}
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-700 group-hover:[transform:rotateY(360deg)_rotate(-6deg)]">
                  <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Claim Submission</h3>
                <p className="text-gray-600">Easily submit claims or content for verification with our intuitive interface.</p>
              </div>
            </div>

            <div className="text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative bg-white">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-900 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px' }}>
                <div className="h-full w-full bg-white rounded-2xl"></div>
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-700 group-hover:[transform:rotateY(360deg)_rotate(-6deg)]">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Trust Score</h3>
                <p className="text-gray-600">Get real-time trust scores for articles and social posts with detailed explanations.</p>
              </div>
            </div>

            <div className="text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative bg-white">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-900 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px' }}>
                <div className="h-full w-full bg-white rounded-2xl"></div>
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-700 group-hover:[transform:rotateY(360deg)_rotate(-6deg)]">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Crowdsourced Fact-Checking</h3>
                <p className="text-gray-600">Contribute to the fight against misinformation by flagging and correcting content.</p>
              </div>
            </div>

            <div className="text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative bg-white">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-900 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px' }}>
                <div className="h-full w-full bg-white rounded-2xl"></div>
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-700 group-hover:[transform:rotateY(360deg)_rotate(-6deg)]">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Educational Chatbot</h3>
                <p className="text-gray-600">Ask our chatbot for reliable, evidence-backed answers to your questions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
              How It Works
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Our simple four-step process makes fact-checking accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative bg-white">
              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-900 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px' }}>
                <div className="h-full w-full bg-white rounded-2xl"></div>
              </div>
              {/* Content */}
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-700 group-hover:[transform:rotateY(360deg)_rotate(-6deg)] text-2xl font-bold">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Submit Claim</h3>
                <p className="text-gray-600">Submit an article, post, or video for fact-checking.</p>
              </div>
            </div>

            <div className="text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative bg-white">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-900 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px' }}>
                <div className="h-full w-full bg-white rounded-2xl"></div>
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-700 group-hover:[transform:rotateY(360deg)_rotate(-6deg)] text-2xl font-bold">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Verification</h3>
                <p className="text-gray-600">Our AI cross-checks your submission against trusted sources.</p>
              </div>
            </div>

            <div className="text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative bg-white">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-900 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px' }}>
                <div className="h-full w-full bg-white rounded-2xl"></div>
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-700 group-hover:[transform:rotateY(360deg)_rotate(-6deg)] text-2xl font-bold">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Trust Score</h3>
                <p className="text-gray-600">Receive a credibility score and detailed explanations.</p>
              </div>
            </div>

            <div className="text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative bg-white">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-900 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px' }}>
                <div className="h-full w-full bg-white rounded-2xl"></div>
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-700 group-hover:[transform:rotateY(360deg)_rotate(-6deg)] text-2xl font-bold">
                  4
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Flag and Correct</h3>
                <p className="text-gray-600">Flag incorrect content and contribute new evidence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Real experiences from our community of fact-checkers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative bg-white">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-900 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px' }}>
                <div className="h-full w-full bg-white rounded-2xl"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 text-yellow-400 transform transition-transform duration-300 group-hover:rotate-[${i * 72}deg]`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 text-lg">
                  "FactCheck helped us clarify a misleading news article in just minutes. 
                  The detailed explanations and source citations were invaluable."
                </p>
                <p className="font-semibold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">Arnab Goswami, Journalist</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative bg-white">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-900 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px' }}>
                <div className="h-full w-full bg-white rounded-2xl"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 text-yellow-400 transform transition-transform duration-300 group-hover:rotate-[${i * 72}deg]`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 text-lg">
                  "As an educator, this platform has become essential for teaching 
                  media literacy. The trust scores help students understand reliability."
                </p>
                <p className="font-semibold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">Alakh Pandey, Teacher</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative bg-white">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-900 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px' }}>
                <div className="h-full w-full bg-white rounded-2xl"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 text-yellow-400 transform transition-transform duration-300 group-hover:rotate-[${i * 72}deg]`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 text-lg">
                  "The crowdsourced fact-checking feature lets our community contribute 
                  to fighting misinformation. It's democracy in action."
                </p>
                <p className="font-semibold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">Narendra Modi, Leader</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta-section" className="py-16 bg-gradient-to-r from-blue-900 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Protecting Yourself from Misinformation Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust FactCheck - No Misinfo to verify claims and combat misinformation.
          </p>
          <Link 
            to="/submit"
            className="inline-block bg-gradient-to-r from-blue-900 to-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-800 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Submit Your First Claim
            <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Chatbot Launcher */}
      <ChatbotLauncher />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div>
          <Routes>
            <Route path="/" element={<FactCheckHomepage />} />
            <Route path="/submit" element={<SubmitClaimPage />} />
            <Route path="/browse" element={<BrowseClaimsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/guidelines" element={<CommunityGuidelines />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/faqs" element={<FAQ />} />
            <Route path="/result" element={<TrustScoreDisplay />} />
          </Routes>
          <ChatbotLauncher />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
