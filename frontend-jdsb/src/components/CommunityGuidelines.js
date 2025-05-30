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
    <div className="min-h-screen bg-white">
      <Header />
      {/* Add padding top to account for fixed header */}
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Community Guidelines</h1>
          <div className="bg-white shadow-lg rounded-lg p-8">
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

      {/* Add Footer */}
      <Footer />
    </div>
  );
};

export default CommunityGuidelines;
