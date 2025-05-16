import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-full flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-8">
          <Search className="h-12 w-12 text-blue-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-3 text-base text-gray-500 max-w-md text-center">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="mt-8">
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;