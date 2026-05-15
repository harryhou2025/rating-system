'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
  error: <XCircle className="h-5 w-5 text-red-400" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
  info: <Info className="h-5 w-5 text-sky-400" />,
};

const borderMap: Record<ToastType, string> = {
  success: 'border-l-emerald-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-sky-500',
};

const bgMap: Record<ToastType, string> = {
  success: 'from-emerald-500/10 via-transparent to-transparent',
  error: 'from-red-500/10 via-transparent to-transparent',
  warning: 'from-amber-500/10 via-transparent to-transparent',
  info: 'from-sky-500/10 via-transparent to-transparent',
};

function ToastItem({ data, onDismiss }: { data: ToastData; onDismiss: (id: string) => void }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border border-white/10',
        'bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl',
        'border-l-4',
        borderMap[data.type],
        'animate-slide-down',
        'min-w-[320px] max-w-[420px]',
      )}
      role="alert"
    >
      <div className={cn('shrink-0 p-1 rounded-full bg-gradient-to-br', bgMap[data.type])}>
        {iconMap[data.type]}
      </div>
      <p className="flex-1 text-sm text-white/90 leading-relaxed pt-0.5">{data.message}</p>
      <button
        onClick={() => onDismiss(data.id)}
        className="shrink-0 p-1 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
        aria-label="关闭"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const addToast = React.useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem data={t} onDismiss={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    return {
      toast: () => {
        if (typeof window !== 'undefined') {
          console.warn('Toast used outside of ToastProvider');
        }
      },
    };
  }
  return ctx;
}

export { ToastContext };
export type { ToastType, ToastData };