import React from 'react';
import { useModalStore } from '@/shared/stores/useModalStore';
import { ConfirmDialog } from './ConfirmDialog';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] h-[95vh]'
};

export const ModalProvider: React.FC = () => {
  const { modals, closeModal } = useModalStore();

  return (
    <>
      <AnimatePresence>
        {modals.map((modal, index) => {
          const isTopMost = index === modals.length - 1;
          
          return (
            <div 
              key={modal.id} 
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
              style={{ zIndex: 100 + index }} // Tăng dần z-index nếu mở nhiều modal chồng nhau
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => isTopMost && closeModal(modal.id)}
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className={`relative bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full flex flex-col overflow-hidden ${sizeMap[modal.size || 'md']}`}
              >
                {(modal.title || !modal.hideCloseButton) && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                    <h3 className="text-lg font-semibold text-white">
                      {modal.title}
                    </h3>
                    {!modal.hideCloseButton && (
                      <button
                        onClick={() => closeModal(modal.id)}
                        className="text-zinc-400 hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
                
                <div className={`p-6 overflow-y-auto ${modal.size === 'full' ? 'flex-1' : 'max-h-[80vh]'}`}>
                  {modal.component}
                </div>
              </motion.div>
            </div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        <ConfirmDialog />
      </AnimatePresence>
    </>
  );
};
