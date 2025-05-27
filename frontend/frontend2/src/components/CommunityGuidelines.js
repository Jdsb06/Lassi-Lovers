import React from 'react';
import { Link } from 'react-router-dom';

const CommunityGuidelines = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back to Home Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-400 mb-4">Community Guidelines</h1>
          <div className="text-xl text-gray-400 space-y-2">
            <p>At FactCheck.com, our mission is to promote truth, transparency, and respectful dialogue.</p>
            <p>To maintain a safe and trustworthy environment, we ask all users to follow these community guidelines.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12 text-gray-300">
          {/* What's Encouraged Section */}
          <div className="bg-gray-800 rounded-xl p-8 shadow-2xl transform hover:scale-[1.02] transition-transform">
            <h2 className="text-3xl font-bold text-green-400 mb-6 flex items-center">
              <span className="text-4xl mr-3">✨</span> What's Encouraged
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🤝</span>
                <div>
                  <h3 className="font-semibold text-green-300">Respectful Discussion</h3>
                  <p>Engage in constructive conversations, even when you disagree. Treat everyone with courtesy.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔍</span>
                <div>
                  <h3 className="font-semibold text-green-300">Truth-Seeking</h3>
                  <p>Share information that is backed by credible sources. Fact-based input is always welcome.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🌟</span>
                <div>
                  <h3 className="font-semibold text-green-300">Transparency</h3>
                  <p>When providing feedback or submitting claims, be clear and honest about context and sources.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">💝</span>
                <div>
                  <h3 className="font-semibold text-green-300">Civility First</h3>
                  <p>Use polite and inclusive language. Everyone deserves to feel safe and heard here.</p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Not Allowed Section */}
          <div className="bg-gray-800 rounded-xl p-8 shadow-2xl transform hover:scale-[1.02] transition-transform">
            <h2 className="text-3xl font-bold text-red-400 mb-6 flex items-center">
              <span className="text-4xl mr-3">⛔</span> What's Not Allowed
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🚫</span>
                <div>
                  <h3 className="font-semibold text-red-300">Hate Speech or Discrimination</h3>
                  <p>Any language that targets people based on race, gender, religion, nationality, sexual orientation, or disability will not be tolerated.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">❌</span>
                <div>
                  <h3 className="font-semibold text-red-300">Misinformation</h3>
                  <p>Do not knowingly spread false or misleading information.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <h3 className="font-semibold text-red-300">Harassment or Threats</h3>
                  <p>Bullying, intimidation, or targeting individuals is strictly prohibited.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🚯</span>
                <div>
                  <h3 className="font-semibold text-red-300">Spam or Self-Promotion</h3>
                  <p>Irrelevant links, repetitive comments, and promotional content are not allowed.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">📝</span>
                <div>
                  <h3 className="font-semibold text-red-300">Plagiarism</h3>
                  <p>Do not copy or present others' work as your own without proper credit.</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Submissions Section */}
          <div className="bg-gray-800 rounded-xl p-8 shadow-2xl transform hover:scale-[1.02] transition-transform">
            <h2 className="text-3xl font-bold text-purple-400 mb-6 flex items-center">
              <span className="text-4xl mr-3">📮</span> User Submissions
            </h2>
            <p className="mb-4">If you submit claims or comments:</p>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📊</span>
                <p>Ensure they are fact-based or clearly labeled as opinion.</p>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔄</span>
                <p>Be open to discussion and correction.</p>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">⚖️</span>
                <p>Understand that your content may be moderated or removed if it violates these guidelines.</p>
              </div>
            </div>
          </div>

          {/* Moderation Policy Section */}
          <div className="bg-gray-800 rounded-xl p-8 shadow-2xl transform hover:scale-[1.02] transition-transform">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6 flex items-center">
              <span className="text-4xl mr-3">👮</span> Moderation Policy
            </h2>
            <p className="mb-4">Our team reserves the right to:</p>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🗑️</span>
                <p>Remove content that violates these guidelines</p>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🚷</span>
                <p>Suspend or ban repeat or severe offenders</p>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">📝</span>
                <p>Update these guidelines as the community evolves</p>
              </div>
            </div>
          </div>

          {/* Reporting Violations Section */}
          <div className="bg-gray-800 rounded-xl p-8 shadow-2xl transform hover:scale-[1.02] transition-transform">
            <h2 className="text-3xl font-bold text-blue-400 mb-6 flex items-center">
              <span className="text-4xl mr-3">🚨</span> Reporting Violations
            </h2>
            <p className="mb-4">If you see behavior that goes against these guidelines, please let us know.</p>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📧</span>
                <div>
                  <p>Contact us at:</p>
                  <a 
                    href="mailto:ayushpatel11m@gmail.com" 
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    ayushpatel11m@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Final Message */}
          <div className="text-center text-xl text-blue-400 py-8">
            <p>Together, let's build a community grounded in respect, curiosity, and integrity. 🌟</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines; 