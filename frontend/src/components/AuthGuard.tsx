import React from 'react';
import { useAuthStore } from '../store/auth';
import { RequestLimiter } from '../services/requestLimiter';

interface AuthGuardProps {
  children: React.ReactNode;
  onProtectedClick: () => void;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, onProtectedClick }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const remainingRequests = RequestLimiter.getRemainingRequests();

  if (!isAuthenticated && remainingRequests <= 0) {
    onProtectedClick();
    return null;
  }

  return <>{children}</>;
};