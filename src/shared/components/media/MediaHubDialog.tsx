import React, { useState } from 'react';
import { UploadCloud, Library, ExternalLink } from 'lucide-react';
import { MediaUploader } from './MediaUploader';
import { MediaGallery } from './MediaGallery';
import type { MediaAsset } from '../../api/mediaService';
import { ResponsiveModal } from '@/shared/ui/ResponsiveModal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

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

  const footer = activeTab === 'library' ? (
    <div className="flex justify-between items-center w-full gap-3">
      <div className="text-[10px] sm:text-sm text-neutral-500 truncate hidden sm:block">
        {selectedAsset ? `Đã chọn 1 ảnh (${(selectedAsset.size_bytes / 1024).toFixed(1)} KB)` : 'Chưa chọn ảnh nào'}
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button 
          onClick={onClose}
          variant="secondary"
          className="flex-1 sm:flex-none"
        >
          Hủy
        </Button>
        <Button 
          onClick={handleConfirmSelect}
          disabled={!selectedAsset}
          className="flex-1 sm:flex-none"
        >
          Xác nhận chọn
        </Button>
      </div>
    </div>
  ) : null;

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thư Viện Media"
      footer={footer}
      className="max-w-4xl p-0"
    >
      {/* Tabs */}
      <div className="flex px-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 shrink-0 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'upload' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
          }`}
        >
          <UploadCloud size={16} />
          Tải lên
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'library' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
          }`}
        >
          <Library size={16} />
          Kho Ảnh Của Bạn
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-neutral-50 dark:bg-neutral-950 min-h-[300px] sm:min-h-[400px]">
        {activeTab === 'upload' ? (
          <div className="max-w-2xl mx-auto flex flex-col gap-6 sm:gap-8">
            <MediaUploader userId={userId} onUploadSuccess={handleUploadSuccess} />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-neutral-50 dark:bg-neutral-950 text-xs sm:text-sm text-neutral-500">Hoặc dùng URL bên ngoài</span>
              </div>
            </div>

            <form onSubmit={handleExternalUrlSubmit} className="flex gap-2 flex-col sm:flex-row">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ExternalLink size={16} className="text-neutral-400" />
                </div>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="w-full pl-9 h-10"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                />
              </div>
              <Button 
                type="submit"
                disabled={!externalUrl}
                className="h-10"
              >
                Dùng URL
              </Button>
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
    </ResponsiveModal>
  );
}
