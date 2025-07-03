'use client';

import { useEffect, useCallback, useRef } from 'react';

type Props = {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Notification({ message, type = 'error', onClose, duration = 3000 }: Props) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Ajuster la durée selon le type
  const adjustedDuration = type === 'success' ? Math.max(duration, 2500) : duration;

  const handleClose = useCallback(() => {
    if (mountedRef.current) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Créer un nouveau timer
    timerRef.current = setTimeout(handleClose, adjustedDuration);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleClose, adjustedDuration]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
    <div className={`fixed top-4 right-4 z-[60] ${getTypeStyles()} text-white px-4 py-3 rounded-lg shadow-lg border-l-4 min-w-[300px] max-w-[400px] animate-slide-in`}>
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
      <div className={`absolute bottom-0 left-0 h-1 ${type === 'error' ? 'bg-red-300' : type === 'success' ? 'bg-green-300' : 'bg-blue-300'} animate-progress${type === 'success' ? ' success' : ''}`}></div>
    </div>
  );
}
