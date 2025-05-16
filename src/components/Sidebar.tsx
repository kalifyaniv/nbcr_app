import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, GitPullRequest, Github as GitHub, Settings, LogOut, CodepenIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  return (
    <aside className="bg-blue-900 text-white w-16 md:w-64 min-h-screen flex flex-col shadow-md">
      <div className="p-5 flex items-center justify-center md:justify-start">
        <CodepenIcon className="h-8 w-8 text-white" />
        <span className="ml-2 text-xl font-bold hidden md:block">CodeMerge</span>
      </div>
      
      <nav className="mt-8 flex-1">
        <NavLink
          to="/"
          className={({ isActive }) => 
            `flex items-center py-3 px-4 mx-2 rounded-md transition-colors duration-150 ${
              isActive 
                ? 'bg-blue-800 text-white' 
                : 'text-blue-200 hover:bg-blue-800 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="ml-4 hidden md:block">Dashboard</span>
        </NavLink>
        
        <NavLink
          to="/repositories"
          className={({ isActive }) => 
            `flex items-center py-3 px-4 mx-2 rounded-md transition-colors duration-150 ${
              isActive 
                ? 'bg-blue-800 text-white' 
                : 'text-blue-200 hover:bg-blue-800 hover:text-white'
            }`
          }
        >
          <GitHub className="h-5 w-5" />
          <span className="ml-4 hidden md:block">Repositories</span>
        </NavLink>
        
        <NavLink
          to="/pending-reviews"
          className={({ isActive }) => 
            `flex items-center py-3 px-4 mx-2 rounded-md transition-colors duration-150 ${
              isActive 
                ? 'bg-blue-800 text-white' 
                : 'text-blue-200 hover:bg-blue-800 hover:text-white'
            }`
          }
        >
          <GitPullRequest className="h-5 w-5" />
          <span className="ml-4 hidden md:block">Pending Reviews</span>
        </NavLink>
        
        <NavLink
          to="/settings"
          className={({ isActive }) => 
            `flex items-center py-3 px-4 mx-2 rounded-md transition-colors duration-150 ${
              isActive 
                ? 'bg-blue-800 text-white' 
                : 'text-blue-200 hover:bg-blue-800 hover:text-white'
            }`
          }
        >
          <Settings className="h-5 w-5" />
          <span className="ml-4 hidden md:block">Settings</span>
        </NavLink>
      </nav>
      
      <div className="p-4 mt-auto border-t border-blue-800">
        <button 
          onClick={logout}
          className="flex items-center py-2 px-4 text-blue-200 hover:text-white rounded-md transition-colors duration-150 w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-4 hidden md:block">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;