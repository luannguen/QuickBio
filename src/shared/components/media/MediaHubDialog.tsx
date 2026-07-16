"use client";

import React, { useState } from 'react';
import { X, UploadCloud, Library, ExternalLink } from 'lucide-react';
import { MediaUploader } from './MediaUploader';
import { MediaGallery } from './MediaGallery';
import type { MediaAsset } from '../../api/mediaService';

interface MediaHubDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSelect: (url: string, asset?: MediaAsset) => void;
  initialSelectedUrl?: string;
}

export function MediaHubDialog({ isOpen, onClose, userId, onSelect, initialSelectedUrl }: MediaHubDialogProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [externalUrl, setExternalUrl] = useState('');

  if (!isOpen) return null;

  const handleUploadSuccess = (asset: MediaAsset) => {
    // Tự động chuyển qua tab thư viện sau khi upload thành công
    setActiveTab('library');
    setRefreshTrigger(prev => prev + 1);
    setSelectedAsset(asset);
  };

  const handleConfirmSelect = () => {
    if (selectedAsset) {
      onSelect(selectedAsset.public_url, selectedAsset);
      onClose();
    }
  };

  const handleExternalUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (externalUrl.trim()) {
      onSelect(externalUrl.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Thư Viện Media</h2>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'upload' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <UploadCloud size={18} />
            Tải lên
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'library' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <Library size={18} />
            Kho Ảnh Của Bạn
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-6 bg-neutral-50 dark:bg-neutral-950 min-h-[400px]">
          {activeTab === 'upload' ? (
            <div className="max-w-2xl mx-auto flex flex-col gap-8">
              <MediaUploader userId={userId} onUploadSuccess={handleUploadSuccess} />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-neutral-50 dark:bg-neutral-950 text-sm text-neutral-500">Hoặc dùng URL bên ngoài</span>
                </div>
              </div>

              <form onSubmit={handleExternalUrlSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ExternalLink size={16} className="text-neutral-400" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!externalUrl}
                  className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Dùng URL
                </button>
              </form>
            </div>
          ) : (
            <MediaGallery 
              userId={userId} 
              onSelect={setSelectedAsset} 
              selectedUrl={selectedAsset?.public_url || initialSelectedUrl}
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>

        {/* Footer Actions */}
        {activeTab === 'library' && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900">
            <div className="text-sm text-neutral-500">
              {selectedAsset ? `Đã chọn 1 ảnh (${(selectedAsset.size_bytes / 1024).toFixed(1)} KB)` : 'Chưa chọn ảnh nào'}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-5 py-2 font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleConfirmSelect}
                disabled={!selectedAsset}
                className="px-5 py-2 font-medium bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
              >
                Xác nhận chọn
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
