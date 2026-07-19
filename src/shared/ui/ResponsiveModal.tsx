import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { cn } from '@/shared/lib/utils';

export interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string; // Additional classes for the modal body content
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className
}) => {
  const isMobile = useIsMobile();
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If swiped down fast enough or dragged more than 100px down
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          />

          {/* Modal Container */}
          {isMobile ? (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
              className={cn(
                "relative w-full max-h-[95vh] bg-[#111] border-t border-white/10 rounded-t-3xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden",
                className
              )}
            >
              {/* Drag Handle for Swipe-to-close */}
              <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none shrink-0">
                <div className="w-12 h-1.5 bg-white/20 rounded-full" />
              </div>

              {/* Header */}
              {title && (
                <div className="px-6 pb-4 pt-1 flex items-center justify-between border-b border-white/5 shrink-0">
                  <div className="font-bold text-lg text-white">{title}</div>
                  <button onClick={onClose} className="p-2 -mr-2 text-white/50 hover:text-white rounded-full hover:bg-white/5 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="p-6 overflow-y-auto overscroll-none flex-1">
                {children}
              </div>

              {/* Sticky Footer */}
              {footer && (
                <div className="sticky bottom-0 bg-[#111]/95 backdrop-blur-xl p-4 border-t border-white/10 z-10 pb-8 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
                  {footer}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl shadow-2xl flex flex-col pointer-events-auto max-h-[85vh] overflow-hidden",
                className
              )}
            >
              {/* Header */}
              {title && (
                <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 shrink-0">
                  <div className="font-bold text-lg text-white">{title}</div>
                  <button onClick={onClose} className="p-2 -mr-2 text-white/50 hover:text-white rounded-full hover:bg-white/5 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="p-6 overflow-y-auto overscroll-none flex-1">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 bg-black/20 border-t border-white/5 shrink-0">
                  {footer}
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
