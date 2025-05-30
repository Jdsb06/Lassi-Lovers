import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';

const Header = () => {
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center relative transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg flex items-center justify-center transform -rotate-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full transform rotate-12"></div>
            </div>
            <div className="transform transition-all duration-300 group-hover:scale-105">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">FactCheck</h1>
              <p className="text-xs font-bold tracking-wider text-red-600 -mt-1">NO MISINFO</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="px-4 py-2 font-semibold relative group"
            >
              <span className="relative z-10 transition-all duration-300 text-blue-900 group-hover:bg-gradient-to-r group-hover:from-blue-900 group-hover:to-red-600 group-hover:bg-clip-text group-hover:text-transparent">Home</span>
              <div className="absolute inset-0 h-1 w-full bg-gradient-to-r from-blue-900 to-red-600 bottom-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
            <Link 
              to="/submit" 
              className="px-4 py-2 font-semibold relative group"
            >
              <span className="relative z-10 transition-all duration-300 text-gray-700 group-hover:bg-gradient-to-r group-hover:from-blue-900 group-hover:to-red-600 group-hover:bg-clip-text group-hover:text-transparent">Submit a Claim</span>
              <div className="absolute inset-0 h-1 w-full bg-gradient-to-r from-blue-900 to-red-600 bottom-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
            <Link 
              to="/browse" 
              className="px-4 py-2 font-semibold relative group"
            >
              <span className="relative z-10 transition-all duration-300 text-gray-700 group-hover:bg-gradient-to-r group-hover:from-blue-900 group-hover:to-red-600 group-hover:bg-clip-text group-hover:text-transparent">Browse Claims</span>
              <div className="absolute inset-0 h-1 w-full bg-gradient-to-r from-blue-900 to-red-600 bottom-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-2 font-semibold relative group"
            >
              <span className="relative z-10 transition-all duration-300 text-gray-700 group-hover:bg-gradient-to-r group-hover:from-blue-900 group-hover:to-red-600 group-hover:bg-clip-text group-hover:text-transparent">About</span>
              <div className="absolute inset-0 h-1 w-full bg-gradient-to-r from-blue-900 to-red-600 bottom-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
            <Link 
              to="/faqs" 
              className="px-4 py-2 font-semibold relative group"
            >
              <span className="relative z-10 transition-all duration-300 text-gray-700 group-hover:bg-gradient-to-r group-hover:from-blue-900 group-hover:to-red-600 group-hover:bg-clip-text group-hover:text-transparent">FAQ/Help</span>
              <div className="absolute inset-0 h-1 w-full bg-gradient-to-r from-blue-900 to-red-600 bottom-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
            <div className="ml-8 transform transition-all duration-300 hover:scale-105">
              <AuthButton />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6 bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100">
            <div className="px-4 py-3 space-y-2">
              <Link to="/" className="block py-2 px-4 text-blue-900 font-semibold rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-900 hover:to-red-600 hover:bg-clip-text hover:text-transparent">Home</Link>
              <Link to="/submit" className="block py-2 px-4 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-900 hover:to-red-600 hover:bg-clip-text hover:text-transparent">Submit a Claim</Link>
              <Link to="/browse" className="block py-2 px-4 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-900 hover:to-red-600 hover:bg-clip-text hover:text-transparent">Browse Claims</Link>
              <Link to="/about" className="block py-2 px-4 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-900 hover:to-red-600 hover:bg-clip-text hover:text-transparent">About</Link>
              <Link to="/faqs" className="block py-2 px-4 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-900 hover:to-red-600 hover:bg-clip-text hover:text-transparent">FAQ/Help</Link>
              <div className="py-2 px-4">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 