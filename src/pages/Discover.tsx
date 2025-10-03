// src/pages/Discover.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postsService, Post } from '../services/postsService';
import toast from 'react-hot-toast';

const Discover: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImageQuery, setNewPostImageQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const postsData = await postsService.getDiscoverPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Posts yüklenirken hata:', error);
      toast.error('Paylaşımlar yüklenirken bir hata oluştu');
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPostContent.trim()) return;

    setIsLoading(true);
    try {
      await postsService.createPost({
        authorId: user.uid,
        authorName: user.displayName || 'Anonim Öğretmen',
        authorPhoto: user.photoURL || undefined,
        content: newPostContent,
        imageQuery: newPostImageQuery || undefined
      });
      
      setNewPostContent('');
      setNewPostImageQuery('');
      await loadPosts();
      
      // Başarılı toast bildirimi
      toast.success('Paylaşımınız yayınlandı! 🎉', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#4CAF50',
          color: '#fff',
        },
      });
    } catch (error: any) {
      console.error('Paylaşım hatası:', error);
      toast.error(error.message || 'Paylaşım sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error('Beğenmek için giriş yapın!');
      return;
    }
    
    try {
      await postsService.likePost(postId, user.uid);
      await loadPosts();
      toast.success('Beğendiniz! ❤️');
    } catch (error) {
      console.error('Beğenirken hata:', error);
      toast.error('Beğenirken bir hata oluştu');
    }
  };

  const handleReport = async (postId: string) => {
    if (!confirm('Bu paylaşımı şikayet etmek istediğinizden emin misiniz?')) return;
    
    try {
      await postsService.reportPost(postId);
      toast.success('Şikayetiniz alındı. Teşekkürler! 🛡️');
      await loadPosts();
    } catch (error) {
      console.error('Şikayet ederken hata:', error);
      toast.error('Şikayet ederken bir hata oluştu');
    }
  };

  // ... geri kalan JSX kodu aynı
  return (
    <div style={{ 
      padding: '20px', 
      minHeight: '80vh',
      backgroundColor: '#f9f9f9',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>Öğretmen Paylaşımları</h1>
      <p>Meslektaşlarınızın deneyimlerini keşfedin ve paylaşın</p>
      
      {/* Yeni Post Formu */}
      {user ? (
        <form onSubmit={handleSubmitPost} style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Paylaşım Yap</h3>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            maxLength={200}
            placeholder="Ne paylaşmak istiyorsunuz? (Maksimum 200 karakter)"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              resize: 'none',
              minHeight: '80px',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ marginTop: '10px' }}>
            <input
              type="text"
              value={newPostImageQuery}
              onChange={(e) => setNewPostImageQuery(e.target.value)}
              placeholder="Görsel anahtar kelime (örn: classroom, education, kids) - Opsiyonel"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}
            />
            <small style={{ color: '#666' }}>
              Görsel için anahtar kelime yazın. Boş bırakırsanız rastgele eğitim görseli eklenir.
            </small>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '15px'
          }}>
            <span style={{ 
              color: newPostContent.length > 180 ? 'red' : '#666',
              fontSize: '14px'
            }}>
              {newPostContent.length}/200
            </span>
            <button
              type="submit"
              disabled={isLoading || !newPostContent.trim()}
              style={{
                padding: '10px 24px',
                backgroundColor: isLoading || !newPostContent.trim() ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: isLoading || !newPostContent.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isLoading ? 'Paylaşılıyor...' : 'Paylaş'}
            </button>
          </div>
        </form>
      ) : (
        <div style={{
          backgroundColor: '#fff3cd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ffeaa7'
        }}>
          <p>💡 Paylaşım yapmak için giriş yapın</p>
        </div>
      )}

      {/* Post Listesi */}
      <div style={{ marginTop: '30px' }}>
        {posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '12px'
          }}>
            <p>Henüz paylaşım yok. İlk paylaşımı siz yapın! 🚀</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {/* Post Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '15px' 
              }}>
                <img 
                  src={post.authorPhoto || '/default-avatar.png'} 
                  alt={post.authorName}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    marginRight: '12px'
                  }}
                />
                <div>
                  <strong>{post.authorName}</strong>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {post.timestamp && new Date(post.timestamp).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p style={{ 
                marginBottom: '15px', 
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}>
                {post.content}
              </p>

              {/* Post Image */}
              {post.imageUrl && (
                <img 
                  src={post.imageUrl} 
                  alt="Paylaşım görseli"
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '15px'
                  }}
                />
              )}

              {/* Post Actions */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #eee',
                paddingTop: '15px'
              }}>
                <button
                  onClick={() => handleLike(post.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: post.likes?.includes(user?.uid || '') ? '#e74c3c' : '#666'
                  }}
                >
                  ❤️ {post.likes?.length || 0}
                </button>
                
                <button
                  onClick={() => handleReport(post.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#666'
                  }}
                  title="Şikayet et"
                >
                  ⚠️ Şikayet
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Discover;