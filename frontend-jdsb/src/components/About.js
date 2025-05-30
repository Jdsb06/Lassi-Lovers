import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';
import Header from './Header';
import Footer from './Footer';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
      <Header />
      
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
              About FactCheck
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              In an era where misinformation spreads faster than the truth, we believe facts should be louder than fiction.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                FactCheck is a fact-checking platform designed to evaluate public claims and provide clarity through credible, 
                transparent, and evidence-backed verification. Our mission is to empower people with the truth by checking 
                statements, viral posts, or any circulating claims against trusted, verifiable sources — and scoring them 
                on a 0 to 100 credibility scale.
              </p>
            </div>
          </div>

          {/* Our Process */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
                Our Process
              </h2>
              <p className="text-gray-700 mb-6 text-lg">Each claim is:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: '🔍', text: 'Carefully analyzed for context and accuracy' },
                  { icon: '📚', text: 'Cross-referenced with trusted media outlets, academic sources, and official data' },
                  { icon: '⭐', text: 'Scored based on how strongly it\'s supported by reliable information' },
                  { icon: '🔗', text: 'Linked to original sources so you can verify for yourself' }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-red-50 
                      transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="text-3xl mr-4 animate-bounce">{item.icon}</span>
                    <span className="text-gray-700 text-lg">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                Whether it's political statements, social media trends, or viral misinformation, we provide a simple, 
                transparent, and research-driven view of what's true and what's not — all in one place.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
              Meet the Team
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              This platform is built by a team of passionate developers and truth-seekers
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Jashandeep Singh',
                  role: 'Backend Architect',
                  image: '/images/jashandeep.jpeg',
                  initials: 'JS',
                  linkedin: 'https://www.linkedin.com/in/jdsb06/'
                },
                {
                  name: 'Kanav Kumar',
                  role: 'UI/UX Designer',
                  image: '/images/kanav.jpeg',
                  initials: 'KK',
                  linkedin: 'https://www.linkedin.com/in/kanav-kumar-b655962b5/'
                },
                {
                  name: 'Ayush Patel',
                  role: 'Integration Architect',
                  image: '/images/ayush.jpeg',
                  initials: 'AP',
                  linkedin: 'https://www.linkedin.com/in/ayush-patel-72a037316/'
                }
              ].map((member, index) => (
                <a
                  key={index}
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative transform transition-all duration-300 hover:scale-[1.05]"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-white rounded-lg p-6">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden relative transform transition-transform duration-500 group-hover:rotate-[360deg]">
                      <img 
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-r from-blue-100 to-red-100 rounded-full flex items-center justify-center absolute top-0 left-0 hidden">
                        <span className="text-4xl bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">
                          {member.initials}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent text-center mb-2">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 text-center">{member.role}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Why It Matters */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-gradient-to-r from-blue-900 to-red-600 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Why It Matters</h2>
              <p className="text-white text-lg leading-relaxed">
                In a digital world overflowing with opinions, algorithms, and half-truths, facts matter more than ever. 
                With FactCheck, we're building a future where anyone can get clear, unbiased, and reliable answers—backed 
                by sources you can trust.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
