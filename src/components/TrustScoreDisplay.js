import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrustScoreDisplay = () => {
  const navigate = useNavigate();
  const [color, setColor] = useState('');
  const [circumference, setCircumference] = useState(0);
  const [offset, setOffset] = useState(0);
  const [gradientColors, setGradientColors] = useState(['#DC2626', '#DC2626']); // Start with red
  const [claimResult, setClaimResult] = useState(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Constants for the circle
  const radius = 100; // Increased size for better visibility
  const strokeWidth = 18; // Thicker ring
  const normalizedRadius = radius - strokeWidth / 2;
  
  useEffect(() => {
    // Get the claim result from localStorage
    const storedResult = localStorage.getItem('claimResult');
    if (!storedResult) {
      setError('No claim found. Please submit a claim first.');
      setIsLoading(false);
      return;
    }

    try {
      const result = JSON.parse(storedResult);
      setClaimResult(result);
      // Use the score from the result, defaulting to the gemini score if gpt_score is not available
      setScore(result.gpt_score || result.score || 0);
      setIsLoading(false);
    } catch (e) {
      setError('Error loading results. Please try again.');
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Calculate the circumference
    const circ = normalizedRadius * 2 * Math.PI;
    setCircumference(circ);
    
    // Calculate the offset (this creates the progress effect)
    const offsetValue = circ - (score / 100) * circ;
    setOffset(offsetValue);
    
    // Enhanced color transitions based on score
    if (score <= 20) {
      setColor('#DC2626'); // Dark red
      setGradientColors(['#DC2626', '#EF4444']); // Red gradient
    } else if (score <= 40) {
      setColor('#EA580C'); // Orange
      setGradientColors(['#DC2626', '#EA580C']); // Red to orange
    } else if (score <= 60) {
      setColor('#EAB308'); // Yellow
      setGradientColors(['#EA580C', '#EAB308']); // Orange to yellow
    } else if (score <= 80) {
      setColor('#65A30D'); // Light green
      setGradientColors(['#EAB308', '#65A30D']); // Yellow to light green
    } else {
      setColor('#166534'); // Dark green
      setGradientColors(['#65A30D', '#166534']); // Light green to dark green
    }
  }, [score]);

  // Get message and emoji based on score
  const getMessage = () => {
    if (score <= 20) return { text: "Highly Unreliable", emoji: "⚠️" };
    if (score <= 40) return { text: "Questionable", emoji: "❗" };
    if (score <= 60) return { text: "Mixed Evidence", emoji: "🤔" };
    if (score <= 80) return { text: "Mostly Reliable", emoji: "👍" };
    return { text: "Highly Reliable", emoji: "✅" };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Analyzing claim...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-2xl">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg text-red-700">{error}</p>
              <button 
                onClick={() => navigate('/submit')} 
                className="mt-2 text-red-600 hover:text-red-800 font-medium"
              >
                Return to Submit Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!claimResult) {
    return null;
  }

  const { text, emoji } = getMessage();

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Original claim */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Analyzed Claim</h2>
        <p className="text-lg text-gray-700">{claimResult.claim}</p>
      </div>

      <div className="relative">
        {/* Glowing background effect */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-20"
          style={{ 
            background: `radial-gradient(circle, ${gradientColors[1]}, transparent)`,
            transform: 'scale(1.2)'
          }}
        />
        
        {/* Main circle */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 relative z-10"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[0]} />
              <stop offset="100%" stopColor={gradientColors[1]} />
            </linearGradient>
          </defs>
          
          {/* Background circle with subtle gradient */}
          <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="opacity-20"
          />
          
          {/* Animated foreground circle */}
          <circle
            stroke="url(#circleGradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset: offset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-in-out drop-shadow-xl"
          />
        </svg>
        
        {/* Score display in the middle */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r"
            style={{ 
              backgroundImage: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})` 
            }}
          >
            {score}
          </span>
          <span className="text-2xl mt-1">{emoji}</span>
        </div>
      </div>
      
      {/* Score label with enhanced styling */}
      <div className="mt-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Trust Score</h3>
        <div 
          className="text-lg font-medium px-6 py-2 rounded-full mb-6"
          style={{ 
            background: `linear-gradient(135deg, ${gradientColors[0]}15, ${gradientColors[1]}15)`,
            color: gradientColors[1]
          }}
        >
          {text}
        </div>

        {/* Analysis Summary */}
        <div className="mt-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Analysis Summary</h3>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {claimResult.explanation && (
              <div className="mb-4">
                <h4 className="font-bold mb-2">Gemini Analysis:</h4>
                <p className="text-gray-700">{claimResult.explanation}</p>
              </div>
            )}
            {claimResult.gpt_explanation && (
              <div className="mb-4">
                <h4 className="font-bold mb-2">GPT Analysis:</h4>
                <p className="text-gray-700">{claimResult.gpt_explanation}</p>
              </div>
            )}
            {claimResult.sources && claimResult.sources.length > 0 && (
              <div>
                <h4 className="font-bold mb-2">Sources:</h4>
                <ul className="list-disc list-inside">
                  {claimResult.sources.map((source, index) => (
                    <li key={index} className="text-blue-600 hover:underline">
                      <a href={source} target="_blank" rel="noopener noreferrer">{source}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustScoreDisplay; 