import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-3 group mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center relative transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg flex items-center justify-center transform -rotate-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full transform rotate-12"></div>
              </div>
              <div className="transform transition-all duration-300 group-hover:scale-105">
                <h1 className="text-2xl font-bold text-white">FactCheck</h1>
                <p className="text-xs font-bold tracking-wider text-red-600 -mt-1">NO MISINFO</p>
              </div>
            </div>
            <p className="text-gray-400 font-light leading-relaxed">
              Fighting misinformation with AI-powered fact-checking.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
            <ul className="space-y-4 font-light">
              <li>
                <Link to="/" className="text-gray-400 hover:bg-gradient-to-r hover:from-blue-900 hover:to-red-600 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-gray-400 hover:bg-gradient-to-r hover:from-blue-900 hover:to-red-600 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                  Submit Claim
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-400 hover:bg-gradient-to-r hover:from-blue-900 hover:to-red-600 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                  Browse Claims
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:bg-gradient-to-r hover:from-blue-900 hover:to-red-600 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-400 hover:bg-gradient-to-r hover:from-blue-900 hover:to-red-600 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Legal</h4>
            <ul className="space-y-4 font-light">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:bg-gradient-to-r hover:from-blue-900 hover:to-red-600 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:bg-gradient-to-r hover:from-blue-900 hover:to-red-600 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-gray-400 hover:bg-gradient-to-r hover:from-blue-900 hover:to-red-600 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Connect</h4>
            <div className="flex space-x-4 [perspective:1000px]">
              <a href="/" 
                className="w-10 h-10 bg-gradient-to-br from-blue-900 to-red-600 rounded-lg flex items-center justify-center transition-transform duration-700 hover:shadow-lg hover:from-blue-800 hover:to-red-700 [transform-style:preserve-3d] hover:[transform:rotateY(360deg)]"
              >
                <span className="text-sm font-bold [backface-visibility:hidden]">f</span>
              </a>
              <a href="/" 
                className="w-10 h-10 bg-gradient-to-br from-blue-900 to-red-600 rounded-lg flex items-center justify-center transition-transform duration-700 hover:shadow-lg hover:from-blue-800 hover:to-red-700 [transform-style:preserve-3d] hover:[transform:rotateY(360deg)]"
              >
                <span className="text-sm font-bold [backface-visibility:hidden]">t</span>
              </a>
              <a href="/" 
                className="w-10 h-10 bg-gradient-to-br from-blue-900 to-red-600 rounded-lg flex items-center justify-center transition-transform duration-700 hover:shadow-lg hover:from-blue-800 hover:to-red-700 [transform-style:preserve-3d] hover:[transform:rotateY(360deg)]"
              >
                <span className="text-sm font-bold [backface-visibility:hidden]">in</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 font-light">
            © {new Date().getFullYear()} FactCheck - No Misinfo. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 