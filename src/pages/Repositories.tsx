import React, { useState, useEffect } from 'react';
import { useRepository } from '../context/RepositoryContext';
import { 
  Eye, EyeOff, GitBranch, MoreHorizontal, Check, X, Search, Plus, RefreshCw, Filter
} from 'lucide-react';

const Repositories: React.FC = () => {
  const { 
    repositories, 
    loading, 
    fetchRepositories, 
    toggleNbcrForRepository,
    toggleNbcrForBranch
  } = useRepository();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRepo, setExpandedRepo] = useState<string | null>(null);
  const [newBranch, setNewBranch] = useState('');
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  
  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);
  
  const handleAddBranch = (repoId: string) => {
    if (newBranch.trim()) {
      toggleNbcrForBranch(repoId, newBranch.trim());
      setNewBranch('');
    }
  };
  
  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         repo.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'enabled') return matchesSearch && repo.isNbcrEnabled;
    if (filter === 'disabled') return matchesSearch && !repo.isNbcrEnabled;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-xl font-semibold mb-4 md:mb-0">GitHub Repositories</h2>
          
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search repositories..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  const newFilter = filter === 'all' 
                    ? 'enabled' 
                    : filter === 'enabled' ? 'disabled' : 'all';
                  setFilter(newFilter);
                }}
              >
                <Filter className="h-5 w-5 mr-2 text-gray-500" />
                {filter === 'all' ? 'All' : filter === 'enabled' ? 'NBCR Enabled' : 'NBCR Disabled'}
              </button>
            </div>
            
            <button
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={fetchRepositories}
            >
              <RefreshCw className="h-5 w-5 mr-2 text-gray-500" />
              Refresh
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            {filteredRepositories.length === 0 ? (
              <div className="py-12 text-center">
                <div className="flex justify-center mb-4">
                  <EyeOff className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No repositories found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchTerm 
                    ? "Try adjusting your search term" 
                    : "Connect to GitHub to add repositories"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredRepositories.map(repo => (
                  <div key={repo.id} className="bg-white hover:bg-gray-50 transition-colors duration-150">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={repo.avatarUrl} 
                            alt={repo.name} 
                            className="h-10 w-10 rounded-md mr-4" 
                          />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{repo.fullName}</h3>
                            <p className="text-sm text-gray-500 mt-1">{repo.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            repo.isNbcrEnabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {repo.isNbcrEnabled ? 'NBCR Enabled' : 'NBCR Disabled'}
                          </div>
                          
                          <button
                            onClick={() => toggleNbcrForRepository(repo.id)}
                            className={`p-2 rounded-md ${
                              repo.isNbcrEnabled
                                ? 'text-green-700 hover:bg-green-100'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {repo.isNbcrEnabled ? (
                              <Eye className="h-5 w-5" />
                            ) : (
                              <EyeOff className="h-5 w-5" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => setExpandedRepo(expandedRepo === repo.id ? null : repo.id)}
                            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                          >
                            {expandedRepo === repo.id ? (
                              <X className="h-5 w-5" />
                            ) : (
                              <MoreHorizontal className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {expandedRepo === repo.id && (
                        <div className="mt-4 border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            NBCR-Enabled Branches
                          </h4>
                          
                          <div className="space-y-2 mb-4">
                            {repo.nbcrEnabledBranches.length === 0 ? (
                              <p className="text-sm text-gray-500">No branches enabled for NBCR</p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {repo.nbcrEnabledBranches.map(branch => (
                                  <div
                                    key={branch}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    <GitBranch className="h-3 w-3 mr-1" />
                                    {branch}
                                    <button
                                      onClick={() => toggleNbcrForBranch(repo.id, branch)}
                                      className="ml-1 p-1 text-blue-800 hover:text-blue-900 rounded-full"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center mt-3">
                            <div className="flex-1 mr-2">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <GitBranch className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Add branch (e.g., develop)"
                                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md w-full text-sm"
                                  value={newBranch}
                                  onChange={(e) => setNewBranch(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddBranch(repo.id);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddBranch(repo.id)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </button>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="border border-gray-200 rounded-md p-3">
                              <h5 className="text-xs font-medium text-gray-700 mb-2">Default Branch</h5>
                              <div className="flex items-center">
                                <GitBranch className="h-4 w-4 text-gray-500 mr-1" />
                                <span className="text-sm">{repo.defaultBranch}</span>
                              </div>
                            </div>
                            
                            <div className="border border-gray-200 rounded-md p-3">
                              <h5 className="text-xs font-medium text-gray-700 mb-2">Last Updated</h5>
                              <div className="text-sm">
                                {new Date(repo.updatedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Repositories;