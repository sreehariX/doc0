"use client";

import React from 'react';
import Link from 'next/link';
import { CheckIcon, XIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { NavbarWrapper } from '@/components/ui/navbar-wrapper';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    }
  }),
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Price card interface
interface PriceCardProps {
  title: string;
  price: string;
  features: { name: string; included: boolean }[];
  cta: string;
  popular?: boolean;
  index: number;
}

const PriceCard = ({ title, price, features, cta, popular, index }: PriceCardProps) => {
  return (
    <motion.div 
      custom={index} 
      initial="hidden" 
      animate="visible" 
      variants={fadeIn}
      whileHover={{ y: -10 }}
      className={`relative rounded-2xl p-6 md:p-8 shadow-xl ${
        popular 
          ? 'bg-black border-2 border-gray-600'
          : 'bg-zinc-900/70 backdrop-blur-sm border border-gray-800'
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black font-medium py-1 px-4 rounded-full text-sm shadow-lg">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <div className="mt-4">
        <span className="text-4xl font-extrabold text-white">{price}</span>
        {price !== 'Custom' && (
          <span className="ml-2 text-gray-400">/month</span>
        )}
      </div>
      <motion.ul 
        className="mt-6 space-y-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, i) => (
          <motion.li 
            key={i} 
            className="flex items-start"
            variants={item}
          >
            <div className="flex-shrink-0 mr-2 mt-1 text-gray-400">
              {feature.included ? (
                <CheckIcon className="h-5 w-5 text-white" />
              ) : (
                <XIcon className="h-5 w-5 text-gray-500" />
              )}
            </div>
            <span className="text-gray-300">{feature.name}</span>
          </motion.li>
        ))}
      </motion.ul>
      <div className="mt-8">
        <Link href="/chat">
          <Button 
            className={`w-full py-6 rounded-xl text-base font-semibold ${
              popular
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-gray-700'
            }`}
          >
            {cta}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default function PricingPage() {
  // Plans data
  const plans = [
    {
      title: 'Free',
      price: '$0',
      features: [
        { name: 'Basic Documentation Search', included: true },
        { name: 'Up to 100 queries per month', included: true },
        { name: 'Community Support', included: true },
        { name: 'Chat History (7 days)', included: true },
        { name: 'Advanced Search Operators', included: false },
        { name: 'Custom Documentation Import', included: false },
        { name: 'API Access', included: false },
        { name: 'Priority Support', included: false },
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      title: 'Basic',
      price: '$10',
      features: [
        { name: 'Advanced Documentation Search', included: true },
        { name: 'Up to 1,000 queries per month', included: true },
        { name: 'Email Support', included: true },
        { name: 'Chat History (30 days)', included: true },
        { name: 'Advanced Search Operators', included: true },
        { name: 'Custom Documentation Import', included: true },
        { name: 'API Access (500 requests/day)', included: false },
        { name: 'Priority Support', included: false },
      ],
      cta: 'Subscribe Now',
      popular: true,
    },
    {
      title: 'Pro',
      price: '$20',
      features: [
        { name: 'Everything in Basic', included: true },
        { name: 'Unlimited queries', included: true },
        { name: 'Priority Email Support', included: true },
        { name: 'Chat History (Unlimited)', included: true },
        { name: 'Advanced Search Operators', included: true },
        { name: 'Custom Documentation Import', included: true },
        { name: 'API Access (1,000 requests/day)', included: true },
        { name: 'Priority Support', included: true },
      ],
      cta: 'Go Pro',
      popular: false,
    },
  ];

  return (
    <AuroraBackground>
      <NavbarWrapper>
        {/* Main Content with proper padding for the fixed navbar */}
        <div className="pt-16 pb-12">
          {/* Page Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative z-10">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
              >
                Simple, Transparent Pricing
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light"
              >
                Choose the plan that's right for you and start interacting with your documentation in a whole new way.
              </motion.p>
            </div>

            {/* Pricing Cards */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <PriceCard 
                  key={index}
                  index={index}
                  title={plan.title}
                  price={plan.price}
                  features={plan.features}
                  cta={plan.cta}
                  popular={plan.popular}
                />
              ))}
            </div>
            
            {/* FAQ Section */}
            <div className="mt-24 max-w-6xl mx-auto">
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-center mb-12"
              >
                Frequently Asked Questions
              </motion.h2>
              
              <motion.div 
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {[
                  {
                    question: "Can I change plans later?",
                    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes to your subscription will be applied immediately."
                  },
                  {
                    question: "How does the query limit work?",
                    answer: "A query is counted each time you ask a question to the documentation chat. Queries are reset at the beginning of each billing cycle."
                  },
                  {
                    question: "Can I import my own documentation?",
                    answer: "Yes, Basic and Pro plans allow you to import custom documentation. We support various formats including Markdown, HTML, and PDF."
                  },
                  {
                    question: "What is the refund policy?",
                    answer: "We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, you can request a full refund within this period."
                  },
                  {
                    question: "Do you offer discounts?",
                    answer: "We offer discounts for educational institutions, nonprofits, and startups. Contact our sales team for more information."
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards and PayPal."
                  }
                ].map((faq, index) => (
                  <motion.div 
                    key={index}
                    variants={item}
                    className="bg-zinc-900/70 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                  >
                    <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-10 md:p-16 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your documentation experience?</h2>
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
                Join thousands of developers who have made Doc0 an essential part of their workflow.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/chat" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-black bg-white hover:bg-gray-200 transition-colors">
                  Try for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <p className="mt-4 text-sm text-gray-400">No credit card required</p>
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
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Resources</h3>
                  <ul className="space-y-2">
                    <li><Link href="/docs" className="text-gray-400 hover:text-white">Documentation</Link></li>
                    <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                    <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
                  </ul>
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <h3 className="text-lg font-semibold mb-4">Connect</h3>
                  <ul className="space-y-2">
                    <li><Link href="https://twitter.com/doc0ai" className="text-gray-400 hover:text-white">Twitter</Link></li>
                    <li><Link href="https://github.com/doc0ai" className="text-gray-400 hover:text-white">GitHub</Link></li>
                    <li><Link href="mailto:hello@doc0.ai" className="text-gray-400 hover:text-white">Contact</Link></li>
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