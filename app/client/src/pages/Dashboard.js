import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { FaArrowUp, FaArrowDown, FaFire, FaCalendarAlt, FaBriefcase, FaUserTie, FaCheck, FaTimes, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Components
import ProgressRing from '../components/ProgressRing';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import ChallengeCard from '../components/ChallengeCard';

// Register ChartJS components
ChartJS.register(...registerables);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const { isAuthenticated, tokenExpirationMessage } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check if user is authenticated
        if (!isAuthenticated) {
          setAuthError('Authentication required');
          setLoading(false);
          return;
        }
        
        // User is authenticated, try to fetch data
        try {
          const response = await axios.get('/metrics/dashboard/summary');
          setDashboardData(response.data);
          setAuthError(null);
          setLoading(false);
        } catch (apiError) {
          console.error('API error:', apiError);
          
          // Check if it's an authentication error
          if (apiError.response && apiError.response.status === 401) {
            setAuthError('Your session has expired. Please log in again.');
          } else if (apiError.response && apiError.response.status === 403) {
            setAuthError('You do not have permission to access this resource.');
          } else {
            // For other API errors, show a general error message
            setError('Failed to load dashboard data. Please try again.');
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in dashboard data handling:', error);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  // Mock data for initial development
  const mockData = {
    metrics: [
      { id: '1', name: 'Applications Submitted', current: 42, target: 100, unit: 'applications' },
      { id: '2', name: 'Interview Prep Hours', current: 18, target: 30, unit: 'hours' },
      { id: '3', name: 'Networking Calls', current: 8, target: 15, unit: 'calls' }
    ],
    jobStats: {
      totalApplications: 42,
      interviews: 8,
      offers: 2,
      rejected: 12
    },
    challenges: [
      { id: '1', name: '30-Day Interview Sprint', current: 18, target: 30, endDate: '2025-06-15T00:00:00.000Z' },
      { id: '2', name: 'Leetcode Challenge', current: 25, target: 50, endDate: '2025-06-30T00:00:00.000Z' }
    ],
    recentPrep: [
      { id: '1', type: 'DSA', date: '2025-05-14T00:00:00.000Z', selfRating: 4 },
      { id: '2', type: 'MockInterview', date: '2025-05-12T00:00:00.000Z', selfRating: 3 }
    ],
    streak: {
      hasAppliedToday: true,
      hasAppliedYesterday: true
    }
  };

  // Use mock data for development if no real data is available
  const data = dashboardData || mockData;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Authentication error display
  if (authError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="text-warning-600 text-5xl mb-4">
            <FaLock className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-700 mb-4">{authError}</p>
          
          {tokenExpirationMessage && (
            <div className="bg-gray-100 p-3 rounded-md mb-4">
              <p className="text-sm text-gray-700">
                <FaExclamationTriangle className="inline-block mr-2 text-warning-500" />
                {tokenExpirationMessage}
              </p>
            </div>
          )}
          
          <div className="mt-6">
            <Link to="/login" className="btn btn-primary block w-full mb-2">Log In</Link>
            <Link to="/register" className="btn btn-outline block w-full">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-danger-600 text-5xl mb-4">
            <FaTimes className="mx-auto" />
          </div>
          <p className="text-gray-700">{error}</p>
          <button 
            className="mt-4 btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data for applications over time
  const applicationChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Applications',
        data: [10, 15, 8, 9],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3
      }
    ]
  };

  // Prepare chart data for job funnel
  const funnelChartData = {
    labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
    datasets: [
      {
        label: 'Job Funnel',
        data: [
          data.jobStats.totalApplications, 
          data.jobStats.interviews, 
          data.jobStats.offers, 
          data.jobStats.rejected
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-3 md:mt-0 flex items-center text-sm">
          <FaCalendarAlt className="mr-1 text-gray-500" />
          <span className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Streak Banner */}
      {data.streak.hasAppliedToday && (
        <div className="bg-success-100 border-l-4 border-success-500 text-success-700 p-4 rounded-md flex items-center">
          <FaFire className="text-success-600 mr-2 text-xl" />
          <div>
            <p className="font-medium">You're on a streak! 🔥</p>
            <p className="text-sm">You've applied to jobs today. Keep up the momentum!</p>
          </div>
        </div>
      )}

      {/* Progress Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.metrics.map((metric) => (
          <div key={metric.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{metric.name}</h3>
              <span className="text-sm font-medium text-gray-500">
                {metric.current} / {metric.target} {metric.unit}
              </span>
            </div>
            <div className="flex justify-center">
              <ProgressRing 
                progress={(metric.current / metric.target) * 100} 
                size={120} 
                strokeWidth={10} 
                textSize={24}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Job Application Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Applications" 
          value={data.jobStats.totalApplications} 
          icon={<FaBriefcase />} 
          color="blue"
        />
        <StatCard 
          title="Interviews" 
          value={data.jobStats.interviews} 
          icon={<FaUserTie />} 
          color="purple"
        />
        <StatCard 
          title="Offers" 
          value={data.jobStats.offers} 
          icon={<FaCheck />} 
          color="green"
        />
        <StatCard 
          title="Rejection Rate" 
          value={`${Math.round((data.jobStats.rejected / data.jobStats.totalApplications) * 100)}%`} 
          icon={<FaTimes />} 
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Applications Over Time">
          <Line 
            data={applicationChartData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0
                  }
                }
              }
            }} 
          />
        </ChartCard>
        <ChartCard title="Job Application Funnel">
          <Bar 
            data={funnelChartData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0
                  }
                }
              }
            }} 
          />
        </ChartCard>
      </div>

      {/* Active Challenges */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
          <div className="card border-2 border-dashed border-gray-300 flex items-center justify-center">
            <button className="btn btn-outline flex items-center">
              <span className="mr-2">+</span> New Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
