import React, { createContext, useContext, useState } from 'react';
import { X, CircleCheck, CircleX, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
type Toast = { id: number; type: ToastType; message: string };

type ShowToastArgs = { type: ToastType; message: string; duration?: number };

const ToastContext = createContext({ showToast: (opts: ShowToastArgs) => {} });

export const useToast = () => useContext(ToastContext as React.Context<(typeof ToastContext extends React.Context<infer T> ? T : any)>);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  console.log('ToastProvider rendered');
  
   const [toasts, setToasts] = useState<Toast[]>([{ id: 1, type: 'success', message: 'Session added' }]);

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

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-3/4 md:w-1/2 lg:w-1/5 lg:left-auto lg:translate-x-0 lg:right-10 lg:top-20 flex flex-col items-center gap-2 z-700 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="
              pointer-events-auto
              w-full max-w-3xl
              bg-[#171717]/90
              backdrop-blur-md
              rounded-xl
              flex items-center justify-between gap-5
              text-white
              px-6 py-3
              
              shadow-[0_0_30px_rgba(0,0,0,0.4)]
            "
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">

              {/* ICON WRAPPER WITH GLOW */}
              
                {toast.type === 'success' && (
                  <CircleCheck className="text-[#00C851] drop-shadow-[0_0_6px_rgba(0,200,81,0.2)]" />
                )}
                {toast.type === 'error' && (
                  <CircleX className="text-[#FF5252] drop-shadow-[0_0_6px_rgba(255,82,82,0.2)]" />
                )}
                {toast.type === 'info' && (
                  <Info className="text-white/90 drop-shadow-[0_0_6px_rgba(255,255,255,0.1)]" />
                )}

              {/* MESSAGE */}
              <div
                className={`
                  text-xs lg:text-sm font-medium tracking-wide
                  ${
                    toast.type === 'success'
                      ? 'text-[#00C851]'
                      : toast.type === 'error'
                      ? 'text-[#FF5252]'
                      : 'text-white/90'
                  }
                  drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]
                `}
              >
                {toast.message}
              </div>
            </div>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => removeToast(toast.id)}
              className="
                text-white/40 hover:text-white
                p-2 rounded-md
                transition
                hover:bg-white/5
                hover:shadow-[0_0_10px_rgba(255,255,255,0.15) cursor-pointer
              "
              aria-label="close-toast"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastContext;
