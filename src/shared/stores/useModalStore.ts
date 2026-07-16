import { create } from 'zustand';
import React from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalConfig {
  id: string;
  component: React.ReactNode;
  size?: ModalSize;
  title?: string;
  hideCloseButton?: boolean;
  onClose?: () => void;
}

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ModalState {
  modals: ModalConfig[];
  confirmConfig: ConfirmConfig | null;
  openModal: (modal: Omit<ModalConfig, 'id'> & { id?: string }) => void;
  closeModal: (id: string) => void;
  closeAll: () => void;
  
  // Confirmation Dialog
  requestConfirm: (config: ConfirmConfig) => void;
  resolveConfirm: (isConfirmed: boolean) => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  modals: [],
  confirmConfig: null,

  openModal: (modalConfig) => {
    const id = modalConfig.id || Math.random().toString(36).substring(2, 9);
    set((state) => {
      // If modal with same id exists, replace it, else push
      const existingIdx = state.modals.findIndex(m => m.id === id);
      if (existingIdx >= 0) {
        const newModals = [...state.modals];
        newModals[existingIdx] = { ...modalConfig, id };
        return { modals: newModals };
      }
      return { modals: [...state.modals, { ...modalConfig, id }] };
    });
  },

  closeModal: (id) => {
    set((state) => {
      const modal = state.modals.find(m => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      return { modals: state.modals.filter(m => m.id !== id) };
    });
  },

  closeAll: () => {
    const state = get();
    state.modals.forEach(m => {
      if (m.onClose) m.onClose();
    });
    set({ modals: [] });
  },

  requestConfirm: (config) => {
    set({ confirmConfig: config });
  },

  resolveConfirm: (isConfirmed) => {
    const { confirmConfig } = get();
    if (confirmConfig) {
      if (isConfirmed) {
        confirmConfig.onConfirm();
      } else if (confirmConfig.onCancel) {
        confirmConfig.onCancel();
      }
    }
    set({ confirmConfig: null });
  }
}));

// Custom hook to await a confirmation easily
export const useConfirm = () => {
  const requestConfirm = useModalStore((state) => state.requestConfirm);
  
  return (config: Omit<ConfirmConfig, 'onConfirm' | 'onCancel'>): Promise<boolean> => {
    return new Promise((resolve) => {
      requestConfirm({
        ...config,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };
};
