import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { User } from 'firebase/auth';
import { userService } from '../../../services/userService';
import { blobService } from '../../../services/blobService';
import './UploadReel.css';

// Premium ikonlar
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface UploadReelProps {
  currentUser: User;
}

const UploadReel: React.FC<UploadReelProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const handleOpenModal = (event: any) => {
      setVideoFile(event.detail);
      setPreviewUrl(URL.createObjectURL(event.detail));
      setIsOpen(true);
    };

    window.addEventListener('openUploadModal', handleOpenModal);
    return () => window.removeEventListener('openUploadModal', handleOpenModal);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const processFile = (file: File) => {
    if (file.type.startsWith('video/')) {
      if (file.size > 50 * 1024 * 1024) {
        alert('Video boyutu 50MB\'dan küçük olmalıdır.');
        return;
      }
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsOpen(true);
    } else {
      alert('Lütfen bir video dosyası seçin (MP4, MOV, etc.).');
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !currentUser) return;

    setUploading(true);
    setProgress(0);
    
    try {
      console.log('🔄 Upload süreci başlatılıyor...');
      
      const profile = await userService.getUserProfile(currentUser.uid);
      const authorName = profile?.displayName || currentUser.email?.split('@')[0] || 'Anonim';

      // Progress simulasyonu
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // VERCEL BLOB İLE YÜKLEME
      console.log('📤 Vercel Blob\'a yükleniyor...');
      const videoUrl = await blobService.uploadVideo(videoFile, currentUser.uid);
      
      clearInterval(progressInterval);
      setProgress(100);

      console.log('💾 Firestore\'a kaydediliyor...');
      // Firestore'a kaydet
      await addDoc(collection(db, 'reels'), {
        videoUrl: videoUrl,
        caption: caption.trim(),
        authorId: currentUser.uid,
        authorName: authorName,
        authorPhoto: currentUser.photoURL || '',
        likes: [],
        comments: [],
        views: [],
        shares: 0,
        timestamp: serverTimestamp(),
        music: 'Original Sound'
      });

      // Kullanıcı istatistiklerini güncelle
      await userService.incrementPostCount(currentUser.uid);
      await userService.incrementReelsCount(currentUser.uid);

      // Başarı mesajı
      setUploading(false);
      setProgress(0);
      setVideoFile(null);
      setCaption('');
      setPreviewUrl('');
      setIsOpen(false);
      
      showSuccessMessage('Reel başarıyla paylaşıldı! 🎉');
      
    } catch (error) {
      console.error('❌ Upload hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      alert(`Yükleme hatası: ${errorMessage}`);
      setUploading(false);
      setProgress(0);
    }
  };

  const showSuccessMessage = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'premium-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #ff0050, #833ab4);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 600;
      box-shadow: 0 8px 25px rgba(255, 0, 80, 0.3);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const handleClose = () => {
    if (!uploading) {
      setVideoFile(null);
      setCaption('');
      setPreviewUrl('');
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="premium-upload-modal-overlay">
          <div className="premium-upload-modal">
            <div className="premium-modal-header">
              <h3>Yeni Reel Oluştur</h3>
              <button 
                className="premium-close-button" 
                onClick={handleClose}
                disabled={uploading}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="premium-modal-content">
              {previewUrl ? (
                <div className="premium-video-preview">
                  <video
                    src={previewUrl}
                    controls
                    className="premium-preview-video"
                  />
                </div>
              ) : (
                <div 
                  className={`premium-drop-zone ${dragOver ? 'drag-over' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="drop-zone-content">
                    <UploadIcon />
                    <h4>Video Yükleyin</h4>
                    <p>Video dosyasını buraya sürükleyin veya seçin</p>
                    <span className="file-info">MP4, MOV • Maks. 50MB</span>
                  </div>
                </div>
              )}

              <div className="premium-caption-section">
                <label className="caption-label">Açıklama</label>
                <textarea
                  placeholder="Reel'iniz için bir açıklama yazın..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="premium-caption-input"
                  rows={3}
                  maxLength={150}
                  disabled={uploading}
                />
                <div className="premium-caption-counter">
                  {caption.length}/150
                </div>
              </div>

              {uploading && (
                <div className="premium-upload-progress">
                  <div className="premium-progress-header">
                    <span>Yükleniyor...</span>
                    <span>%{Math.round(progress)}</span>
                  </div>
                  <div className="premium-progress-bar">
                    <div 
                      className="premium-progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="premium-modal-actions">
              <button 
                onClick={handleClose}
                disabled={uploading}
                className="premium-cancel-btn"
              >
                İptal
              </button>
              <button 
                onClick={handleUpload}
                disabled={uploading || !caption.trim() || !videoFile}
                className={`premium-upload-btn ${uploading ? 'uploading' : ''}`}
              >
                {uploading ? (
                  <>
                    <div className="premium-spinner"></div>
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <UploadIcon />
                    Paylaş
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadReel;