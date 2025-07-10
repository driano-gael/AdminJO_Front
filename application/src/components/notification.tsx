'use client';

import { useEffect, useCallback, useRef, useState } from 'react';

type Props = {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Notification({ message, type = 'error', onClose, duration = 1000 }: Props) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    console.log('🔔 handleClose appelé dans Notification');
    
    // Déclencher l'animation de sortie
    setIsExiting(true);
    
    // Attendre la fin de l'animation (300ms) puis fermer réellement
    setTimeout(() => {
      console.log('🔔 Calling onClose after exit animation');
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    console.log('🔔 Setting up timer with duration:', duration);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      console.log('🔔 Timer expired, calling handleClose');
      handleClose();
    }, duration);

    return () => {
      if (timerRef.current) {
        console.log('🔔 Cleaning up timer');
        clearTimeout(timerRef.current);
      }
    };
  }, [handleClose, duration]);

  const getTypeStyles = useCallback(() => {
    switch (type) {
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      default:
        return 'bg-red-500 border-red-600';
    }
  }, [type]);

  return (
    <div 
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] ${getTypeStyles()} text-white px-4 py-3 rounded-lg shadow-lg border-l-4 min-w-[300px] max-w-[400px] transition-all duration-300 ease-in-out ${
        isExiting 
          ? 'animate-slide-out' 
          : 'animate-slide-in'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={handleClose}
          className="ml-3 text-white hover:text-gray-200 font-bold text-lg"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>
      <div 
        className={`absolute bottom-0 left-0 h-1 ${type === 'error' ? 'bg-red-300' : type === 'success' ? 'bg-green-300' : 'bg-blue-300'}`}
        style={{
          animation: `progress ${duration}ms linear forwards`,
          animationPlayState: isExiting ? 'paused' : 'running'
        }}
      ></div>
    </div>
  );
}
