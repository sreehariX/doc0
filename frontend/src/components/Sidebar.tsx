import { Book, FileCode, Blocks, Layers } from 'lucide-react';
import type { Framework } from '../types/chat';

interface SidebarProps {
  selectedFramework: Framework;
  onFrameworkSelect: (framework: Framework) => void;
}

const frameworks = [
  { id: 'react', name: 'React', icon: Blocks },
  { id: 'angular', name: 'Angular', icon: Layers },
  { id: 'astro', name: 'Astro', icon: FileCode },
  { id: 'vue', name: 'Vue', icon: Book },
] as const;

export function Sidebar({ selectedFramework, onFrameworkSelect }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white mb-2">doc0</h1>
        <p className="text-gray-400 text-sm">Documentation Chat</p>
      </div>
      
      <nav className="space-y-2">
        {frameworks.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onFrameworkSelect(id as Framework)}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              selectedFramework === id
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}