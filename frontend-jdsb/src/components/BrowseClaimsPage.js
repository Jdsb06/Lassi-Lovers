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
    <div className="min-h-screen bg-white">
      <Header />
      {/* Add padding top to account for fixed header */}
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Browse Claims</h1>
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
      </div>

      {/* Add Footer */}
      <Footer />
    </div>
  );
};

export default BrowseClaimsPage;
