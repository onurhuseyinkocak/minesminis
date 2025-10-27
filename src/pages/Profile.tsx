import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, userProfile } = useAuth();

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
            src={userProfile?.avatar_url || 'https://ui-avatars.com/api/?name=' + (userProfile?.display_name || 'User')}
            alt={userProfile?.display_name || 'User'}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%'
            }}
          />
          <div>
            <h2 style={{ margin: 0 }}>{userProfile?.display_name || 'User'}</h2>
            <p style={{ margin: 0, color: '#666' }}>{user.email}</p>
            <p style={{ margin: 0, color: '#999', fontSize: '0.9rem' }}>
              {userProfile?.role === 'teacher' ? 'Teacher' : 'Student'}
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h3>Account Information</h3>
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Points:</strong> {userProfile?.points || 0}</p>
          <p><strong>Streak Days:</strong> {userProfile?.streak_days || 0} 🔥</p>
          {userProfile?.grade && (
            <p><strong>Grade:</strong> {userProfile.grade}</p>
          )}
          {userProfile?.subjects && userProfile.subjects.length > 0 && (
            <p><strong>Subjects:</strong> {userProfile.subjects.join(', ')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;