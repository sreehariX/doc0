import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Framework } from '../types/chat';

interface SidebarProps {
  selectedFramework: Framework;
  onFrameworkSelect: (framework: Framework) => void;
}

const frameworks = [
  { 
    id: 'react', 
    name: 'React',
    logo: '/logos/react.png',
    collection: 'docs_react',
  },
  { 
    id: 'nextjs', 
    name: 'Next.js',
    logo: '/logos/nextjs.jpg',
    collection: 'docs_nextjs',
    className: 'invert'
  },
  { 
    id: 'astro', 
    name: 'Astro',
    logo: '/logos/astro.jpg',
    collection: 'docs_astro',
  },
  { 
    id: 'kestra', 
    name: 'Kestra',
    logo: '/logos/kestra.png',
    collection: 'docs_kestra',
  },
  { 
    id: 'redux', 
    name: 'Redux',
    logo: '/logos/redux.png',
    collection: 'docs_redux',
  },
] as const;

export const getCollectionName = (framework: Framework) => {
  return frameworks.find(f => f.id === framework)?.collection || 'docs_react';
};

export function Sidebar({ selectedFramework, onFrameworkSelect }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? '72px' : '240px' }}
      className="relative h-screen bg-gray-950 border-r border-gray-800/50 flex flex-col"
    >
      {/* Header with branding */}
      <div className="p-4 border-b border-white/10">
        <motion.div
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">d0</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-white">doc0</h1>
              <p className="text-xs text-white/50">Documentation Chat</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
        {frameworks.map(({ id, name, logo, className }) => (
          <button
            key={id}
            onClick={() => onFrameworkSelect(id as Framework)}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
              ${selectedFramework === id
                ? 'bg-gray-800/30'
                : 'hover:bg-gray-800/20'
              }`}
          >
            <div className="relative flex items-center">
              <img 
                src={logo} 
                alt={`${name} logo`}
                className={`w-6 h-6 object-contain rounded-md transition-transform duration-200 group-hover:scale-105 ${
                  !isCollapsed ? 'mr-3' : ''
                } ${className || ''}`}
              />
              {selectedFramework === id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-3 bg-blue-500 rounded-full"
                />
              )}
            </div>
            {!isCollapsed && (
              <span className="text-sm font-medium text-white/90">{name}</span>
            )}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-white/10 backdrop-blur-lg text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transform translate-x-2 transition-all">
                {name}
              </div>
            )}
          </button>
        ))}
      </nav>
    </motion.div>
  );
}