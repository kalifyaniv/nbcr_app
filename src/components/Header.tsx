import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Settings, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Map routes to page titles
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/repositories':
        return 'Repositories';
      case '/pending-reviews':
        return 'Pending Reviews';
      case '/settings':
        return 'Settings';
      default:
        return 'CodeMerge';
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">{getPageTitle()}</h1>
        
        <div className="relative mx-4 flex-1 max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search repositories, PRs..."
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative text-gray-600 hover:text-gray-900 focus:outline-none">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform -translate-y-1/2 translate-x-1/2"></span>
          </button>
          
          <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
            <Settings className="h-6 w-6" />
          </button>
          
          <div className="flex items-center border-l pl-4 ml-2 border-gray-200">
            <img
              className="h-8 w-8 rounded-full"
              src={user?.avatarUrl || 'https://i.pravatar.cc/150?u=default'}
              alt="User avatar"
            />
            <span className="ml-2 font-medium text-sm text-gray-800 hidden md:block">
              {user?.name || 'User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;