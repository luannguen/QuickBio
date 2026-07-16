import imageCompression from 'browser-image-compression';

export interface OptimizeOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
}

const DEFAULT_OPTIONS: OptimizeOptions = {
  maxSizeMB: 1, // Default max size 1MB
  maxWidthOrHeight: 1920, // Max dimension 1920px (Full HD)
  useWebWorker: true,
  fileType: 'image/webp', // Default convert to webp
};

/**
 * Tối ưu hóa hình ảnh trên trình duyệt trước khi upload.
 * - Tự động nén dung lượng (mặc định dưới 1MB).
 * - Tự động convert sang WebP (để tối ưu web performance).
 * - Tự động fix lỗi xoay ảnh (EXIF orientation).
 * 
 * @param file File ảnh gốc
 * @param keepOriginalFormat Nếu true, sẽ giữ nguyên định dạng (không ép về WebP)
 * @param customOptions Tuỳ chọn nâng cao (Ghi đè mặc định)
 * @returns File đã tối ưu
 */
export async function optimizeImage(
  file: File, 
  keepOriginalFormat: boolean = false,
  customOptions?: OptimizeOptions
): Promise<File> {
  // Nếu không phải là ảnh, trả về nguyên bản (ví dụ pdf, doc)
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // Cấu hình options
  const options = {
    ...DEFAULT_OPTIONS,
    ...customOptions,
  };

  if (keepOriginalFormat) {
    options.fileType = file.type;
  }

  try {
    // Nén và xử lý ảnh
    const compressedBlob = await imageCompression(file, options as any);
    
    // browser-image-compression trả về Blob, ta cần convert lại thành File object 
    // để giữ nguyên metadata cần thiết, đặc biệt là đổi extension thành .webp nếu có convert
    
    let newFileName = file.name;
    if (!keepOriginalFormat && options.fileType === 'image/webp') {
      // Đổi đuôi file sang .webp
      const lastDotIndex = newFileName.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        newFileName = newFileName.substring(0, lastDotIndex) + '.webp';
      } else {
        newFileName += '.webp';
      }
    }

    const optimizedFile = new File([compressedBlob], newFileName, {
      type: options.fileType,
      lastModified: Date.now(),
    });

    return optimizedFile;
  } catch (error) {
    console.error('Error optimizing image:', error);
    // Nếu có lỗi trong quá trình nén (ví dụ file bị hỏng), trả về file gốc để tránh block upload
    return file;
  }
}

/**
 * Kiểm tra file có hợp lệ hay không (kích thước, định dạng)
 */
export function validateMediaFile(file: File, allowedTypes: string[], maxSizeMB: number): { isValid: boolean; error?: string } {
  // Check Type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Định dạng file không được hỗ trợ.' };
  }

  // Check Size
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return { isValid: false, error: `Kích thước file quá lớn. Tối đa cho phép là ${maxSizeMB}MB.` };
  }

  return { isValid: true };
}
