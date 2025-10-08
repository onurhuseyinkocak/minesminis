import { put } from '@vercel/blob';

export const blobService = {
  async uploadVideo(file: File, userId: string): Promise<string> {
    try {
      console.log('🚀 Vercel Blob upload başlıyor...');
      
      // Dosya validasyonu
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('Video boyutu 50MB\'dan küçük olmalıdır');
      }

      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/avi'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Sadece MP4, MOV, WebM ve AVI formatları desteklenir');
      }

      // Vercel Blob'a yükle
      const blob = await put(`reels/${userId}/${Date.now()}_${file.name}`, file, {
        access: 'public',
      });

      console.log('✅ Vercel Blob upload başarılı:', blob.url);
      return blob.url;

    } catch (error) {
      console.error('❌ Vercel Blob upload hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      throw new Error(`Video yüklenemedi: ${errorMessage}`);
    }
  },

  async deleteVideo(url: string): Promise<void> {
    try {
      // Vercel Blob delete işlemi için ekstra işlem gerekebilir
      console.log('🗑️ Video silinecek:', url);
      // Şimdilik sadece log, gerekirse delete endpoint eklenebilir
    } catch (error) {
      console.error('❌ Video silme hatası:', error);
    }
  }
};