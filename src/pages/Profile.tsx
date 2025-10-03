import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '80vh'
      }}>
        <h2>Profilinizi görmek için giriş yapın</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      minHeight: '80vh',
      backgroundColor: '#f9f9f9'
    }}>
      <h1>Profilim</h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        marginTop: '20px',
        maxWidth: '500px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <img 
            src={user.photoURL || '/default-avatar.png'} 
            alt={user.displayName || 'User'}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%'
            }}
          />
          <div>
            <h2 style={{ margin: 0 }}>{user.displayName || 'Öğretmen'}</h2>
            <p style={{ margin: 0, color: '#666' }}>{user.email}</p>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h3>Hesap Bilgileri</h3>
          <p><strong>Kullanıcı ID:</strong> {user.uid}</p>
          <p><strong>E-posta Doğrulama:</strong> {user.emailVerified ? '✅ Doğrulandı' : '❌ Doğrulanmadı'}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;