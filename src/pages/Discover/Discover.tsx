import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Timeline from './components/Timeline';
import CreatePost from './components/CreatePost';
import './Discover.css';

const Discover: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!user || !userProfile) {
    return (
      <div className="discover-wrapper">
        <div className="discover-container">
          <div className="discover-header">
            <h1>Discover</h1>
          </div>
          <div className="empty-state">
            <div className="empty-icon">🔒</div>
            <h3>Sign in to connect</h3>
            <p>Join the community to share and learn together!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="discover-wrapper">
      <div className="discover-container">
        <div className="discover-header">
          <h1>Discover</h1>
        </div>
        <CreatePost onPostCreated={handlePostCreated} />
        <Timeline key={refreshTrigger} />
      </div>
    </div>
  );
};

export default Discover;
