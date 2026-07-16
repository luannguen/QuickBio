"use client";

import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import type { MediaAsset } from '../../api/mediaService';
import { MediaHubDialog } from './MediaHubDialog';

interface MediaPickerProps {
  userId: string;
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function MediaPicker({ userId, value, onChange, label = 'Ảnh', className = '' }: MediaPickerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelect = (url: string, _asset?: MediaAsset) => {
    onChange(url);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>}
      
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 aspect-video w-full max-w-sm">
          <img 
            src={value} 
            alt="Selected preview" 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="px-4 py-2 bg-white text-neutral-900 font-medium rounded-lg shadow-sm hover:bg-neutral-100 transition-colors text-sm"
            >
              Đổi ảnh
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors"
              title="Xóa ảnh"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 hover:border-primary hover:bg-primary/5 transition-all w-full max-w-sm text-neutral-500 hover:text-primary"
        >
          <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center group-hover:bg-primary/10">
            <ImageIcon size={24} />
          </div>
          <span className="font-medium text-sm">Bấm để chọn hoặc tải ảnh lên</span>
        </button>
      )}

      {/* Render Dialog in Portal/Body conceptually (handled by fixed positioning) */}
      <MediaHubDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        userId={userId}
        onSelect={handleSelect}
        initialSelectedUrl={value}
      />
    </div>
  );
}
