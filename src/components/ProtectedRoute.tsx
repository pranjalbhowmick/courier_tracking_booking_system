import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'customer' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { isAuthenticated, user } = useAppStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;