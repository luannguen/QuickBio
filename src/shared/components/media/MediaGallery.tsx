"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { mediaService } from '../../api/mediaService';
import type { MediaAsset } from "@/shared/api/mediaService";
import { useToastStore } from "@/shared/stores/useToastStore";
import { useConfirm } from "@/shared/stores/useModalStore";

interface MediaGalleryProps {
  userId: string;
  onSelect?: (asset: MediaAsset) => void;
  selectedUrl?: string; // Để highlight ảnh đang chọn
  refreshTrigger?: number; // Truyền vào số đếm để force refresh lại list
}

export function MediaGallery({ userId, onSelect, selectedUrl, refreshTrigger = 0 }: MediaGalleryProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toast = useToastStore();
  const confirm = useConfirm();

  const fetchMedia = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mediaService.getMediaGallery(userId);
      setAssets(data);
    } catch (err: any) {
      console.error(err);
      setError('Không thể tải thư viện ảnh. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMedia();
    }
  }, [userId, refreshTrigger]);

  const handleDelete = async (e: React.MouseEvent, asset: MediaAsset) => {
    e.stopPropagation(); // Tránh trigger event chọn ảnh
    const confirmed = await confirm({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa ảnh này khỏi thư viện?'
    });
    if (!confirmed) return;

    setDeletingId(asset.id);
    try {
      await mediaService.deleteMedia(asset.id, asset.bucket_id, asset.file_path);
      setAssets(prev => prev.filter(a => a.id !== asset.id));
      toast.success('Đã xóa ảnh');
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi xóa file.');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
        <Loader2 className="animate-spin w-8 h-8 mb-4" />
        <p>Đang tải thư viện ảnh...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl">
        <p>{error}</p>
        <button onClick={fetchMedia} className="mt-4 px-4 py-2 bg-white rounded-lg border shadow-sm text-neutral-800">
          Thử lại
        </button>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-400 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
        <ImageIcon size={48} className="mb-4 opacity-50" />
        <p className="text-base font-medium text-neutral-600 dark:text-neutral-400">Thư viện trống</p>
        <p className="text-sm mt-1">Bạn chưa có ảnh nào. Hãy tải lên ảnh mới nhé.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[60vh] p-1">
      {assets.map((asset) => {
        const isSelected = selectedUrl === asset.public_url;
        const formatSize = (bytes: number) => (bytes / 1024).toFixed(1) + ' KB';

        return (
          <div 
            key={asset.id}
            onClick={() => onSelect && onSelect(asset)}
            className={`
              relative group aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all
              ${isSelected ? 'border-primary shadow-md' : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-100 dark:bg-neutral-800'}
            `}
          >
            {/* Image Thumbnail */}
            <div className="w-full h-full relative">
              <img 
                src={asset.public_url} 
                alt={asset.alt_text || asset.original_name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>

            {/* Hover Overlay */}
            <div className={`
              absolute inset-0 bg-black/40 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity
              ${isSelected ? 'opacity-100 bg-black/10' : ''}
            `}>
              <div className="flex justify-end">
                <button
                  onClick={(e) => handleDelete(e, asset)}
                  disabled={deletingId === asset.id}
                  className="p-1.5 bg-white/90 hover:bg-red-500 hover:text-white text-red-600 rounded-md transition-colors"
                  title="Xóa ảnh"
                >
                  {deletingId === asset.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
              <div className="bg-black/60 text-white text-xs p-1.5 rounded truncate backdrop-blur-sm">
                <p className="truncate font-medium">{asset.original_name}</p>
                <p className="text-white/70">{formatSize(asset.size_bytes)} • {asset.mime_type.split('/')[1]}</p>
              </div>
            </div>
            
            {/* Checkmark for selected */}
            {isSelected && (
              <div className="absolute top-2 left-2 bg-primary text-white rounded-full p-1 shadow-md">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
