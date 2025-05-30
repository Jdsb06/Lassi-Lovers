import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';
import Header from './Header';
import Footer from './Footer';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
      <Header />
      
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
              Browse Claims
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Explore fact-checked claims from our AI-powered verification system
            </p>
          </div>

          {/* Search and Filter */}
          <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <label className="block text-lg font-semibold mb-2 bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">
                    Search Claims
                  </label>
                  <input
                    type="text"
                    placeholder="Search for claims..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2 bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">
                    Filter by Verdict
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-300"
                  >
                    <option value="all">All Claims</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                    <option value="neutral">Uncertain</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Claims List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-16 h-16 relative">
                <svg className="animate-spin w-16 h-16 text-blue-900" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
          ) : error ? (
            <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-8">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-900 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-red-50 rounded-lg p-6 text-red-700">
                Error: {error}. Please try again later.
              </div>
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="group relative transform transition-all duration-300 hover:scale-[1.02] mb-8">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600">No claims found matching your search criteria.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredClaims.map((claim) => (
                <div 
                  key={claim.id} 
                  className="group relative transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-white rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">
                        {claim.text}
                      </h3>
                      <span className={`px-4 py-1 rounded-full text-sm font-medium transform transition-transform duration-300 hover:scale-110 ${getVerdictClass(claim.verdict)}`}>
                        {getVerdictText(claim.verdict)}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{claim.explanation}</p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Confidence:</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-900 to-red-600 transition-all duration-500"
                            style={{ width: `${claim.score}%` }}
                          ></div>
                        </div>
                        <span>{claim.score}%</span>
                      </div>
                      <div>
                        <span className="font-medium">Verified:</span> {new Date(claim.timestamp).toLocaleDateString()}
                      </div>
                    </div>

                    {claim.sources && claim.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-medium bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-2">
                          Sources:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {claim.sources.map((source, idx) => (
                            <li key={idx}>
                              <a 
                                href={source.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-900 hover:text-red-600 transition-colors duration-300"
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
      </main>

      <Footer />
    </div>
  );
};

export default BrowseClaimsPage;
