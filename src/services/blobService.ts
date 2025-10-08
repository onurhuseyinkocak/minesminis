import { put } from '@vercel/blob';

export const blobService = {
  async uploadVideo(file: File, userId: string): Promise<string> {
    try {
      console.log('🚀 Vercel Blob upload başlıyor...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userId
      });
      
      // Dosya validasyonu
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('Video boyutu 50MB\'dan küçük olmalıdır');
      }

      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/avi'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Sadece MP4, MOV, WebM ve AVI formatları desteklenir');
      }

      // Benzersiz dosya ismi oluştur
      const timestamp = Date.now();
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const blobPath = `reels/${userId}/${timestamp}_${safeFileName}`;

      console.log('📤 Vercel Blob\'a yükleniyor...', blobPath);

      // Vercel Blob'a yükle - REACT İÇİN token explicit olarak verilmeli
      const blob = await put(blobPath, file, {
        access: 'public',
        token: process.env.REACT_APP_BLOB_READ_WRITE_TOKEN,
      });

      console.log('✅ Vercel Blob upload başarılı:', {
        url: blob.url,
        pathname: blob.pathname,
        // size özelliği kaldırıldı - PutBlobResult'da yok
        originalFileSize: file.size // Bunu kullanabilirsin
      });

      return blob.url;

    } catch (error) {
      console.error('❌ Vercel Blob upload hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      throw new Error(`Video yüklenemedi: ${errorMessage}`);
    }
  },

  async deleteVideo(url: string): Promise<void> {
    try {
      console.log('🗑️ Video silinecek:', url);
    } catch (error) {
      console.error('❌ Video silme hatası:', error);
    }
  },

  // Video URL'sinden blob bilgilerini al
  getBlobInfo(url: string) {
    try {
      const urlObj = new URL(url);
      return {
        hostname: urlObj.hostname,
        pathname: urlObj.pathname,
        isVercelBlob: urlObj.hostname.includes('vercel-storage.com')
      };
    } catch {
      return null;
    }
  }
};