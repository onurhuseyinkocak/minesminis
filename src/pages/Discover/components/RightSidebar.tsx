// src/pages/Discover/components/RightSidebar.tsx
import React from 'react';

const RightSidebar: React.FC = () => {
  const trendingHashtags = [
    { tag: 'Matematik', count: '1.2K' },
    { tag: 'İngilizce', count: '892' },
    { tag: 'Eğitim', count: '756' },
    { tag: 'Öğretmen', count: '543' }
  ];

  return (
    <div className="right-sidebar">
      <div className="search-container">
        <input
          type="text"
          placeholder="Keşfet"
          className="search-input"
        />
      </div>

      <div className="trends-container">
        <h3 className="trends-title">Trendler</h3>
        {trendingHashtags.map((trend, index) => (
          <div key={index} className="trend-item">
            <div className="trend-category">Eğitim · Trend</div>
            <div className="trend-tag">#{trend.tag}</div>
            <div className="trend-count">{trend.count} paylaşım</div>
          </div>
        ))}
      </div>

      <div className="suggestions-container">
        <h3 className="suggestions-title">Takip Et</h3>
        {[
          { name: 'Eğitim Bakanlığı', handle: '@egitim' },
          { name: 'Öğretmen Platformu', handle: '@ogretmen' },
          { name: 'Dijital Eğitim', handle: '@dijitalegitim' }
        ].map((suggestion, index) => (
          <div key={index} className="suggestion-item">
            <div className="suggestion-avatar">👤</div>
            <div className="suggestion-info">
              <div className="suggestion-name">{suggestion.name}</div>
              <div className="suggestion-handle">{suggestion.handle}</div>
            </div>
            <button className="follow-button">Takip et</button>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="footer-links">
          <span>Şartlar</span>
          <span>Gizlilik</span>
          <span>Çerezler</span>
          <span>Reklam</span>
        </div>
        <div className="copyright">
          © 2024 EduConnect Öğretmen Platformu
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;