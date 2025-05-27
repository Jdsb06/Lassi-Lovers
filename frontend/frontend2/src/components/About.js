import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 pt-24">
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
              <div className="bg-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition-transform">
                <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl text-blue-900">JS</span>
                </div>
                <h3 className="text-xl font-semibold text-blue-900 text-center">Jashadeep Singh Bedi</h3>
                <p className="text-gray-600 text-center">Lead Developer</p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition-transform">
                <div className="w-32 h-32 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl text-red-600">KK</span>
                </div>
                <h3 className="text-xl font-semibold text-blue-900 text-center">Kanav Kumar</h3>
                <p className="text-gray-600 text-center">Backend Architect</p>
              </div>

              {/* Team Member 3 */}
              <div className="bg-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition-transform">
                <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl text-blue-900">AP</span>
                </div>
                <h3 className="text-xl font-semibold text-blue-900 text-center">Ayush Patel</h3>
                <p className="text-gray-600 text-center">UI/UX Designer</p>
              </div>
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
  );
};

export default About; 