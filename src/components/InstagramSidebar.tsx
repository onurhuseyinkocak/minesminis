import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Search, PlusSquare, Film, User, Heart, MessageCircle, Menu, LogOut } from 'lucide-react';
import './InstagramSidebar.css';

interface CreateModalProps {
  onClose: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="create-modal-overlay" onClick={onClose}>
      <div className="create-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="create-modal-header">
          <h2>Create new post</h2>
          <button onClick={onClose} className="modal-close-btn">✕</button>
        </div>
        <div className="create-modal-body">
          {!preview ? (
            <div className="upload-area">
              <PlusSquare size={80} strokeWidth={1} />
              <h3>Drag photos and videos here</h3>
              <label className="upload-btn">
                Select from computer
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  hidden
                />
              </label>
            </div>
          ) : (
            <div className="preview-area">
              <div className="preview-media">
                {selectedFile?.type.startsWith('video/') ? (
                  <video src={preview} controls />
                ) : (
                  <img src={preview} alt="Preview" />
                )}
              </div>
              <div className="preview-sidebar">
                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="caption-input"
                  maxLength={2200}
                />
                <button className="share-btn">Share</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InstagramSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/discover', activePaths: ['/discover'] },
    { icon: Search, label: 'Search', path: '/search', activePaths: ['/search'] },
    { icon: Film, label: 'Reels', path: '/reels', activePaths: ['/reels'] },
    { icon: MessageCircle, label: 'Messages', path: '/messages', activePaths: ['/messages'] },
    { icon: Heart, label: 'Notifications', path: '/notifications', activePaths: ['/notifications'] },
    { icon: PlusSquare, label: 'Create', path: null, activePaths: [] },
    { icon: User, label: 'Profile', path: '/profile', activePaths: ['/profile'] },
  ];

  const isActive = (paths: string[]) => {
    return paths.some(path => location.pathname === path);
  };

  if (!user) return null;

  return (
    <>
      <div className="instagram-sidebar">
        <div className="sidebar-header">
          <div className="instagram-logo">
            <svg viewBox="0 0 24 24" width="103" height="29">
              <text x="0" y="20" fontFamily="'Billabong', cursive" fontSize="28" fill="#262626">
                Instagram
              </text>
            </svg>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <div key={index}>
              {item.path ? (
                <Link
                  to={item.path}
                  className={`nav-item ${isActive(item.activePaths) ? 'active' : ''}`}
                >
                  <item.icon
                    size={26}
                    strokeWidth={isActive(item.activePaths) ? 2.5 : 2}
                    fill={isActive(item.activePaths) ? 'currentColor' : 'none'}
                  />
                  <span className={isActive(item.activePaths) ? 'bold' : ''}>{item.label}</span>
                </Link>
              ) : (
                <button
                  className="nav-item"
                  onClick={() => setShowCreate(true)}
                >
                  <item.icon size={26} strokeWidth={2} />
                  <span>{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => setShowMore(!showMore)}>
            <Menu size={26} strokeWidth={2} />
            <span>More</span>
          </button>
          {showMore && (
            <div className="more-menu">
              <button onClick={handleSignOut} className="more-item">
                <LogOut size={20} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
    </>
  );
};

export default InstagramSidebar;
