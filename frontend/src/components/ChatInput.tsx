import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  centered?: boolean;
}

export function ChatInput({ onSend, disabled, placeholder = 'Type your message...', centered = false }: ChatInputProps) {
  const [input, setInput] = useState('');

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
          onSend(input.trim());
          setInput('');
        }
      }} 
      className={`p-4 ${centered ? '' : 'max-w-3xl mx-auto w-full'}`}
    >
      <div className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-gray-900/50 text-white rounded-lg border border-gray-800/50 px-4 py-3 pr-24 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 disabled:opacity-50 placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="absolute right-2 px-4 py-1.5 bg-blue-600/80 hover:bg-blue-500/80 text-white rounded-md disabled:opacity-50 transition-all duration-200"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}