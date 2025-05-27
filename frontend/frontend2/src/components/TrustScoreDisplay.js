import React, { useEffect, useState } from 'react';

const TrustScoreDisplay = ({ score }) => {
  const [color, setColor] = useState('');
  const [circumference, setCircumference] = useState(0);
  const [offset, setOffset] = useState(0);
  const [gradientColors, setGradientColors] = useState(['#DC2626', '#DC2626']); // Start with red

  // Constants for the circle
  const radius = 100; // Increased size for better visibility
  const strokeWidth = 18; // Thicker ring
  const normalizedRadius = radius - strokeWidth / 2;
  
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

  const { text, emoji } = getMessage();

  return (
    <div className="flex flex-col items-center justify-center p-8">
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
          className="text-lg font-medium px-6 py-2 rounded-full"
          style={{ 
            background: `linear-gradient(135deg, ${gradientColors[0]}15, ${gradientColors[1]}15)`,
            color: gradientColors[1]
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default TrustScoreDisplay; 