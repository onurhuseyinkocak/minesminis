import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
};

const videos: Video[] = [
  {
    id: 'YBcOiV7u-1s',
    title: 'ABC Song - Alphabet Learning',
    description: 'Learn the alphabet with a fun song!',
    thumbnail: 'https://img.youtube.com/vi/YBcOiV7u-1s/mqdefault.jpg',
    category: 'Alphabet'
  },
  {
    id: 'D0Ajq682yrA',
    title: 'Colors Song for Kids',
    description: 'Learn colors through an interactive song',
    thumbnail: 'https://img.youtube.com/vi/D0Ajq682yrA/mqdefault.jpg',
    category: 'Colors'
  },
  {
    id: 'DR-cfDsHCHo',
    title: 'Numbers 1-10 Song',
    description: 'Count from 1 to 10 with music',
    thumbnail: 'https://img.youtube.com/vi/DR-cfDsHCHo/mqdefault.jpg',
    category: 'Numbers'
  },
  {
    id: 'PCicKydX5GE',
    title: 'Animals Song',
    description: 'Learn animal names in English',
    thumbnail: 'https://img.youtube.com/vi/PCicKydX5GE/mqdefault.jpg',
    category: 'Animals'
  },
  {
    id: 'BELlZKpi1Zs',
    title: 'Phonics Song',
    description: 'Learn phonics sounds with fun animations',
    thumbnail: 'https://img.youtube.com/vi/BELlZKpi1Zs/mqdefault.jpg',
    category: 'Phonics'
  },
  {
    id: 'gghDRJVxFxU',
    title: 'Days of the Week Song',
    description: 'Learn the days of the week',
    thumbnail: 'https://img.youtube.com/vi/gghDRJVxFxU/mqdefault.jpg',
    category: 'Time'
  }
];

function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Alphabet', 'Colors', 'Numbers', 'Animals', 'Phonics', 'Time'];

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter(video => video.category === selectedCategory);

  return (
    <div className="videos-page">
      <motion.div
        className="videos-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="videos-title">Educational Videos</h1>
        <p className="videos-subtitle">Watch and learn English with fun videos!</p>
      </motion.div>

      <div className="video-categories">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="videos-grid">
        {filteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            className="video-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            onClick={() => setSelectedVideo(video.id)}
          >
            <div className="video-thumbnail">
              <img src={video.thumbnail} alt={video.title} />
              <div className="video-play-overlay">
                <Play size={48} strokeWidth={3} />
              </div>
            </div>
            <div className="video-info">
              <span className="video-category-badge">{video.category}</span>
              <h3>{video.title}</h3>
              <p>{video.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedVideo(null)}
              className="video-modal-close"
            >
              ✖
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <style>{`
        .videos-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .videos-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .videos-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 50%, #14B8A6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .videos-subtitle {
          color: #6B7280;
          font-size: 1.125rem;
        }

        .video-categories {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .category-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          border: 2px solid #E5E7EB;
          background: white;
          color: #6B7280;
          font-weight: 700;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .category-btn:hover {
          border-color: #06B6D4;
          color: #06B6D4;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .category-btn.active {
          background: linear-gradient(135deg, #3B82F6, #06B6D4);
          color: white;
          border-color: transparent;
          box-shadow: 0 8px 24px rgba(6, 182, 212, 0.3);
        }

        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .video-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .video-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        }

        .video-thumbnail {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, #3B82F6, #06B6D4);
        }

        .video-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .video-card:hover .video-thumbnail img {
          transform: scale(1.1);
        }

        .video-play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
          opacity: 0;
          transition: opacity 0.3s ease;
          color: white;
        }

        .video-card:hover .video-play-overlay {
          opacity: 1;
        }

        .video-info {
          padding: 1.5rem;
        }

        .video-category-badge {
          display: inline-block;
          padding: 0.375rem 0.875rem;
          background: rgba(6, 182, 212, 0.1);
          color: #06B6D4;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .video-info h3 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1F2937;
          margin: 0.5rem 0;
        }

        .video-info p {
          color: #6B7280;
          font-size: 0.9375rem;
          margin: 0;
        }

        .video-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
        }

        .video-modal {
          width: 90%;
          height: 80%;
          max-width: 1200px;
          max-height: 675px;
          background: black;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .video-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 10001;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(255, 107, 107, 0.4);
        }

        .video-modal-close:hover {
          transform: scale(1.1) rotate(90deg);
          box-shadow: 0 6px 24px rgba(255, 107, 107, 0.6);
        }

        @media (max-width: 768px) {
          .videos-title {
            font-size: 2rem;
          }

          .videos-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .video-categories {
            flex-direction: column;
          }

          .category-btn {
            width: 100%;
          }

          .video-modal {
            width: 100%;
            height: 100%;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Videos;
