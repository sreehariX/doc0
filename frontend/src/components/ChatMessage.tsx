import { useState } from 'react';
import { type Message } from '../types/chat';
import { ExternalLink, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence} from 'framer-motion';

interface ChatMessageProps {
  message: Message;
}

interface CodeBlockProps {
  language: string;
  value: string;
}

function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-2 rounded-lg bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-100"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
        )}
      </button>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-3 sm:py-6"
    >
      <div className="max-w-2xl mx-auto px-2 sm:px-4">
        <div className={`prose prose-invert prose-pre:bg-gray-900/50 prose-pre:border prose-pre:border-gray-800/50 max-w-none
          prose-p:text-sm sm:prose-p:text-base
          prose-headings:text-base sm:prose-headings:text-lg
          ${message.role === 'user' ? 'inline-block p-3 sm:p-4 bg-gray-800/40 rounded-xl border border-gray-700/50' : ''}`}>
          <ReactMarkdown
            components={{
              a: ({ node, children, href, ...props }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              ),
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <CodeBlock 
                    language={match[1]} 
                    value={String(children).replace(/\n$/, '')} 
                  />
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content.replace(/Source Links:[\s\S]*$/, '')}
          </ReactMarkdown>

          {message.codeBlocks && message.codeBlocks.length > 0 && (
            <div className="mt-4">
              {message.codeBlocks.map((block, index) => (
                <div key={index} className="mt-4">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <CodeBlock 
                            language={match[1]} 
                            value={String(children).replace(/\n$/, '')} 
                          />
                        ) : (
                          <code {...props} className={className}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {block}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          )}
          
          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800/50">
              <p className="text-sm font-medium text-gray-400">Sources:</p>
              <ul className="mt-2 space-y-1">
                {Array.from(new Set(message.sources.map(source => source.url))).map((url, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 break-all"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}