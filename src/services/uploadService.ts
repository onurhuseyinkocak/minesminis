import { supabase } from '../config/supabase';

export const uploadService = {
  async uploadFile(file: File, folder: string = 'posts'): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage.from('media').remove([filePath]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  getMediaType(file: File): 'image' | 'video' | 'audio' | null {
    const type = file.type.split('/')[0];
    if (type === 'image' || type === 'video' || type === 'audio') {
      return type as 'image' | 'video' | 'audio';
    }
    return null;
  },

  validateFile(file: File, maxSizeMB: number = 100): { valid: boolean; error?: string } {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size must be less than ${maxSizeMB}MB`,
      };
    }

    const mediaType = this.getMediaType(file);
    if (!mediaType) {
      return {
        valid: false,
        error: 'Only image, video, and audio files are allowed',
      };
    }

    return { valid: true };
  },
};
