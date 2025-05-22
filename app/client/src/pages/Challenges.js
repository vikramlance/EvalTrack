import React from 'react';
import { FaTrophy } from 'react-icons/fa';

const Challenges = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>
      </div>
      
      {/* Coming Soon Message */}
      <div className="card p-8 text-center">
        <FaTrophy className="text-yellow-500 text-5xl mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Challenges Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          Create and track time-bound challenges to boost your productivity.
          Set goals, track progress, and earn achievements as you complete challenges.
        </p>
        <div className="flex justify-center">
          <button className="btn btn-primary">Get Notified When Ready</button>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
