import React, { useState } from 'react';
import { useRepository } from '../context/RepositoryContext';
import { 
  GitPullRequest, Clock, Search, MessageSquare, User, FilterX, ArrowUpDown
} from 'lucide-react';

type SortField = 'date' | 'repository' | 'author';
type SortOrder = 'asc' | 'desc';

const PendingReviews: React.FC = () => {
  const { pendingReviews } = useRepository();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };
  
  const filteredReviews = pendingReviews.filter(pr => 
    pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pr.repositoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pr.author.login.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.mergedAt || a.createdAt).getTime();
      const dateB = new Date(b.mergedAt || b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'repository') {
      return sortOrder === 'asc' 
        ? a.repositoryName.localeCompare(b.repositoryName)
        : b.repositoryName.localeCompare(a.repositoryName);
    } else {
      return sortOrder === 'asc'
        ? a.author.login.localeCompare(b.author.login)
        : b.author.login.localeCompare(a.author.login);
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Pending Reviews</h2>
            <p className="text-gray-500 mt-1">
              PRs merged with pending reviews that require follow-up.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search PRs, repositories, authors..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <FilterX className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchTerm ? "No matching reviews found" : "No pending reviews"}
            </h3>
            <p className="text-gray-500 max-w-md">
              {searchTerm 
                ? "Try adjusting your search terms or filters"
                : "All PRs have been reviewed. Great job keeping up with code quality!"}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden shadow border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-6"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('date')}
                    >
                      <span>Pull Request</span>
                      {sortField === 'date' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('repository')}
                    >
                      <span>Repository</span>
                      {sortField === 'repository' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('author')}
                    >
                      <span>Author</span>
                      {sortField === 'author' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reviewers
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Merged
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedReviews.map(pr => (
                  <tr key={pr.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-6">
                      <div className="flex items-center">
                        <GitPullRequest className="h-4 w-4 text-purple-600 mr-2" />
                        {pr.number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{pr.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pr.repositoryName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-6 w-6 rounded-full mr-2"
                          src={pr.author.avatarUrl}
                          alt={pr.author.login}
                        />
                        <div className="text-sm text-gray-900">{pr.author.login}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex -space-x-2">
                        {pr.reviewers.map((reviewer, index) => (
                          <div key={index} className="relative">
                            <img
                              className="h-6 w-6 rounded-full border border-white"
                              src={reviewer.avatarUrl}
                              alt={reviewer.login}
                              title={reviewer.login}
                            />
                            {reviewer.status === 'pending' && (
                              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-amber-500 border border-white"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {pr.mergedAt ? new Date(pr.mergedAt).toLocaleDateString() : 'Not merged'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded-md hover:bg-blue-50">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded-md hover:bg-indigo-50">
                          <User className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingReviews;