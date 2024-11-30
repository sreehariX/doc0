import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function LoadingState() {
  const [loadingStage, setLoadingStage] = useState(0);
  const stages = [
    "Searching documentation...",
    "Summarizing content...",
    "Generating response..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingStage((prev) => (prev + 1) % stages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen space-y-8 py-12"
    >
      <div className="relative scale-125">
       
        <motion.div 
          className="h-24 w-24 rounded-full border-4 border-blue-500/20"
          animate={{
            rotate: 360,
            borderColor: ['rgba(59, 130, 246, 0.2)', 'rgba(147, 51, 234, 0.2)'],
          }}
          transition={{
            duration: 3,
            ease: "linear",
            repeat: Infinity,
          }}
        />
        
       
        <motion.div 
          className="absolute inset-0 h-20 w-20 m-auto rounded-full border-4 border-purple-500/30"
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1],
            borderColor: ['rgba(147, 51, 234, 0.3)', 'rgba(59, 130, 246, 0.3)'],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

       
        <motion.div 
          className="absolute inset-0 h-14 w-14 m-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
          animate={{
            scale: [0.8, 1, 0.8],
            rotate: 180,
            background: ['linear-gradient(to right, #3B82F6, #9333EA)', 'linear-gradient(to left, #3B82F6, #9333EA)'],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>

      <div className="text-center space-y-4">
        <motion.p
          key={loadingStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-base font-medium text-gray-300"
        >
          {stages[loadingStage]}
        </motion.p>
        <motion.div 
          className="h-2 w-48 bg-gray-700 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            animate={{
              x: [-192, 192],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}