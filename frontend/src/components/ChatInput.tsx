import { useState, type FormEvent } from 'react';
import { Send, Infinity } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { RequestLimiter } from '../services/requestLimiter';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  centered?: boolean;
  onLoginClick: () => void;
}

export function ChatInput({ 
  onSend, 
  disabled, 
  placeholder = 'Type your message...', 
  centered = false,
  onLoginClick 
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const { isAuthenticated } = useAuthStore();
  const remainingRequests = RequestLimiter.getRemainingRequests();
  const limit = RequestLimiter.getLimit();

  const getRenewalMessage = () => {
    if (!limit) return '';
    
    const now = new Date();
    const renewal = new Date(limit.nextAllowedTime);
    
    if (now.toDateString() === renewal.toDateString()) {
      return `Renews today at ${new Intl.DateTimeFormat('en-IN', {
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      }).format(renewal)} IST`;
    }
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.toDateString() === renewal.toDateString()) {
      return `Renews tomorrow at ${new Intl.DateTimeFormat('en-IN', {
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      }).format(renewal)} IST`;
    }
    
    return `Renews on ${new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    }).format(renewal)}`;
  };

  const isLimitReached = !isAuthenticated && remainingRequests <= 0;

  return (
    <div className={`p-2 sm:p-4 ${centered ? '' : 'w-full'}`}>
      <div className="max-w-[1024px] mx-auto">
        <div className="mb-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">
              {isAuthenticated ? (
                <div className="flex items-center gap-1">
                  
                </div>
              ) : remainingRequests > 0 ? (
                <>
                  <span className="text-blue-500 font-medium">{remainingRequests}</span> requests remaining
                </>
              ) : (
                <span className="text-yellow-500">Daily limit reached</span>
              )}
            </span>
          </div>
          {isLimitReached && limit && (
            <span className="text-gray-500 text-xs">
              {getRenewalMessage()}
            </span>
          )}
        </div>

        {isLimitReached ? (
          <div 
            onClick={onLoginClick}
            className="w-full bg-gray-900 text-gray-500 rounded-2xl border border-gray-800/50 px-4 py-4
              cursor-pointer hover:bg-gray-800 transition-colors"
          >
            Click here to sign in for more requests
          </div>
        ) : (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !disabled) {
                onSend(input.trim());
                setInput('');
              }
            }} 
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full bg-gray-900 text-white rounded-2xl border border-gray-800/50 px-4 sm:px-6 py-3 sm:py-4 pr-16 sm:pr-24 
                focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 
                disabled:opacity-50 disabled:cursor-not-allowed
                placeholder-gray-500 text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={disabled || !input.trim()}
              className="absolute right-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 
                text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed 
                transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        {isLimitReached && (
          <div className="mt-2 text-center text-sm text-yellow-500">
            Click the input box to sign in for more requests
          </div>
        )}
      </div>
    </div>
  );
}