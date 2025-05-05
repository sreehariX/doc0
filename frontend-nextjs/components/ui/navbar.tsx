"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Menu, ChevronRight } from 'lucide-react';

const navItems = [
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Chat', href: '/chat', isButton: true }
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Add height to ensure content is pushed down below fixed navbar */}
      <div className="h-24"></div>
      
      <header className="fixed top-4 left-0 w-full z-50 px-4">
        <div className={`max-w-7xl mx-auto transition-all duration-300 rounded-2xl ${
          scrolled 
            ? 'bg-black shadow-lg' 
            : 'bg-zinc-900'
        }`}>
          <div className="flex items-center justify-between py-4 px-6">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold tracking-tight text-white">Doc<span className="text-gray-400">0</span></h1>
              </Link>
            </motion.div>

            {/* Desktop navigation */}
            <motion.nav 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex items-center space-x-8"
            >
              {navItems.map((item) => (
                item.isButton ? (
                  <Link key={item.name} href={item.href}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-white text-black hover:bg-gray-200 transition-colors px-6 py-6 rounded-xl font-medium">
                        Launch App <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                ) : (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    className="text-gray-200 hover:text-white transition-colors font-medium text-base relative group"
                  >
                    {item.name}
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </Link>
                )
              ))}
            </motion.nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                className="text-white" 
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-black border-t border-gray-800 overflow-hidden mt-2 rounded-xl max-w-7xl mx-auto"
            >
              <div className="px-4 py-6 space-y-5">
                {navItems.map((item) => (
                  item.isButton ? (
                    <Link 
                      key={item.name} 
                      href={item.href} 
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      <Button className="w-full bg-white text-black hover:bg-gray-200 transition-colors py-6 rounded-xl font-medium">
                        Launch App <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link 
                      key={item.name} 
                      href={item.href} 
                      className="block py-3 text-gray-200 hover:text-white transition-colors font-medium text-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}