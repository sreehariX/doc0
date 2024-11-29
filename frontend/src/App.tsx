import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LoadingState } from './components/LoadingState';
import type { Framework, Message, ChatResponse } from './types/chat';

interface FrameworkMessages {
  [key: string]: Message[];
}

export default function App() {
  const [framework, setFramework] = useState<Framework>('react');
  const [messagesPerFramework, setMessagesPerFramework] = useState<FrameworkMessages>({
    react: [],
    angular: [],
    astro: [],
    vue: []
  });
  const [loading, setLoading] = useState(false);

  // Get current framework's messages
  const messages = messagesPerFramework[framework];

  const handleFrameworkChange = (newFramework: Framework) => {
    setFramework(newFramework);
  };

  const handleSend = async (message: string) => {
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    // Update messages for current framework only
    setMessagesPerFramework(prev => ({
      ...prev,
      [framework]: [...prev[framework], userMessage]
    }));
    
    setLoading(true);

    if (framework !== 'astro') {
      const assistantMessage: Message = {
        role: 'assistant',
        content: `Currently, we only support Astro documentation. Support for ${framework} coming soon!`,
        timestamp: new Date().toISOString(),
      };
      
      setMessagesPerFramework(prev => ({
        ...prev,
        [framework]: [...prev[framework], assistantMessage]
      }));
      
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ChatResponse = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.summary,
        sources: data.results.map(result => ({
          title: result.metadata.techStackName || 'Astro Documentation',
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
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please check your connection and try again.',
        timestamp: new Date().toISOString(),
      };
      
      setMessagesPerFramework(prev => ({
        ...prev,
        [framework]: [...prev[framework], errorMessage]
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        selectedFramework={framework} 
        onFrameworkSelect={handleFrameworkChange}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center px-4">
              <div className="max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Chat with {framework.charAt(0).toUpperCase() + framework.slice(1)} Documentation
                </h2>
                <p className="text-gray-500">
                  Ask questions about {framework} and get answers backed by official documentation.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))
          )}
          {loading && <LoadingState />}
        </div>
        <ChatInput 
          onSend={handleSend} 
          disabled={loading}
          placeholder={`Ask about ${framework}...`}
        />
      </main>
    </div>
  );
}