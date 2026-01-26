import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Search as SearchIcon, X } from 'lucide-react';
import InstagramSidebar from '../components/InstagramSidebar';
import { useNavigate } from 'react-router-dom';
import './Search.css';

interface SearchResult {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
  followers_count: number;
  posts_count: number;
}

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recent, setRecent] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      searchUsers();
    } else {
      setResults([]);
    }
  }, [query]);

  const searchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('id, display_name, avatar_url, bio, followers_count, posts_count')
      .ilike('display_name', `%${query}%`)
      .limit(20);

    if (!error && data) {
      setResults(data);
    }
    setLoading(false);
  };

  const handleUserClick = (user: SearchResult) => {
    const recentList = [user, ...recent.filter(r => r.id !== user.id)].slice(0, 10);
    setRecent(recentList);
    navigate(`/profile/${user.id}`);
  };

  const clearRecent = () => {
    setRecent([]);
  };

  return (
    <>
      <InstagramSidebar />
      <div className="search-container">
        <div className="search-panel">
          <div className="search-header">
            <h1>
              <SearchIcon size={32} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '12px' }} />
              Search Explorers
            </h1>
            <p>Find friends and discover new things!</p>
          </div>

          <div className="search-input-wrapper">
            <SearchIcon size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            {query && (
              <button
                className="clear-btn"
                onClick={() => setQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="search-divider"></div>

          {!query && recent.length > 0 && (
            <div className="recent-section">
              <div className="recent-header">
                <span className="recent-title">Recent</span>
                <button onClick={clearRecent} className="clear-all-btn">
                  Clear all
                </button>
              </div>
              <div className="results-list">
                {recent.map(user => (
                  <div
                    key={user.id}
                    className="result-item"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="result-avatar">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" />
                      ) : (
                        user.display_name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="result-info">
                      <div className="result-name">{user.display_name}</div>
                      <div className="result-meta">
                        {user.followers_count} followers • {user.posts_count} posts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query && (
            <div className="results-section">
              {loading ? (
                <div className="loading-state">Searching...</div>
              ) : results.length > 0 ? (
                <div className="results-list">
                  {results.map(user => (
                    <div
                      key={user.id}
                      className="result-item"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="result-avatar">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" />
                        ) : (
                          user.display_name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="result-info">
                        <div className="result-name">{user.display_name}</div>
                        {user.bio && <div className="result-bio">{user.bio}</div>}
                        <div className="result-meta">
                          {user.followers_count} followers
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No results found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
