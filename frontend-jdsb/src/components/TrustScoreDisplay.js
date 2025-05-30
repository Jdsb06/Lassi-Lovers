import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthButton from './AuthButton';

const TrustScoreDisplay = () => {
  const navigate = useNavigate();
  const [color, setColor] = useState('');
  const [circumference, setCircumference] = useState(0);
  const [offset, setOffset] = useState(0);
  const [gradientColors, setGradientColors] = useState(['#DC2626', '#DC2626']); // Start with red
  const [claimResult, setClaimResult] = useState(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // Constants for the circle
  const radius = 100; // Increased size for better visibility
  const strokeWidth = 18; // Thicker ring
  const normalizedRadius = radius - strokeWidth / 2;
  
  useEffect(() => {
    // Get the claim result from localStorage
    const storedResult = localStorage.getItem('claimResult');
    if (!storedResult) {
      setError('No claim found. Please submit a claim first.');
      setIsLoading(false);
      return;
    }

    try {
      const result = JSON.parse(storedResult);
      setClaimResult(result.result || result); // Handle both new and old response format
      
      // Use the score from the result, falling back through multiple possible fields
      const finalScore = result.result?.score ?? result.score ?? 50;
      setScore(finalScore);
      
      setIsLoading(false);
    } catch (e) {
      setError('Error loading results. Please try again.');
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Calculate circle properties
    const c = 2 * Math.PI * normalizedRadius;
    setCircumference(c);
    
    // Calculate offset based on score
    const calculatedOffset = ((100 - score) / 100) * c;
    setOffset(calculatedOffset);
    
    // Set gradient colors based on score
    if (score <= 33) {
      setGradientColors(['#DC2626', '#DC2626']); // Red
      setColor('#DC2626');
    } else if (score <= 66) {
      setGradientColors(['#FBBF24', '#D97706']); // Yellow to Orange
      setColor('#D97706');
    } else {
      setGradientColors(['#34D399', '#059669']); // Green
      setColor('#059669');
    }
  }, [score, normalizedRadius]);

  const getMessage = () => {
    if (score <= 33) {
      return {
        text: "Low Trust Score - Exercise Caution",
        emoji: "⚠️"
      };
    } else if (score <= 66) {
      return {
        text: "Moderate Trust Score - Some Verification Needed",
        emoji: "🤔"
      };
    } else {
      return {
        text: "High Trust Score - Generally Reliable",
        emoji: "✅"
      };
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-2xl">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg text-red-700">{error}</p>
              <button 
                onClick={() => navigate('/submit')} 
                className="mt-2 text-red-600 hover:text-red-800 font-medium"
              >
                Return to Submit Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!claimResult) {
    return null;
  }

  const { text, emoji } = getMessage();

  const handleFeedback = (type) => {
    if (type === 'positive') {
      setFeedbackType(type);
      setFeedbackSubmitted(true);
    } else {
      setFeedbackType(type);
      setShowFeedbackForm(true);
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedbackText.trim()) {
      setFeedbackSubmitted(true);
      setShowFeedbackForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back to Home Button */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link
                to="/browse"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Browse Claims
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                About
              </Link>
              <AuthButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Add top padding to account for fixed header */}
      <div className="max-w-4xl mx-auto px-4 py-12 pt-24">
        {/* Trust Score Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Fact Check Results</h2>
          <p className="text-gray-600">Our AI-powered analysis evaluates claims using multiple trusted sources</p>
        </div>

        {/* Trust Score Wheel with Info Cards */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Info Card */}
            <div className="bg-blue-50/50 backdrop-blur-sm rounded-xl p-4 border border-blue-100 flex flex-col justify-center items-center">
              <div className="text-blue-600 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
            </div>

            {/* Center Trust Score Wheel */}
            <div className="relative flex flex-col items-center">
              <div className="relative">
                <svg
                  height={radius * 2}
                  width={radius * 2}
                  className="transform -rotate-90"
                >
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={gradientColors[0]} />
                      <stop offset="100%" stopColor={gradientColors[1]} />
                    </linearGradient>
                  </defs>
                  <circle
                    stroke="#e6e6e6"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                  <circle
                    stroke="url(#scoreGradient)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset: offset }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold" style={{ color }}>
                    {score}%
                  </div>
                  <div className="text-2xl mt-1">{emoji}</div>
                </div>
              </div>
              <div className="text-center mt-4">
                <span className="text-gray-700 font-medium">{text}</span>
              </div>
            </div>

            {/* Right Info Card */}
            <div className="bg-red-50/50 backdrop-blur-sm rounded-xl p-4 border border-red-100 flex flex-col justify-center items-center">
              <div className="text-red-600 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Evidence Based</h3>
              <p className="text-sm text-gray-600 text-center">Verified against trusted sources</p>
            </div>
          </div>
        </div>

        {/* Analysis and Evidence Section */}
        <div className="space-y-8">
          {/* Gemini Analysis */}
          <div className="bg-blue-50/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Analysis</h3>
            <p className="text-lg font-semibold text-gray-700 mb-6">Model Score: {score}%</p>
            <div className="prose max-w-none">
              {claimResult.explanation && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-blue-900">AI Analysis:</h4>
                  <p className="text-gray-700 leading-relaxed">{claimResult.explanation}</p>
                </div>
              )}
              {/* Commenting out GPT Analysis section since the API is not working
              {claimResult.gpt_explanation && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-blue-900">GPT Analysis:</h4>
                  <p className="text-gray-700 leading-relaxed">{claimResult.gpt_explanation}</p>
                </div>
              )}
              */}
            </div>
          </div>

          {/* Evidence Sources */}
          <div className="bg-red-50/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-red-100">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Evidence Sources</h3>
            <div className="space-y-4">
              {claimResult?.evidence?.map((source, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 hover:bg-white transition-colors border border-red-50">
                  <a
                    href={source.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-red-600 hover:underline break-all">{source.title || source.link}</span>
                      <p className="text-sm text-gray-500 mt-1">{source.snippet}</p>
                    </div>
                  </a>
                </div>
              ))}
              {(!claimResult?.evidence || claimResult.evidence.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  No evidence sources found for this claim.
                </div>
              )}
            </div>
          </div>

          {/* Submit New Claim Section */}
          <div className="text-center py-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Have Another Claim to Verify?</h3>
            <p className="text-gray-600 mb-6">Submit your claim and get instant AI-powered fact-checking results</p>
            <Link
              to="/submit"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Submit a New Claim</span>
            </Link>
          </div>

          {/* Feedback Section */}
          {!feedbackSubmitted ? (
            <div className="bg-blue-50/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100">
              {!showFeedbackForm ? (
                <>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Was this analysis helpful?</h3>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => handleFeedback('positive')}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Yes, it helped!</span>
                    </button>
                    <button
                      onClick={() => handleFeedback('negative')}
                      className="flex items-center space-x-2 px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>No, I need more help</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setShowFeedbackForm(false)}
                      className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900">Please describe your issue</h3>
                  </div>
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="What problems did you encounter with the analysis? How can we improve?"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                        rows="4"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                        <span>Submit Feedback</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-blue-50/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100">
              {feedbackType === 'positive' ? (
                <div className="text-center">
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
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">We've Received Your Feedback</h3>
                  <div className="max-w-lg mx-auto">
                    <p className="text-blue-700 mb-4">
                      Thank you for letting us know about your concerns. Our team will review your feedback:
                    </p>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-left border border-blue-100">
                      <p className="text-gray-700 italic">"{feedbackText}"</p>
                    </div>
                    <p className="text-blue-700 mt-4">
                      We'll get back to you soon with more detailed information.
                      Thank you for helping us improve our service!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrustScoreDisplay; 