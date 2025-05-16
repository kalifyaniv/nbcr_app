import React from 'react';
import { useRepository } from '../context/RepositoryContext';
import { ArrowRight, GitPullRequest, Check, AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { repositories, pendingReviews } = useRepository();
  
  // Only show top 5 pending reviews
  const recentPendingReviews = pendingReviews.slice(0, 5);
  
  // Calculate NBCR adoption percentage
  const nbcrEnabledRepos = repositories.filter(repo => repo.isNbcrEnabled).length;
  const adoptionPercentage = repositories.length > 0 
    ? Math.round((nbcrEnabledRepos / repositories.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-700">
              <GitHub className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Repositories</p>
              <h3 className="text-2xl font-semibold">{repositories.length}</h3>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-600">
              {nbcrEnabledRepos} with NBCR enabled
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-700">
              <GitPullRequest className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
              <h3 className="text-2xl font-semibold">{pendingReviews.length}</h3>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-600">
              From {pendingReviews.reduce((repos, pr) => {
                if (!repos.includes(pr.repositoryName)) {
                  repos.push(pr.repositoryName);
                }
                return repos;
              }, [] as string[]).length} repositories
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-700">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Review Time</p>
              <h3 className="text-2xl font-semibold">8h 12m</h3>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-600">
              Past 7 days
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-700">
              <Check className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">NBCR Adoption</p>
              <h3 className="text-2xl font-semibold">{adoptionPercentage}%</h3>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${adoptionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions and Pending Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          
          <div className="space-y-3">
            <Link 
              to="/repositories" 
              className="flex items-center justify-between py-3 px-4 bg-gray-50 hover:bg-blue-50 rounded-md transition duration-150"
            >
              <span className="text-gray-700">Configure Repository</span>
              <ArrowRight className="h-4 w-4 text-gray-500" />
            </Link>
            
            <Link 
              to="/settings" 
              className="flex items-center justify-between py-3 px-4 bg-gray-50 hover:bg-blue-50 rounded-md transition duration-150"
            >
              <span className="text-gray-700">Manage Team Settings</span>
              <ArrowRight className="h-4 w-4 text-gray-500" />
            </Link>
            
            <Link 
              to="/pending-reviews" 
              className="flex items-center justify-between py-3 px-4 bg-gray-50 hover:bg-blue-50 rounded-md transition duration-150"
            >
              <span className="text-gray-700">View All Pending Reviews</span>
              <ArrowRight className="h-4 w-4 text-gray-500" />
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Pending Reviews</h2>
            <Link 
              to="/pending-reviews" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>
          
          {recentPendingReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Check className="h-12 w-12 text-green-500 mb-2" />
              <p className="text-gray-600">No pending reviews! Great job keeping up with code reviews.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPendingReviews.map(pr => (
                <div key={pr.id} className="flex items-center p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition duration-150">
                  <div className="flex-shrink-0">
                    <img 
                      src={pr.author.avatarUrl} 
                      alt={pr.author.login}
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium">{pr.title}</h4>
                    <p className="text-xs text-gray-500">
                      {pr.repositoryName} • #{pr.number} by {pr.author.login}
                    </p>
                  </div>
                  <div className="ml-2 flex items-center">
                    <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Awaiting {pr.reviewers.length} {pr.reviewers.length === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6">
            <div className="relative pl-10">
              <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <GitPullRequest className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Jane Developer</span> merged PR <span className="font-medium text-blue-600">#123</span> in <span className="font-medium">acme/frontend</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">25 minutes ago</p>
              </div>
            </div>
            
            <div className="relative pl-10">
              <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Sam Reviewer</span> approved PR <span className="font-medium text-blue-600">#121</span> in <span className="font-medium">acme/design-system</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="relative pl-10">
              <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">John Reviewer</span> requested changes on PR <span className="font-medium text-blue-600">#119</span> in <span className="font-medium">acme/backend</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import the GitHub icon which is missing
const GitHub = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
    >
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 16.4183 4.95573 20.1292 9 21.4344V17.5C9 17.5 8.5 17.5 8 17.5C6.9 17.5 6.42393 16.5047 6 16C5.66667 15.6 5 15 4.5 15C4 15 3.5 15.5 4 16C4.5 16.5 5 17.3 5.5 18C6 19 7 19.5 8 19.5C9 19.5 9.43506 19.3753 10 19C10.1208 18.0275 10.5 17.4939 11 17C8 16.5 6 15.5 6 13C6 11.5 6.5 10.5 7.5 9.5C7.36441 9.14432 7 8 7.5 6.5C7.5 6.5 8.5 6.5 10 8C11 7.5 13 7.5 14 8C15.5 6.5 16.5 6.5 16.5 6.5C17 8 16.6318 9.15125 16.5 9.5C17.5 10.5 18 11.5 18 13C18 15.5 16 16.5 13 17C13.5 17.5 14 18.5 14 19.5V21.4344C18.0443 20.1292 21 16.4183 21 12C21 6.47715 16.5228 2 12 2Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Dashboard;