import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LoadingState } from './components/LoadingState';
import type { Framework, Message, ChatResponse } from './types/chat';
import { getCollectionName } from './components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

interface FrameworkMessages {
  [key: string]: Message[];
}

export default function App() {
  const [framework, setFramework] = useState<Framework>('react');
  const [messagesPerFramework, setMessagesPerFramework] = useState<FrameworkMessages>({
    react: [],
    nextjs: [],
    astro: [],
    kestra: [],
    redux: []
  });
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Get current framework's messages
  const messages = messagesPerFramework[framework];

  const handleFrameworkChange = (newFramework: Framework) => {
    setFramework(newFramework);
  };

  const handleSend = async (message: string) => {
    if (!hasInteracted) setHasInteracted(true);
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessagesPerFramework(prev => ({
      ...prev,
      [framework]: [...prev[framework], userMessage]
    }));
    
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: message,
          collection_name: getCollectionName(framework)
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ChatResponse = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.summary,
        sources: data.results.map(result => ({
          title: result.metadata.techStackName || `${framework.charAt(0).toUpperCase() + framework.slice(1)} Documentation`,
          url: result.metadata.url,
        })),
        timestamp: data.timestamp,
        codeBlocks: data.results
          .filter(result => result.document.includes('```'))
          .map(result => result.document),
      };
      
      setMessagesPerFramework(prev => ({
        ...prev,
        [framework]: [...prev[framework], assistantMessage]
      }));
    } catch (error) {
      console.error('Failed to fetch response:', error);
      
      let errorMessage = 'Sorry, there was an error processing your request. Please check your connection and try again.';
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date().toISOString(),
      };
      
      setMessagesPerFramework(prev => ({
        ...prev,
        [framework]: [...prev[framework], assistantMessage]
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar 
        selectedFramework={framework} 
        onFrameworkSelect={handleFrameworkChange}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800/50 scrollbar-track-gray-900">
          <AnimatePresence>
            {!hasInteracted ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex items-center justify-center"
              >
                <div className="max-w-2xl mx-auto px-4 text-center">
                  <h1 className="text-4xl font-bold text-white mb-4">
                    Chat with {framework.charAt(0).toUpperCase() + framework.slice(1)}
                  </h1>
                  <p className="text-gray-400 text-lg mb-8">
                    Ask questions about {framework} and get answers backed by official documentation.
                  </p>
                  <div className="max-w-xl mx-auto">
                    <ChatInput 
                      onSend={handleSend} 
                      disabled={loading}
                      placeholder={`Ask about ${framework}...`}
                      centered={true}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pb-24"
              >
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                {loading && <LoadingState />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {hasInteracted && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-xl border-t border-gray-800/50"
          >
            <ChatInput 
              onSend={handleSend} 
              disabled={loading}
              placeholder={`Ask about ${framework}...`}
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}