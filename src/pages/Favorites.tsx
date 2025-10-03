// src/pages/Favorites.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Favorites: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2>Favorilerinizi görmek için giriş yapın</h2>
        <p>Beğendiğiniz materyalleri favorilere ekleyip burada saklayabilirsiniz.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      minHeight: '80vh',
      backgroundColor: '#f9f9f9'
    }}>
      <h1>Favori Materyallerim</h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <p>⭐ Henüz favori materyaliniz bulunmuyor</p>
        <p>Oyunlar, çalışma kağıtları veya kelimeleri favorilere ekleyebilirsiniz.</p>
      </div>
    </div>
  );
};

export default Favorites;