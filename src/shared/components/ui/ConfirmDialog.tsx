import React from 'react';
import { useModalStore } from '@/shared/stores/useModalStore';
import { AlertTriangle, Info, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ConfirmDialog: React.FC = () => {
  const { confirmConfig, resolveConfirm } = useModalStore();

  if (!confirmConfig) return null;

  const { title, message, variant = 'danger', confirmText = 'Xác nhận', cancelText = 'Hủy' } = confirmConfig;

  const iconMap = {
    danger: <XCircle className="w-6 h-6 text-red-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />
  };

  const buttonMap = {
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    info: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => resolveConfirm(false)}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-0.5">
              {iconMap[variant]}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-zinc-400 text-sm whitespace-pre-line">{message}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border-t border-zinc-800 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => resolveConfirm(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => resolveConfirm(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 ${buttonMap[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
