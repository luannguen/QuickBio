import { supabase, isSupabaseConfigured } from "@/shared/api/supabase";
import { optimizeImage } from "../utils/imageOptimizer";

export interface MediaAsset {
  id: string;
  user_id: string;
  bucket_id: string;
  file_path: string;
  public_url: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  alt_text?: string;
  created_at: string;
  updated_at: string;
}

export const mediaService = {
  /**
   * Tải ảnh lên Media Hub (Kèm tối ưu WebP tự động)
   */
  uploadMedia: async (
    userId: string,
    file: File,
    keepOriginalFormat: boolean = false
  ): Promise<MediaAsset> => {
    // 1. Tối ưu hoá ảnh (Nén & WebP)
    const processedFile = await optimizeImage(file, keepOriginalFormat);

    if (isSupabaseConfigured && supabase) {
      // 2. Upload lên Supabase Storage
      const fileExt = processedFile.name.split('.').pop();
      const uniqueId = crypto.randomUUID();
      // Lưu theo dạng: {userId}/{uuid}.{ext} để an toàn và cách ly
      const filePath = `${userId}/${uniqueId}.${fileExt}`;
      const bucketId = 'media';

      const { error: uploadError } = await supabase.storage
        .from(bucketId)
        .upload(filePath, processedFile);

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      // 3. Lấy Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketId)
        .getPublicUrl(filePath);

      // 4. Lưu thông tin vào database table media_assets
      const newAsset = {
        user_id: userId,
        bucket_id: bucketId,
        file_path: filePath,
        public_url: publicUrl,
        original_name: file.name, // Lưu tên gốc
        mime_type: processedFile.type, // type sau khi convert (ví dụ image/webp)
        size_bytes: processedFile.size, // size sau khi convert
      };

      const { data: dbData, error: dbError } = await supabase
        .from('media_assets')
        .insert(newAsset)
        .select()
        .single();

      if (dbError) throw new Error(`Database save failed: ${dbError.message}`);
      return dbData as MediaAsset;

    } else {
      // Chế độ Local (Mock)
      const mockUrl = URL.createObjectURL(processedFile);
      return {
        id: crypto.randomUUID(),
        user_id: userId,
        bucket_id: 'media',
        file_path: `mock/${processedFile.name}`,
        public_url: mockUrl,
        original_name: file.name,
        mime_type: processedFile.type,
        size_bytes: processedFile.size,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },

  /**
   * Lấy danh sách Media của một User
   */
  getMediaGallery: async (userId: string): Promise<MediaAsset[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(`Failed to fetch media: ${error.message}`);
      return data as MediaAsset[];
    } else {
      return []; // Return empty for mock
    }
  },

  /**
   * Xóa một file Media (Cả Storage và DB)
   */
  deleteMedia: async (assetId: string, bucketId: string, filePath: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      // Xóa trên Storage
      const { error: storageError } = await supabase.storage
        .from(bucketId)
        .remove([filePath]);

      if (storageError) throw new Error(`Failed to delete from storage: ${storageError.message}`);

      // Xóa trong DB
      const { error: dbError } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', assetId);

      if (dbError) throw new Error(`Failed to delete from database: ${dbError.message}`);
      return true;
    } else {
      return true;
    }
  }
};
