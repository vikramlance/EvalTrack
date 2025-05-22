import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaChartLine, 
  FaBriefcase, 
  FaTrophy, 
  FaBook, 
  FaCog 
} from 'react-icons/fa';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: <FaChartLine />, label: 'Dashboard' },
    { to: '/jobs', icon: <FaBriefcase />, label: 'Job Tracker' },
    { to: '/challenges', icon: <FaTrophy />, label: 'Challenges' },
    { to: '/prep', icon: <FaBook />, label: 'Prep Log' },
    { to: '/settings', icon: <FaCog />, label: 'Settings' }
  ];

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-gray-800 text-white">
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <h1 className="text-xl font-bold">🏆 EvalTrack</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold">U</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">User</p>
              <p className="text-xs text-gray-400">View Profile</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
