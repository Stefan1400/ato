import React, { createContext, useContext, useState } from 'react';
import { X, SquareCheck } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
type Toast = { id: number; type: ToastType; message: string };

type ShowToastArgs = { type: ToastType; message: string; duration?: number };

const ToastContext = createContext({ showToast: (opts: ShowToastArgs) => {} });

export const useToast = () => useContext(ToastContext as React.Context<(typeof ToastContext extends React.Context<infer T> ? T : any)>);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  console.log('ToastProvider rendered');
  
   const [toasts, setToasts] = useState<Toast[]>([]);

  function removeToast(id: number) {
    setToasts((t) => t.filter((x) => x.id !== id));
  }

  const showToast = ({ type, message, duration = 3000 }: ShowToastArgs) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, message }]);

    window.setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed left-0 right-0 top-16 flex flex-col items-center gap-2 z-700 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto w-full max-w-3xl bg-[#171717] border border-[#2E2E2E] flex items-center justify-between text-white px-4 py-3"
          >
            <div className="flex items-center gap-4">
              <SquareCheck className={`${toast.type === 'success' ? 'text-[#00C851]' : toast.type === 'error' ? 'text-[#FF5252]' : 'text-white'}`} />
              
              <div className={`${toast.type === 'success' ? 'text-[#00C851]' : toast.type === 'error' ? 'text-[#FF5252]' : 'text-white'}`}>
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-xl leading-none"
              aria-label="close-toast"
            >
              <X />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastContext;
