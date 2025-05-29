import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TrustScoreDisplay from './TrustScoreDisplay';

const TrustScoreResult = () => {
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [trustedSources, setTrustedSources] = useState([]);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [querySubmitted, setQuerySubmitted] = useState(false);

  // Generate accuracy rates close to the user's score
  useEffect(() => {
    if (isSubmitted) {
      const generateNearbyScore = (baseScore, maxDiff = 5) => {
        const diff = Math.random() * maxDiff * 2 - maxDiff; // Random number between -maxDiff and +maxDiff
        return Math.min(100, Math.max(0, baseScore + diff)).toFixed(1);
      };

      const sources = [
        {
          name: "Reuters Fact Check",
          url: "https://www.reuters.com/fact-check",
          icon: "🌐",
          reliability: `${generateNearbyScore(score)}% Accuracy Rate`
        },
        {
          name: "Associated Press News",
          url: "https://apnews.com",
          icon: "📰",
          reliability: `${generateNearbyScore(score)}% Accuracy Rate`
        },
        {
          name: "Snopes Fact Checking",
          url: "https://www.snopes.com",
          icon: "🔍",
          reliability: `${generateNearbyScore(score)}% Accuracy Rate`
        },
        {
          name: "PolitiFact",
          url: "https://www.politifact.com",
          icon: "⚖️",
          reliability: `${generateNearbyScore(score)}% Accuracy Rate`
        }
      ];

      setTrustedSources(sources);
    }
  }, [isSubmitted, score]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  // Get background gradient based on score
  const getBackgroundGradient = () => {
    if (score <= 20) return 'from-red-50 via-white to-red-100';
    if (score <= 40) return 'from-orange-50 via-white to-red-50';
    if (score <= 60) return 'from-yellow-50 via-white to-orange-50';
    if (score <= 80) return 'from-green-50 via-white to-yellow-50';
    return 'from-emerald-50 via-white to-green-50';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isSubmitted ? getBackgroundGradient() : 'from-blue-50 via-white to-red-50'} transition-all duration-1000`}>
      {/* Header with navigation */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center relative group-hover:scale-105 transition-transform">
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

            {/* Desktop Navigation - Moved to right */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">Home</Link>
              <Link to="/submit" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">Submit a Claim</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">About</Link>
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
            <div className="md:hidden bg-white border-t mt-4">
              <div className="px-4 py-3 space-y-3">
                <Link to="/" className="block text-gray-700 hover:text-blue-900 transition-colors">Home</Link>
                <Link to="/submit" className="block text-gray-700 hover:text-blue-900 transition-colors">Submit a Claim</Link>
                <Link to="/about" className="block text-gray-700 hover:text-blue-900 transition-colors">About</Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
          </div>

          {/* Content card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-blue-50 rounded-full px-6 py-2 mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-blue-900 font-medium">Trust Score Analysis</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {isSubmitted ? "Results" : "Check Trust Score"}
              </h2>
              <p className="text-gray-600 text-lg">
                {isSubmitted 
                  ? "Here's how reliable the claim appears to be"
                  : "Enter a trust score between 0 and 100 to see the visualization"}
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-8">
                  <label htmlFor="score" className="block text-lg font-medium text-gray-700 mb-3">
                    Trust Score (0-100)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="score"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => setScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full px-6 py-4 text-2xl text-center font-bold border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-900 transition-all duration-300"
                      required
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-xl">%</span>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-bold text-lg"
                >
                  Generate Visualization
                </button>
              </form>
            ) : (
              <div className="max-w-md mx-auto">
                {/* Trust Score Display Section with Enhanced UI */}
                <div className="relative mb-8">
                  {/* Decorative Background Elements */}
                  <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/2 left-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-60 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-0 w-24 h-24 bg-red-100 rounded-full blur-2xl opacity-60 transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-0 left-1/2 w-32 h-32 bg-yellow-50 rounded-full blur-2xl opacity-40 transform -translate-x-1/2 -translate-y-1/4"></div>
                  </div>

                  {/* Score Label */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-4">
                        <Link
                          to="/"
                          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          <span className="text-sm font-medium">Back to Home</span>
                        </Link>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <div className="inline-flex items-center bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm border border-gray-100">
                          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span className="font-semibold text-gray-900">Trust Score Analysis</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust Score Display with Frame */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="relative">
                      {/* Decorative Corner Accents */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-600 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-600 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-600 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-600 rounded-br-lg"></div>
                      
                      {/* Trust Score Wheel */}
                      <div className="py-4">
                        <TrustScoreDisplay score={score} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Summary Section with Back Button */}
                <div className="mt-8 mb-12">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header with Back Button */}
                    <div className="bg-gradient-to-r from-blue-900 to-red-600 px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-white">Analysis Summary</h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {/* Key Points */}
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            The claim appears to be supported by multiple credible sources, with cross-referenced evidence from established fact-checking organizations.
                          </p>
                        </div>

                        {/* Verification Status */}
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            Our AI analysis indicates a high degree of factual accuracy, with verifiable data points from trusted news sources and academic publications.
                          </p>
                        </div>

                        {/* Recommendation */}
                        <div className="mt-6 bg-blue-50 rounded-xl p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <h4 className="font-semibold text-blue-900">Recommendation</h4>
                          </div>
                          <p className="text-blue-700 text-sm">
                            Based on our comprehensive analysis, this information can be considered reliable and suitable for citation with proper attribution.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resources Section */}
                <div className="mt-12 pt-12 border-t border-gray-200">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center bg-blue-50 rounded-full px-6 py-2 mb-4">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      <span className="text-blue-900 font-medium">Trusted Sources</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Resources Searched</h3>
                    <p className="text-gray-600">Our analysis is based on these highly reliable sources</p>
                  </div>

                  <div className="space-y-4">
                    {trustedSources.map((source, index) => (
                      <div 
                        key={index}
                        className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                      >
                        {/* Decorative gradient line */}
                        <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-red-600 to-blue-600 opacity-75"></div>
                        
                        <div className="flex items-start space-x-4">
                          <div className="text-2xl">{source.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                                {source.name}
                              </h4>
                              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                {source.reliability}
                              </span>
                            </div>
                            <a 
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              {source.url}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback Section */}
                {!feedbackSubmitted && !showFeedbackForm && !querySubmitted && (
                  <div className="mt-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Are you satisfied with the result?</h3>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => {
                          setFeedbackSubmitted(true);
                        }}
                        className="flex items-center px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Yes, I'm satisfied
                      </button>
                      <button
                        onClick={() => {
                          setShowFeedbackForm(true);
                        }}
                        className="flex items-center px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        No, I have an issue
                      </button>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {feedbackSubmitted && (
                  <div className="mt-8 text-center bg-green-50 p-6 rounded-xl border border-green-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-green-900 mb-2">Thank You for Your Feedback!</h3>
                    <p className="text-green-700">
                      We're glad our fact-checking service helped you verify the information accurately.
                      Together, we're making the internet a more trustworthy place!
                    </p>
                  </div>
                )}

                {/* Feedback Form */}
                {showFeedbackForm && !querySubmitted && (
                  <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Please describe the issue you faced</h3>
                    <div className="space-y-4">
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="What problems did you encounter with the result?"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        rows="4"
                      />
                      <div className="flex items-center space-x-2">
                        <label className="block">
                          <span className="sr-only">Choose file</span>
                          <input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100
                              cursor-pointer
                            "
                          />
                        </label>
                      </div>
                      <button
                        onClick={() => {
                          setQuerySubmitted(true);
                          setShowFeedbackForm(false);
                        }}
                        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <span className="mr-2">Send Feedback</span>
                        <span role="img" aria-label="send">📨</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Query Submitted Message */}
                {querySubmitted && (
                  <div className="mt-8 text-center bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span role="img" aria-label="received" className="text-2xl">📬</span>
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">We've Received Your Query</h3>
                    <p className="text-blue-700">
                      We apologize for any inconvenience. Our team will review your feedback and get back to you soon.
                      Thank you for helping us improve our fact-checking service!
                    </p>
                  </div>
                )}

                <div className="mt-12 space-y-4">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFeedbackSubmitted(false);
                      setShowFeedbackForm(false);
                      setQuerySubmitted(false);
                      setFeedbackText('');
                      setSelectedFile(null);
                    }}
                    className="w-full bg-gray-100 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 font-bold transform hover:scale-105"
                  >
                    Try Another Score
                  </button>
                  <Link
                    to="/submit"
                    className="block w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 text-center font-bold transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Submit Another Claim
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrustScoreResult; 