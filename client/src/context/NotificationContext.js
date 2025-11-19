import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle, Info, X, XCircle } from 'lucide-react';

const NotificationContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const toneClasses = {
  success: 'bg-emerald-600/95 text-white border border-emerald-400/40',
  error: 'bg-rose-600/95 text-white border border-rose-400/40',
  info: 'bg-slate-800/95 text-white border border-slate-600/60',
};

const ToastHost = ({ toast, onDismiss }) => {
  const Icon = toast ? ICONS[toast.type] ?? ICONS.info : null;
  return (
    <div className="fixed top-6 right-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-3 rounded-2xl px-4 py-3 shadow-2xl shadow-black/30 ${toneClasses[toast.type]}`}
          >
            {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0" />}
            <div className="text-sm font-medium">{toast.message}</div>
            <button
              onClick={onDismiss}
              className="ms-2 rounded-full p-1 text-white/70 hover:text-white transition"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const dismiss = useCallback(() => setToast(null), []);

  const notify = useCallback((message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
    const timer = setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastHost toast={toast} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

