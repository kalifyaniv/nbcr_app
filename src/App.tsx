import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Repositories from './pages/Repositories';
import Settings from './pages/Settings';
import PendingReviews from './pages/PendingReviews';
import NotFound from './pages/NotFound';

// Context
import { AuthProvider } from './context/AuthContext';
import { RepositoryProvider } from './context/RepositoryContext';

function App() {
  return (
    <AuthProvider>
      <RepositoryProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="repositories" element={<Repositories />} />
              <Route path="pending-reviews" element={<PendingReviews />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </RepositoryProvider>
    </AuthProvider>
  );
}

export default App;