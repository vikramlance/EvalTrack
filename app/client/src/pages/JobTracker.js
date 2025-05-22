import React from 'react';
import { FaBriefcase } from 'react-icons/fa';

const JobTracker = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
      </div>
      
      {/* Coming Soon Message */}
      <div className="card p-8 text-center">
        <FaBriefcase className="text-primary-500 text-5xl mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Job Tracker Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          Track your job applications, interviews, and offers in a Kanban-style board.
          Move applications through different stages and keep notes on each opportunity.
        </p>
        <div className="flex justify-center">
          <button className="btn btn-primary">Get Notified When Ready</button>
        </div>
      </div>
    </div>
  );
};

export default JobTracker;
