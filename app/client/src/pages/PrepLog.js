import React from 'react';
import { FaBook } from 'react-icons/fa';

const PrepLog = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Interview Prep Log</h1>
      </div>
      
      {/* Coming Soon Message */}
      <div className="card p-8 text-center">
        <FaBook className="text-secondary-500 text-5xl mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Prep Log Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          Track your interview preparation activities including DSA practice,
          system design, mock interviews, and Leetcode problems. Rate your performance
          and see your progress over time.
        </p>
        <div className="flex justify-center">
          <button className="btn btn-primary">Get Notified When Ready</button>
        </div>
      </div>
    </div>
  );
};

export default PrepLog;
