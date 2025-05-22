import React from 'react';

const ProgressRing = ({ progress, size = 100, strokeWidth = 8, textSize = 20, color = '#0ea5e9' }) => {
  // Calculate the radius
  const radius = (size - strokeWidth) / 2;
  
  // Calculate the circumference
  const circumference = radius * 2 * Math.PI;
  
  // Calculate the dash offset based on progress
  const dashOffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-gray-200"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Circle */}
        <circle
          className="text-primary-500"
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {/* Percentage Text */}
      <div 
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{ fontSize: `${textSize}px` }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default ProgressRing;
