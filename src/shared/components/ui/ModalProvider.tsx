import React from 'react';
import { useModalStore } from '@/shared/stores/useModalStore';
import { ConfirmDialog } from './ConfirmDialog';
import { ResponsiveModal } from '@/shared/ui/ResponsiveModal';

export const ModalProvider: React.FC = () => {
  const { modals, closeModal } = useModalStore();

  return (
    <>
      {modals.map((modal, index) => {
        // We ensure zIndex layering by setting style directly if needed, but ResponsiveModal has z-[60] fixed.
        // It should be fine as ResponsiveModal uses Portals or is just rendered in order.
        return (
          <ResponsiveModal
            key={modal.id}
            isOpen={true}
            onClose={() => closeModal(modal.id)}
            title={modal.title}
          >
            {modal.component}
          </ResponsiveModal>
        );
      })}

      <ConfirmDialog />
    </>
  );
};
