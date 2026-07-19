import React from 'react';
import { useModalStore } from '@/shared/stores/useModalStore';
import { AlertTriangle, Info, XCircle } from 'lucide-react';
import { ResponsiveModal } from '@/shared/ui/ResponsiveModal';

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
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500 text-white',
    info: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white'
  };

  const footer = (
    <div className="flex justify-end gap-3 w-full">
      <button
        onClick={() => resolveConfirm(false)}
        className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex-1 sm:flex-none"
      >
        {cancelText}
      </button>
      <button
        onClick={() => resolveConfirm(true)}
        className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 flex-1 sm:flex-none ${buttonMap[variant]}`}
      >
        {confirmText}
      </button>
    </div>
  );

  return (
    <ResponsiveModal
      isOpen={!!confirmConfig}
      onClose={() => resolveConfirm(false)}
      title={title}
      footer={footer}
      className="max-w-md p-0"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">
          {iconMap[variant]}
        </div>
        <div className="flex-1">
          <p className="text-zinc-400 text-sm whitespace-pre-line">{message}</p>
        </div>
      </div>
    </ResponsiveModal>
  );
};
