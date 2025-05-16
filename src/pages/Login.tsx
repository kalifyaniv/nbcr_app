import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Github as GitHub, ShieldCheck, Zap, Clock } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogin = () => {
    login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <svg 
                  className="h-10 w-10 text-blue-600" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <path d="M15 3h6v6" />
                  <path d="M10 14L21 3" />
                </svg>
              </div>
            </div>
            
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              CodeMerge
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Streamline your PR workflow with Non-Blocking Code Reviews
            </p>

            <div className="mt-8 space-y-6">
              <button
                onClick={handleLogin}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <GitHub className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
                </span>
                Connect with GitHub
              </button>
              
              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    Unlock these benefits
                  </p>
                </div>
                
                <div className="px-4 py-5 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Accelerate Development</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Merge when ready, review asynchronously
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-5 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Maintain Quality</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Track reviews even after merging
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-5 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Optimize Team Time</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Stop waiting for reviewers to continue
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <p className="text-xs text-gray-500">
              © 2025 CodeMerge. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;