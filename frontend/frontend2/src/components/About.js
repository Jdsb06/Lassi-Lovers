import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">About Us</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            In an era where misinformation spreads faster than the truth, we believe facts should be louder than fiction.
          </p>

          <p className="text-gray-700 mb-6">
            FactCheck is a fact-checking platform designed to evaluate public claims and provide clarity through credible, 
            transparent, and evidence-backed verification. Our mission is to empower people with the truth by checking 
            statements, viral posts, or any circulating claims against trusted, verifiable sources — and scoring them 
            on a 0 to 100 credibility scale.
          </p>

          <h2 className="text-2xl font-bold text-blue-900 mt-12 mb-6">Our Process</h2>
          <p className="text-gray-700 mb-4">Each claim is:</p>
          <ul className="list-disc pl-6 mb-8 text-gray-700 space-y-2">
            <li>Carefully analyzed for context and accuracy</li>
            <li>Cross-referenced with trusted media outlets, academic sources, and official data</li>
            <li>Scored based on how strongly it's supported by reliable information</li>
            <li>Linked to original sources so you can verify for yourself</li>
          </ul>

          <p className="text-gray-700 mb-8">
            Whether it's political statements, social media trends, or viral misinformation, we provide a simple, 
            transparent, and research-driven view of what's true and what's not — all in one place.
          </p>

          <h2 className="text-2xl font-bold text-blue-900 mt-12 mb-6">Meet the Team</h2>
          <p className="text-gray-700 mb-4">This platform is built by a team of passionate developers and truth-seekers:</p>
          
          <div className="grid md:grid-cols-3 gap-8 my-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl text-blue-900">JS</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900">Jashadeep Singh Bedi</h3>
              <p className="text-gray-600">Lead Developer</p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl text-red-600">KK</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900">Kanav Kumar</h3>
              <p className="text-gray-600">Backend Architect</p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl text-green-600">AP</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900">Ayush Patel</h3>
              <p className="text-gray-600">UI/UX Designer</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-blue-900 mt-12 mb-6">Why It Matters</h2>
          <p className="text-gray-700 mb-8">
            In a digital world overflowing with opinions, algorithms, and half-truths, facts matter more than ever. 
            With FactCheck, we're building a future where anyone can get clear, unbiased, and reliable answers—backed 
            by sources you can trust.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About; 