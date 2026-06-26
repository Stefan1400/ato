import React, { createContext, useContext, useCallback, useState } from 'react';
import { CheckmarkIcon } from '../assets/svgs';
import { X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
type Toast = { id: number; type: ToastType; message: string };

type ShowToastArgs = { type: ToastType; message: string; duration?: number };

const ToastContext = createContext({ showToast: (opts: ShowToastArgs) => {} });

export const useToast = () => useContext(ToastContext as React.Context<(typeof ToastContext extends React.Context<infer T> ? T : any)>);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback(({ type, message, duration = 3000 }: ShowToastArgs) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, message }]);

    window.setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed left-0 right-0 top-16 flex flex-col items-center gap-2 z-1001 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto w-full max-w-3xl bg-[#171717] border border-[#2E2E2E] flex items-center justify-between text-white px-4 py-3"
          >
            <div className="flex items-center gap-4">
              <CheckmarkIcon />
              <div className={`${toast.type === 'success' ? 'text-[#00C851]' : toast.type === 'error' ? 'text-[#FF5252]' : 'text-white'}`}>
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-xl leading-none"
              aria-label="close-toast"
            >
              <X className="text-[#00C851]" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastContext;
