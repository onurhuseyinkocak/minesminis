import React from 'react';

const RightSidebar: React.FC = () => {
  const trendingHashtags = [
    { tag: 'English', count: '1.2K' },
    { tag: 'Learning', count: '892' },
    { tag: 'Education', count: '756' },
    { tag: 'Teacher', count: '543' }
  ];

  return (
    <div className="right-sidebar">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
        />
      </div>

      <div className="trends-container">
        <h3 className="trends-title">Trending Topics</h3>
        {trendingHashtags.map((trend, index) => (
          <div key={index} className="trend-item">
            <div className="trend-category">Education · Trending</div>
            <div className="trend-tag">#{trend.tag}</div>
            <div className="trend-count">{trend.count} posts</div>
          </div>
        ))}
      </div>

      <div className="suggestions-container">
        <h3 className="suggestions-title">Who to Follow</h3>
        {[
          { name: 'English Teachers', handle: '@teachers' },
          { name: 'Learning Hub', handle: '@learninghub' },
          { name: 'Study Group', handle: '@studygroup' }
        ].map((suggestion, index) => (
          <div key={index} className="suggestion-item">
            <div className="suggestion-avatar">👤</div>
            <div className="suggestion-info">
              <div className="suggestion-name">{suggestion.name}</div>
              <div className="suggestion-handle">{suggestion.handle}</div>
            </div>
            <button className="follow-button">Follow</button>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="footer-links">
          <span>Terms</span>
          <span>Privacy</span>
          <span>Cookies</span>
          <span>About</span>
        </div>
        <div className="copyright">
          © 2024 MinesMinis Learning Platform
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
