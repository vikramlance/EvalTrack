import React from 'react';
import { FaTrophy, FaClock } from 'react-icons/fa';

const ChallengeCard = ({ challenge }) => {
  // Calculate days remaining
  const today = new Date();
  const endDate = new Date(challenge.endDate);
  const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
  
  // Calculate progress percentage
  const progressPercentage = (challenge.current / challenge.target) * 100;
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <FaTrophy className="text-yellow-500 mr-2" />
          <h3 className="font-medium">{challenge.name}</h3>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <FaClock className="mr-1" />
          <span>{daysRemaining} days left</span>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between mb-1 text-sm">
          <span className="font-medium">{challenge.current} / {challenge.target}</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <button className="btn btn-outline text-sm py-1">View Details</button>
        <button className="btn btn-primary text-sm py-1">Log Progress</button>
      </div>
    </div>
  );
};

export default ChallengeCard;
