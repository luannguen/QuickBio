import React, { useState, useRef } from 'react';
import { Upload, Check, Loader2, X } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  aspectRatio?: 'square' | 'video';
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  value, 
  onChange, 
  label = 'Tải ảnh lên',
  aspectRatio = 'square'
}) => {
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp tin hình ảnh hợp lệ (png, jpg, jpeg, webp)!');
      return;
    }

    // Giới hạn kích thước file đầu vào để tránh crash trình duyệt
    if (file.size > 10 * 1024 * 1024) {
      alert('Kích thước ảnh gốc quá lớn! Vui lòng chọn ảnh dưới 10MB.');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Kích thước nén tối ưu (Square: 350x350, Video/Cover: 600x400)
        const MAX_WIDTH = aspectRatio === 'square' ? 350 : 600;
        const MAX_HEIGHT = aspectRatio === 'square' ? 350 : 400;
        
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Xuất định dạng JPEG nén chất lượng 70% để dung lượng cực nhẹ (~10-20KB)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        onChange(dataUrl);
        setLoading(false);
      };
      img.onerror = () => {
        alert('Lỗi khi tải hình ảnh. Vui lòng thử lại!');
        setLoading(false);
      };
    };
    reader.onerror = () => {
      alert('Lỗi khi đọc tệp tin!');
      setLoading(false);
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-2 text-left">
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer p-4 transition-all outline-none focus:border-brand-orange/60 ${
          isDragOver 
            ? 'border-brand-orange bg-brand-orange/5' 
            : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]'
        } ${
          aspectRatio === 'square' ? 'h-32' : 'h-40'
        }`}
      >
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {loading ? (
          <div className="flex flex-col items-center space-y-2 text-white/50">
            <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
            <span className="text-[10px] font-semibold">Đang nén ảnh...</span>
          </div>
        ) : value ? (
          <div className="w-full h-full relative group">
            <img 
              src={value} 
              alt="Preview" 
              className={`w-full h-full object-cover rounded-lg ${
                aspectRatio === 'square' ? 'max-w-[100px] mx-auto' : 'w-full'
              }`}
            />
            <button 
              type="button"
              onClick={clearImage}
              className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg z-10 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
              <Upload className="w-4 h-4 text-white" />
              <span className="text-[10px] text-white font-bold">Thay đổi</span>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-1.5 pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-white/5 mx-auto flex items-center justify-center text-white/50 border border-white/5">
              <Upload className="w-4 h-4" />
            </div>
            <div className="text-[11px] text-white/80 font-bold">{label}</div>
            <div className="text-[9px] text-white/40 leading-normal">
              Kéo thả file ảnh hoặc <span className="text-brand-orange font-semibold">click chọn</span>
              <br />
              Hoặc click vào đây rồi ấn <kbd className="px-1 py-0.5 bg-white/10 rounded text-[8px] font-mono text-white/70">Ctrl+V</kbd> để dán ảnh
            </div>
          </div>
        )}

        {value && !loading && (
          <div className="absolute bottom-1 right-2 text-[8px] text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Check className="w-2.5 h-2.5" />
            Tối ưu dung lượng
          </div>
        )}
      </div>
    </div>
  );
};
