import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Timeline from './components/Timeline';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
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
      <div className="discover-container">
        <div className="discover-main">
          <div className="auth-required">
            <h2>Please sign in to access the social feed</h2>
            <p>Connect with teachers and students, share your learning journey!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="discover-container">
      <Sidebar />
      <div className="discover-main">
        <CreatePost onPostCreated={handlePostCreated} />
        <Timeline key={refreshTrigger} />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Discover;
