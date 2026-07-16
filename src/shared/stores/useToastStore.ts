import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number; // ms
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  // Helpers
  success: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  
  addToast: (toastProps) => {
    const id = generateId();
    const newToast = { ...toastProps, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove unless duration is explicitly 0 (keep forever)
    const duration = toastProps.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  success: (message, title, duration) =>
    set((state) => {
      state.addToast({ type: 'success', message, title, duration });
      return state;
    }),
    
  error: (message, title, duration) =>
    set((state) => {
      state.addToast({ type: 'error', message, title, duration: duration ?? 6000 }); // Errors stay longer by default
      return state;
    }),
    
  warning: (message, title, duration) =>
    set((state) => {
      state.addToast({ type: 'warning', message, title, duration });
      return state;
    }),
    
  info: (message, title, duration) =>
    set((state) => {
      state.addToast({ type: 'info', message, title, duration });
      return state;
    }),
}));
