import { useState, useEffect, type MouseEvent } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizeHandleProps {
  onResize: (width: number) => void;
}

export function ResizeHandle({ onResize }: ResizeHandleProps) {
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(200, Math.min(600, e.clientX));
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onResize]);

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  return (
    <div
      className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize group flex items-center justify-center hover:bg-gray-800"
      onMouseDown={handleMouseDown}
    >
      <div className={`w-0.5 h-8 bg-gray-600 group-hover:bg-blue-500 transition-colors ${isResizing ? 'bg-blue-500' : ''}`} />
      <GripVertical className="absolute text-gray-400 group-hover:text-blue-500 w-4 h-4" />
    </div>
  );
}