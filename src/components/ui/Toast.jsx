import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
const ToastContext = createContext(undefined);
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    const showToast = useCallback((type, title, message) => {
        const id = `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        setToasts((prev) => [...prev, { id, type, title, message }]);
        // Auto-remove after 4 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, [removeToast]);
    return (<ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => {
            const icons = {
                success: <CheckCircle2 className="h-5 w-5 text-emerald-500"/>,
                warning: <AlertTriangle className="h-5 w-5 text-amber-500"/>,
                error: <AlertCircle className="h-5 w-5 text-rose-500"/>,
                info: <Info className="h-5 w-5 text-blue-500"/>
            };
            const borderColors = {
                success: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/90 dark:bg-emerald-950/20',
                warning: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/90 dark:bg-amber-950/20',
                error: 'border-rose-200 dark:border-rose-900/50 bg-rose-50/90 dark:bg-rose-950/20',
                info: 'border-blue-200 dark:border-blue-900/50 bg-blue-50/90 dark:bg-blue-950/20'
            };
            return (<motion.div key={toast.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }} layout className={`p-4 border rounded-xl shadow-lg flex gap-3 backdrop-blur-md transition-colors ${borderColors[toast.type]}`}>
                <div className="flex-shrink-0">{icons[toast.type]}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {toast.title}
                  </h4>
                  {toast.message && (<p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                      {toast.message}
                    </p>)}
                </div>
                <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 self-start p-0.5 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">
                  <X className="h-4 w-4"/>
                </button>
              </motion.div>);
        })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>);
};
