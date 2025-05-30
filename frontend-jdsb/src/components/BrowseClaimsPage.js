import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';

const BrowseClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch claims data from the server
    const fetchClaims = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/claims');
        if (!response.ok) {
          throw new Error('Failed to fetch claims');
        }
        const data = await response.json();
        setClaims(data.claims);
        setFilteredClaims(data.claims);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching claims:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // Filter claims based on search term and category
  useEffect(() => {
    if (claims.length > 0) {
      const filtered = claims.filter(claim => {
        const matchesSearch = claim.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             claim.explanation.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'all' ||
                              (filterCategory === 'true' && claim.verdict === 'true') ||
                              (filterCategory === 'false' && claim.verdict === 'false') ||
                              (filterCategory === 'neutral' && claim.verdict === 'neutral');

        return matchesSearch && matchesCategory;
      });

      setFilteredClaims(filtered);
    }
  }, [searchTerm, filterCategory, claims]);

  // Get verdict class for color coding
  const getVerdictClass = (verdict) => {
    switch (verdict) {
      case 'true':
        return 'bg-green-100 text-green-800';
      case 'false':
        return 'bg-red-100 text-red-800';
      case 'neutral':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Get verdict text for display
  const getVerdictText = (verdict) => {
    switch (verdict) {
      case 'true':
        return 'True';
      case 'false':
        return 'False';
      case 'neutral':
      default:
        return 'Uncertain';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center relative">
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-900 transition-colors">Home</Link>
              <Link to="/submit" className="text-gray-700 hover:text-blue-900 transition-colors">Submit a Claim</Link>
              <Link to="/browse" className="text-blue-900 font-semibold border-b-2 border-red-600">Browse Claims</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-900 transition-colors">About</Link>
              <Link to="/faqs" className="text-gray-700 hover:text-blue-900 transition-colors">FAQ/Help</Link>
              <AuthButton />
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
            <div className="md:hidden bg-white border-t">
              <div className="px-4 py-3 space-y-3">
                <Link to="/" className="block text-gray-700">Home</Link>
                <Link to="/submit" className="block text-gray-700">Submit a Claim</Link>
                <Link to="/browse" className="block text-blue-900 font-semibold">Browse Claims</Link>
                <Link to="/about" className="block text-gray-700">About</Link>
                <Link to="/faqs" className="block text-gray-700">FAQ/Help</Link>
                <div className="mt-2">
                  <AuthButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Browse Claims</h1>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Claims
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search for claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Verdict
              </label>
              <select
                id="filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              >
                <option value="all">All Claims</option>
                <option value="true">True</option>
                <option value="false">False</option>
                <option value="neutral">Uncertain</option>
              </select>
            </div>
          </div>
        </div>

        {/* Claims List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-8">
            Error: {error}. Please try again later.
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-600">No claims found matching your search criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredClaims.map((claim) => (
              <div key={claim.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-blue-900">{claim.text}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVerdictClass(claim.verdict)}`}>
                      {getVerdictText(claim.verdict)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{claim.explanation}</p>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Confidence Score:</span> {claim.score}%
                    </div>
                    <div>
                      <span className="font-medium">Verified on:</span> {new Date(claim.timestamp).toLocaleDateString()}
                    </div>
                  </div>

                  {claim.sources && claim.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-2">Sources:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {claim.sources.map((source, idx) => (
                          <li key={idx}>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-red-600 hover:underline"
                            >
                              {source.name || source.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center relative">
                  <div className="w-5 h-5 bg-blue-900 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold">FactCheck</h3>
                  <p className="text-xs text-red-400">NO MISINFO</p>
                </div>
              </div>
              <p className="text-gray-400">
                Fighting misinformation with AI-powered fact-checking and community collaboration.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/submit" className="hover:text-white transition-colors">Submit Claim</Link></li>
                <li><Link to="/browse" className="hover:text-white transition-colors">Browse Claims</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/faqs" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/guidelines" className="hover:text-white transition-colors">Community Guidelines</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="/" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <span className="text-sm font-bold">f</span>
                </a>
                <a href="/" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <span className="text-sm font-bold">t</span>
                </a>
                <a href="/" className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                  <span className="text-sm font-bold">in</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} FactCheck - No Misinfo. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BrowseClaimsPage;
