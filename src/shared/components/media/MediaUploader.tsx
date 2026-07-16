"use client";

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import type { MediaAsset } from '../../api/mediaService';
import { mediaService } from '../../api/mediaService';

interface MediaUploaderProps {
  userId: string;
  onUploadSuccess?: (asset: MediaAsset) => void;
}

export function MediaUploader({ userId, onUploadSuccess }: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [keepOriginal, setKeepOriginal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Tạm thời chỉ xử lý từng file một
      for (const file of files) {
        const asset = await mediaService.uploadMedia(userId, file, keepOriginal);
        setSuccessMsg(`Đã tải lên thành công: ${file.name}`);
        if (onUploadSuccess) onUploadSuccess(asset);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi tải ảnh lên.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles);
  }, [userId, keepOriginal]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  // Hỗ trợ dán ảnh từ Clipboard (Ctrl + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length > 0) {
        handleFileUpload(files);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [userId, keepOriginal]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[250px]
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-neutral-300 dark:border-neutral-700 hover:border-primary/50 hover:bg-neutral-50 dark:hover:bg-neutral-900'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-neutral-500 font-medium">Đang xử lý & tải lên...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <UploadCloud size={28} />
            </div>
            <div>
              <p className="text-base font-medium text-neutral-800 dark:text-neutral-200">
                Kéo thả ảnh vào đây, hoặc click để chọn file
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Hỗ trợ: JPG, PNG, GIF, WebP (Tối đa 10MB) <br/>
                <span className="text-xs text-primary/70">Mẹo: Bạn có thể ấn Ctrl+V để dán ảnh trực tiếp!</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="keepOriginal" 
          className="rounded border-neutral-300 text-primary focus:ring-primary"
          checked={keepOriginal}
          onChange={(e) => setKeepOriginal(e.target.checked)}
          disabled={isUploading}
        />
        <label htmlFor="keepOriginal" className="text-sm text-neutral-600 dark:text-neutral-400">
          Giữ nguyên định dạng gốc (Bỏ qua nén ảnh WebP)
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
          <AlertCircle size={16} />
          <p>{error}</p>
        </div>
      )}

      {successMsg && !error && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm">
          <CheckCircle size={16} />
          <p>{successMsg}</p>
        </div>
      )}
    </div>
  );
}
