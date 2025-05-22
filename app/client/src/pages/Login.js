import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaSignInAlt, 
  FaExclamationCircle, 
  FaArrowRight, 
  FaChartLine, 
  FaClipboardCheck, 
  FaUserAlt, 
  FaArrowUp, 
  FaArrowDown, 
  FaFire, 
  FaBriefcase, 
  FaUserTie, 
  FaCheck, 
  FaTimes 
} from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import ProgressRing from '../components/ProgressRing';

// Register ChartJS components
ChartJS.register(...registerables);

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Mock data for preview
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
  
  // Chart data for application progress
  const applicationChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Applications',
        data: [8, 12, 10, 12],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Interviews',
        data: [1, 2, 2, 3],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      }
    ],
  };
  
  // Chart data for prep time
  const prepTimeChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Hours',
        data: [1.5, 2, 0, 3, 1, 4, 2.5],
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgba(139, 92, 246, 1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };
  
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    // Clear auth error when user makes changes
    if (error) {
      clearError();
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      const result = await login(formData);
      
      setIsSubmitting(false);
      
      if (result.success) {
        navigate('/');
      }
    }
  };
  
  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Login Form Section */}
      <div className="md:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-xl shadow-md">
          <div>
            <h1 className="text-center text-3xl font-extrabold text-gray-900">🏆 EvalTrack</h1>
            <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                create a new account
              </Link>
            </p>
          </div>
          
          {error && (
            <div className="bg-danger-50 border-l-4 border-danger-500 text-danger-700 p-4 rounded-md flex items-center">
              <FaExclamationCircle className="text-danger-500 mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`form-input rounded-md w-full ${formErrors.email ? 'border-danger-300' : ''}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {formErrors.email && (
                  <p className="form-error">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className={`form-input rounded-md w-full ${formErrors.password ? 'border-danger-300' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                {formErrors.password && (
                  <p className="form-error">{formErrors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-primary w-full flex justify-center items-center py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                ) : (
                  <>
                    <FaSignInAlt className="mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </div>
            
            <div className="text-center">
              <button 
                type="button" 
                className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center justify-center mx-auto mt-2"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Hide Preview' : 'See Product Preview'} <FaArrowRight className="ml-1" />
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Preview Section */}
      <div className={`md:w-1/2 transition-all duration-500 ease-in-out ${showPreview ? 'opacity-100' : 'opacity-0 md:opacity-100'} ${showPreview ? 'block' : 'hidden md:block'} overflow-hidden`}>
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaChartLine className="mr-2 text-primary-600" /> Dashboard Preview
            </h2>
            <p className="text-gray-600 mb-3">Track your job search progress with our powerful dashboard.</p>
            
            {/* Progress Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              {mockData.metrics.map((metric) => (
                <div key={metric.id} className="bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-700 text-sm">{metric.name}</h3>
                    <span className="text-xs font-medium text-gray-500">
                      {metric.current} / {metric.target} {metric.unit}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-12 h-12">
                      <ProgressRing 
                        progress={Math.round((metric.current / metric.target) * 100)} 
                        size={48} 
                        strokeWidth={4}
                        textSize={10}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Job Application Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <div className="flex items-center">
                  <div className="mr-2 text-blue-500"><FaBriefcase /></div>
                  <div>
                    <p className="text-xs text-gray-600">Applications</p>
                    <p className="text-lg font-bold">{mockData.jobStats.totalApplications}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-2 rounded-lg">
                <div className="flex items-center">
                  <div className="mr-2 text-purple-500"><FaUserTie /></div>
                  <div>
                    <p className="text-xs text-gray-600">Interviews</p>
                    <p className="text-lg font-bold">{mockData.jobStats.interviews}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <div className="flex items-center">
                  <div className="mr-2 text-green-500"><FaCheck /></div>
                  <div>
                    <p className="text-xs text-gray-600">Offers</p>
                    <p className="text-lg font-bold">{mockData.jobStats.offers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 p-2 rounded-lg">
                <div className="flex items-center">
                  <div className="mr-2 text-red-500"><FaTimes /></div>
                  <div>
                    <p className="text-xs text-gray-600">Rejection Rate</p>
                    <p className="text-lg font-bold">{Math.round((mockData.jobStats.rejected / mockData.jobStats.totalApplications) * 100)}%</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-1 text-sm">Applications Over Time</h3>
                <div className="h-28">
                  <Line 
                    data={applicationChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0,
                            font: { size: 8 }
                          }
                        },
                        x: {
                          ticks: {
                            font: { size: 8 }
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-1 text-sm">Job Application Funnel</h3>
                <div className="h-28">
                  <Bar 
                    data={{
                      labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
                      datasets: [{
                        data: [
                          mockData.jobStats.totalApplications, 
                          mockData.jobStats.interviews, 
                          mockData.jobStats.offers, 
                          mockData.jobStats.rejected
                        ],
                        backgroundColor: [
                          'rgba(59, 130, 246, 0.7)',
                          'rgba(139, 92, 246, 0.7)',
                          'rgba(16, 185, 129, 0.7)',
                          'rgba(239, 68, 68, 0.7)'
                        ],
                        borderWidth: 1
                      }]
                    }} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0,
                            font: { size: 8 }
                          }
                        },
                        x: {
                          ticks: {
                            font: { size: 8 }
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </div>
            </div>
            
            {/* Active Challenges */}
            <div className="mb-2">
              <h3 className="font-medium text-gray-700 mb-1 text-sm flex items-center">
                <FaClipboardCheck className="mr-1 text-primary-600" /> Active Challenges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mockData.challenges.map((challenge) => {
                  const progress = Math.round((challenge.current / challenge.target) * 100);
                  const endDate = new Date(challenge.endDate);
                  const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={challenge.id} className="bg-gray-50 p-2 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium text-sm">{challenge.name}</h4>
                        <div className="flex items-center">
                          <span className="text-xs bg-primary-100 text-primary-800 px-1.5 py-0.5 rounded">
                            {daysLeft} days left
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-primary-600 h-1.5 rounded-full" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-xs font-medium">{progress}%</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {challenge.current}/{challenge.target} completed
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="text-center mt-2">
              <p className="text-gray-600 mb-2 text-sm">Ready to start tracking your progress?</p>
              <div className="flex justify-center space-x-3">
                <Link to="/register" className="btn btn-primary btn-sm">
                  Create Account
                </Link>
                <button 
                  onClick={() => {
                    setShowPreview(false);
                    document.getElementById('email').focus();
                  }} 
                  className="btn btn-outline btn-sm"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
