import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Framework } from '../types/chat';
import { ChevronLeft, ChevronRight, LogIn, LogOut, X } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { cn } from '../lib/utils';

interface SidebarProps {
  selectedFramework: Framework;
  onFrameworkSelect: (framework: Framework) => void;
  onLoginClick: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const frameworks = [
  { 
    id: 'kestra', 
    name: 'Kestra',
    logo: '/logos/kestra.png',
    collection: 'docs_kestra',
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
    id: 'redux', 
    name: 'Redux',
    logo: '/logos/redux.png',
    collection: 'docs_redux',
  },

  { 
    id: 'react', 
    name: 'React',
    logo: '/logos/react.png',
    collection: 'docs_react',
  },
] as const;

export const getCollectionName = (framework: Framework) => {
  const collection = frameworks.find(f => f.id === framework)?.collection;
  if (!collection) {
    throw new Error(`Invalid framework: ${framework}`);
  }
  return collection;
};

export function Sidebar({ 
  selectedFramework, 
  onFrameworkSelect, 
  onLoginClick,
  isOpen,
  onClose
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Close sidebar when switching frameworks on mobile
  const handleFrameworkSelect = (framework: Framework) => {
    onFrameworkSelect(framework);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <motion.div 
          initial={false}
          animate={{ width: isCollapsed ? '72px' : '240px' }}
          className="relative bg-gray-950 border-r border-gray-800/50 flex flex-col h-screen"
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-50"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {/* Header with branding */}
          <div className="p-4 border-b border-white/10">
            <motion.div
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg">
                <img 
                  src="/logo.svg" 
                  alt="doc0 logo"
                  className="w-5 h-5 object-contain"
                />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-bold text-white">doc0</h1>
                  <p className="text-xs text-white/50">Chat with docs</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 hidden md:block">
            {frameworks.map(({ id, name, logo, className }) => (
              <button
                key={id}
                onClick={() => handleFrameworkSelect(id as Framework)}
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

          {/* User section - hide on mobile */}
          <div className="mt-auto border-t border-gray-800/50 p-4 hidden md:block">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                {user.picture && (
                  <img 
                    src={user.picture} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                )}
                <button
                  onClick={logout}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800/20 transition-colors"
              >
                <LogIn className="w-4 h-4 text-gray-400" />
                {!isCollapsed && (
                  <span className="text-sm text-gray-400">Login</span>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="md:hidden fixed inset-y-0 left-0 w-[280px] bg-gray-950 border-r border-gray-800/50 z-50"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-4 border-b border-gray-800/50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                      <img src="/logo.svg" alt="doc0 logo" className="w-5 h-5" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-white">doc0</h1>
                      <p className="text-xs text-white/50">Chat with docs</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-800 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Framework Navigation */}
                <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
                  {frameworks.map(({ id, name, logo, className }) => (
                    <button
                      key={id}
                      onClick={() => handleFrameworkSelect(id as Framework)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                        ${selectedFramework === id
                          ? 'bg-gray-800/30'
                          : 'hover:bg-gray-800/20'
                        }`}
                    >
                      <div className="relative flex items-center">
                        <img 
                          src={logo} 
                          alt={`${name} logo`}
                          className={`w-6 h-6 object-contain rounded-md ${className || ''}`}
                        />
                        {selectedFramework === id && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-3 bg-blue-500 rounded-full"
                          />
                        )}
                      </div>
                      <span className="text-sm font-medium text-white/90">{name}</span>
                    </button>
                  ))}
                </nav>

                {/* User Section */}
                <div className="mt-auto border-t border-gray-800/50 p-4">
                  {isAuthenticated && user ? (
                    <div className="flex items-center space-x-3">
                      {user.picture && (
                        <img 
                          src={user.picture} 
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      )}
                      <button
                        onClick={logout}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        title="Logout"
                      >
                        <LogOut className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={onLoginClick}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800/20 transition-colors"
                    >
                      <LogIn className="w-4 h-4 text-gray-400" />
                      {!isCollapsed && (
                        <span className="text-sm text-gray-400">Login</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}