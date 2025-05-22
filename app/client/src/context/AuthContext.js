import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Helper function to parse JWT and get expiration time
const getTokenExpirationTime = (token) => {
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return null;
    
    const payload = JSON.parse(atob(tokenParts[1]));
    if (!payload.exp) return null;
    
    // exp is in seconds, convert to milliseconds
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const [tokenExpirationMessage, setTokenExpirationMessage] = useState('');

  // Set up axios defaults
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Check if user is already logged in and handle token expiration
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Check token expiration
          const expirationTime = getTokenExpirationTime(token);
          setTokenExpiration(expirationTime);
          
          if (expirationTime) {
            const now = new Date();
            const timeUntilExpiration = expirationTime - now;
            
            if (timeUntilExpiration <= 0) {
              // Token has expired
              setTokenExpirationMessage('Your session has expired. Please log in again.');
              throw new Error('Token expired');
            } else {
              // Token is valid, calculate expiration message
              const minutesRemaining = Math.floor(timeUntilExpiration / (1000 * 60));
              const hoursRemaining = Math.floor(minutesRemaining / 60);
              
              if (hoursRemaining > 0) {
                setTokenExpirationMessage(`Session expires in ${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''} and ${minutesRemaining % 60} minute${(minutesRemaining % 60) !== 1 ? 's' : ''}`);
              } else {
                setTokenExpirationMessage(`Session expires in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}`);
              }
              
              // Set token in axios headers
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              
              // Get user data
              const userData = JSON.parse(localStorage.getItem('user'));
              
              if (userData) {
                setUser(userData);
                setIsAuthenticated(true);
              }
            }
          } else {
            // Could not parse token expiration
            setTokenExpirationMessage('Session information unavailable');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Get user data
            const userData = JSON.parse(localStorage.getItem('user'));
            
            if (userData) {
              setUser(userData);
              setIsAuthenticated(true);
            }
          }
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
          setTokenExpirationMessage('Your session has expired. Please log in again.');
        }
      } else {
        setTokenExpirationMessage('Please log in to access your dashboard');
      }
      
      setLoading(false);
    };
    
    checkAuth();
    
    // Set up a timer to check token expiration every minute
    const expirationTimer = setInterval(() => {
      checkAuth();
    }, 60000); // Check every minute
    
    return () => clearInterval(expirationTimer);
  }, []);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/auth/register', userData);
      
      const { token, user } = response.data;
      
      // Save token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      setLoading(false);
      
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      
      return { success: false, error: errorMessage };
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/auth/login', credentials);
      
      const { token, user } = response.data;
      
      // Check token expiration
      const expirationTime = getTokenExpirationTime(token);
      setTokenExpiration(expirationTime);
      
      if (expirationTime) {
        const now = new Date();
        const timeUntilExpiration = expirationTime - now;
        
        if (timeUntilExpiration <= 0) {
          throw new Error('Token expired');
        }
        
        // Calculate expiration message
        const minutesRemaining = Math.floor(timeUntilExpiration / (1000 * 60));
        const hoursRemaining = Math.floor(minutesRemaining / 60);
        
        if (hoursRemaining > 0) {
          setTokenExpirationMessage(`Session expires in ${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''} and ${minutesRemaining % 60} minute${(minutesRemaining % 60) !== 1 ? 's' : ''}`);
        } else {
          setTokenExpirationMessage(`Session expires in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}`);
        }
      } else {
        setTokenExpirationMessage('Session information unavailable');
      }
      
      // Save token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      setLoading(false);
      
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      setTokenExpirationMessage('');
      
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = () => {
    // Remove token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove token from axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    setIsAuthenticated(false);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        tokenExpiration,
        tokenExpirationMessage,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
