"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Zap, 
  Book,
  Bot,
  Database, 
  Lock,
  History,
  Code, 
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      delayChildren: 0.2,
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

// Feature data
const features = [
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Natural Language Conversations",
    description: "Engage with documentation in a conversational way. Ask questions in plain English and get clear, contextual answers."
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: "Semantic Search",
    description: "Our AI understands what you're looking for, not just matching keywords. Find exactly what you need, even if you don't know the exact terminology."
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Lightning Fast",
    description: "Get instant answers to your documentation questions. No more wasting time reading through pages of documentation."
  },
  {
    icon: <Book className="h-8 w-8" />,
    title: "Universal Documentation Support",
    description: "Works with all your documentation sources: Markdown, HTML, PDF, or even custom formats - we've got you covered."
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: "AI-Powered Understanding",
    description: "Leveraging advanced AI models to understand both your questions and documentation content at a deeper level."
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: "Custom Knowledge Base",
    description: "Import your own documentation and create a personalized knowledge base tailored to your specific needs."
  },
  {
    icon: <Lock className="h-8 w-8" />,
    title: "Secure & Private",
    description: "Your documentation and conversations are treated with the utmost security. We don't store or use your data for training."
  },
  {
    icon: <History className="h-8 w-8" />,
    title: "Conversation History",
    description: "Easily refer back to previous conversations with full context preservation. Pick up right where you left off."
  },
  {
    icon: <Code className="h-8 w-8" />,
    title: "Code Examples",
    description: "Get relevant code samples directly in your answers, with proper syntax highlighting and explanations."
  }
];

export default function FeaturesPage() {
  return (
    <AuroraBackground>
      <NavbarWrapper>
        <div className="pt-16 pb-16">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
            >
              Features
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light"
            >
              Powerful tools to transform how you interact with documentation
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  whileHover={{ y: -8 }}
                  className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 flex flex-col"
                >
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-black">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-300 flex-grow leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* CTA Section */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-10 md:p-16 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to experience it yourself?</h2>
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
                Start using Doc0 today and revolutionize your documentation experience.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Link href="/chat" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-black bg-white hover:bg-gray-200 transition-colors">
                  Try It Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Simple Footer */}
          <footer className="py-12 border-t border-gray-800/50 bg-black/30 backdrop-blur-sm mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Doc0. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </NavbarWrapper>
    </AuroraBackground>
  );
} 