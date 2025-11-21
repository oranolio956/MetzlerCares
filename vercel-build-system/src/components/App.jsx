import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from './LoadingSpinner';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { logger } from '../utils/logger';

// Lazy load pages for code splitting
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Lazy load components that might not be needed immediately
const ErrorBoundary = lazy(() => import('./ErrorBoundary'));

export function App() {
  const { handleError } = useErrorHandler();

  // Check system health on app start
  const { data: healthData, error: healthError } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      return response.json();
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      logger.error('Health check error:', error);
      handleError(error);
    }
  });

  React.useEffect(() => {
    if (healthData) {
      logger.info('System health check passed:', healthData);
    }
  }, [healthData]);

  return (
    <div className="app">
      <Navigation />

      <main className="main-content">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Redirect old routes */}
            <Route path="/home" element={<Navigate to="/" replace />} />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {/* Development indicators */}
      {process.env.NODE_ENV === 'development' && (
        <div className="dev-indicator">
          <span>DEV MODE</span>
          {healthError && <span className="error">⚠️ Health Check Failed</span>}
          {healthData && <span className="success">✅ System Healthy</span>}
        </div>
      )}
    </div>
  );
}

// HOC for protected routes (example)
export function withAuth(Component) {
  return function ProtectedComponent(props) {
    const { data: user, isLoading } = useQuery({
      queryKey: ['user'],
      queryFn: async () => {
        const response = await fetch('/api/auth/me');
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        return response.json();
      },
      retry: false,
      onError: (error) => {
        if (error.message === 'Unauthorized') {
          window.location.href = '/login';
        }
      }
    });

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return <Component {...props} user={user} />;
  };
}
