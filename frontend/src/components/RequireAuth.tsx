import React from 'react';
import { LogIn } from 'lucide-react';
import { RequestLimiter } from '../services/requestLimiter';

interface RequireAuthProps {
  onLoginClick: () => void;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ onLoginClick }) => {
  const limit = RequestLimiter.getLimit();
  const nextAllowedTime = limit?.nextAllowedTime ? new Date(limit.nextAllowedTime).toLocaleString() : '';

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="max-w-md text-center">
        <LogIn className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h2 className="text-2xl font-bold mb-2 text-white">Daily Limit Reached</h2>
        <p className="text-gray-400 mb-4">
          You've reached your daily limit of 10 free requests.
          Sign in to continue using the documentation chat.
        </p>
        {nextAllowedTime && (
          <p className="text-sm text-gray-500 mb-4">
            Next free requests available at: {nextAllowedTime}
          </p>
        )}
        <button
          onClick={onLoginClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
};