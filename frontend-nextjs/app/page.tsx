"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Search, Zap, Users, Home, Code } from 'lucide-react';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { NavbarWrapper } from '@/components/ui/navbar-wrapper';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

export default function HomePage() {
  return (
    <AuroraBackground>
      <NavbarWrapper>
        {/* Main Content with proper padding for the fixed navbar */}
        <div className="pt-16">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 leading-tight"
            >
              <span className="text-white">Stop</span> Searching.<br/>
              <span className="text-white">Start</span> Conversing.
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              className="mt-8 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed"
            >
              Doc0 transforms your documentation into intelligent conversations. Get precise answers instantly, without endless scrolling.
            </motion.p>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="mt-12 flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link href="/chat">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-white text-black hover:bg-gray-200 px-8 py-7 text-lg inline-flex items-center font-medium shadow-lg rounded-full">
                    Experience it Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/features">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-zinc-800 px-8 py-7 text-lg font-medium rounded-full">
                    Explore Features
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Chat Interface - Updated to look like the second image */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full bg-zinc-900/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
            >
              <div className="h-14 bg-black/80 flex items-center px-6 justify-between rounded-t-2xl">
                <div className="flex items-center">
                  <div className="flex space-x-2 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-lg font-bold text-white ml-2">Doc<span className="text-blue-500">0</span></div>
                </div>
                <div className="text-sm text-gray-400">how can i deploy golem ?</div>
                <div className="flex space-x-3">
                  <div className="text-gray-400 cursor-pointer hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                  </div>
                  <div className="text-gray-400 cursor-pointer hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </div>
                  <div className="text-gray-400 cursor-pointer hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex h-[750px]">
                {/* Left sidebar */}
                <div className="w-64 bg-zinc-950/80 border-r border-gray-800 p-4 hidden md:block">
                  <div className="mb-4 flex items-center justify-between">
                    <button className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-xl text-sm flex items-center gap-2 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      New Chat
                    </button>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-400 mb-2">RECENT CHATS</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded-xl text-sm bg-transparent text-white hover:bg-zinc-800 cursor-pointer group border-l-2 border-blue-500 pl-3">
                        <div className="truncate">how can i deploy golem ?</div>
                        <button className="text-gray-500 opacity-0 group-hover:opacity-100">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-2 rounded-xl text-sm hover:bg-zinc-800 cursor-pointer text-gray-300">
                        How to install Golem
                      </div>
                      <div className="p-2 rounded-xl text-sm hover:bg-zinc-800 cursor-pointer text-gray-300">
                        API authentication
                      </div>
                      <div className="p-2 rounded-xl text-sm hover:bg-zinc-800 cursor-pointer text-gray-300">
                        Component deployment
                      </div>
                      <div className="p-2 rounded-xl text-sm hover:bg-zinc-800 cursor-pointer text-gray-300">
                        Troubleshooting workers
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
                  <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="flex justify-end">
                      <div className="inline-block rounded-xl bg-zinc-800/80 px-5 py-3 max-w-[80%]">
                        <p className="text-white">how can i deploy golem ?</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-zinc-800/60 rounded-xl p-6">
                          <p className="text-white mb-5 text-lg">You can deploy Golem in a few ways:</p>
                          
                          <ol className="space-y-6 text-gray-200">
                            <li className="flex gap-3">
                              <span className="font-bold text-lg">1.</span>
                              <div>
                                <div className="font-bold text-lg">Golem Cloud:</div>
                                <p className="mt-1">This is a hosted version of Golem, which is the easiest and fastest way to run Golem workers at scale without infrastructure setup or maintenance. It can be managed via the web management console, <code className="bg-black/40 px-1.5 py-0.5 rounded-md text-gray-300">golem-cloud-cli</code>, or REST API.</p>
                              </div>
                            </li>
                            
                            <li className="flex gap-3">
                              <span className="font-bold text-lg">2.</span>
                              <div>
                                <div className="font-bold text-lg">Kubernetes:</div>
                                <p className="mt-1">You can deploy to Kubernetes using the Golem Helm Chart. You'll need Helm and <code className="bg-black/40 px-1.5 py-0.5 rounded-md text-gray-300">kubectl</code> installed locally, and a running Kubernetes cluster. A quick start method involves downloading the contents of the <code className="bg-black/40 px-1.5 py-0.5 rounded-md text-gray-300">kube</code> directory from the Golem repository and running the <code className="bg-black/40 px-1.5 py-0.5 rounded-md text-gray-300">deploy.sh</code> script.</p>
                              </div>
                            </li>
                          </ol>

                          <div className="mt-6 p-4 bg-black/30 rounded-xl border border-gray-700 font-mono text-sm text-gray-300">
                            <pre className="whitespace-pre-wrap">./deploy.sh -n golem</pre>
                          </div>
                          
                          <p className="mt-5 text-gray-200">
                            This will deploy Golem with Redis and PostgreSQL to the <code className="bg-black/40 px-1.5 py-0.5 rounded-md text-gray-300">golem</code> namespace.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 border-t border-gray-800 bg-zinc-900/50">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search documentation..."
                        className="w-full bg-zinc-800/50 border border-gray-700 rounded-xl py-3.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-white text-white"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Why Teams Love Doc0</h2>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Stop wasting hours searching through documentation. Our AI understands context and delivers exactly what you need.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              <motion.div 
                variants={item}
                whileHover={{ y: -10 }}
                className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Natural Conversations</h3>
                <p className="text-gray-300 leading-relaxed">
                  Chat with your documentation in natural language. Ask questions, get clarifications, and dive deeper without browsing through pages.
                </p>
              </motion.div>
              
              <motion.div 
                variants={item}
                whileHover={{ y: -10 }}
                className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6">
                  <Search className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Semantic Search</h3>
                <p className="text-gray-300 leading-relaxed">
                  Powered by advanced vector search and AI, Doc0 understands what you're looking for, not just matching keywords.
                </p>
              </motion.div>
              
              <motion.div 
                variants={item}
                whileHover={{ y: -10 }}
                className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
                <p className="text-gray-300 leading-relaxed">
                  Get answers in seconds, not minutes. Stop wasting time scrolling through endless documentation pages.
                </p>
              </motion.div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mt-16 text-center"
            >
              <Link href="/chat">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg inline-flex items-center rounded-full">
                    Try It Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Testimonials */}
          <div className="py-32 bg-black/40 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-center mb-20"
              >
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Loved by Developers</h2>
                <p className="mt-6 text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
                  Join thousands of developers who have revolutionized their workflow with Doc0.
                </p>
              </motion.div>
              
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {[
                  {
                    quote: "Doc0 is at least a 2x improvement over traditional documentation search. It's an incredible accelerator for me and my team.",
                    author: "Ben Bernard",
                    role: "Senior Engineer, Acme Inc"
                  },
                  {
                    quote: "The way Doc0 understands context and provides relevant information is magical. I can't imagine going back to regular docs.",
                    author: "Sarah Johnson",
                    role: "Tech Lead, FutureTech"
                  },
                  {
                    quote: "I love how Doc0 remembers our conversation context. I can ask follow-up questions without repeating myself. Game changer!",
                    author: "Alex Rodriguez",
                    role: "Developer Advocate, BuildCo"
                  }
                ].map((testimonial, i) => (
                  <motion.div 
                    key={i} 
                    variants={item}
                    whileHover={{ y: -10 }}
                    className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800"
                  >
                    <p className="text-gray-300 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white"></div>
                      <div className="ml-4">
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
                  
          {/* CTA Section */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 md:p-16 text-center"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">Ready to transform your<br/> documentation experience?</h2>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                Join forward-thinking teams that have made Doc0 an essential part of their workflow. Get started in minutes, not days.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Link href="/chat" className="inline-flex items-center justify-center px-10 py-5 border border-transparent text-lg font-medium rounded-full text-black bg-white hover:bg-gray-200 transition-colors shadow-lg">
                  Try for Free — No Credit Card
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
                  
          {/* Footer */}
          <footer className="py-12 border-t border-gray-800/50 bg-black/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product</h3>
                  <ul className="space-y-2">
                    <li><Link href="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                    <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                    <li><Link href="/chat" className="text-gray-400 hover:text-white">Try Doc0</Link></li>
                  </ul>
                </div>
                
               
                
                <div className="col-span-2 md:col-span-1">
                  <h3 className="text-lg font-semibold mb-4">Connect</h3>
                  <ul className="space-y-2">
                    <li><Link href="https://x.com/sreehariX" className="text-gray-400 hover:text-white">Twitter</Link></li>
                    <li><Link href="https://github.com/sreehariX" className="text-gray-400 hover:text-white">GitHub</Link></li>
                    <li><Link href="sreeharixe@gmail.com" className="text-gray-400 hover:text-white">Contact</Link></li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold text-white">Doc<span className="text-gray-400">0</span></h2>
                </div>
                <p className="mt-4 md:mt-0 text-gray-400 text-sm">
                  © {new Date().getFullYear()} Doc0. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </NavbarWrapper>
    </AuroraBackground>
  );
}