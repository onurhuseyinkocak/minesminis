import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Clock, Users, Music, BookOpen, Heart, Search, X } from 'lucide-react';
import ContentPageHeader from '../components/ContentPageHeader';
import './Videos.css';
import { videoStore } from '../data/videoStore';

type Video = {
  id: string;
  youtube_id: string;
  title: string;
  description: string;
  thumbnail: string;
  grade: string;
  category: 'song' | 'lesson' | 'story';
  duration: string;
  isPopular?: boolean;
};

const gradeInfo: Record<string, { color: string; gradient: string; emoji: string }> = {
  '2nd Grade': {
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    emoji: '🌱'
  },
  '3rd Grade': {
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    emoji: '⭐'
  },
  '4th Grade': {
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    emoji: '🚀'
  }
};

const categoryIcons: Record<string, { icon: React.ReactNode; label: string }> = {
  song: { icon: <Music size={14} />, label: 'Song' },
  lesson: { icon: <BookOpen size={14} />, label: 'Lesson' },
  story: { icon: <Heart size={14} />, label: 'Story' }
};

function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    videoStore.fetchVideos().then((list) => {
      setVideos(list as unknown as Video[]);
    });
    const unsubscribe = videoStore.subscribe((updatedVideos) => {
      setVideos(updatedVideos as unknown as Video[]);
    });
    return () => unsubscribe?.();
  }, []);

  const grades = ['All', '2nd Grade', '3rd Grade', '4th Grade'];

  const filteredVideos = videos.filter(video => {
    const matchesGrade = selectedGrade === 'All' || video.grade === selectedGrade;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const popularVideos = videos.filter(v => v.isPopular);

  return (
    <div className="videos-page">
      <ContentPageHeader
        icon={Play}
        title="Cinema Club"
        description="Binge-watch and learn with our curated English videos!"
        iconColor="#ef4444"
        filterSlot={
          <div className="modern-tabs">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`modern-tab ${selectedGrade === grade ? 'active' : ''}`}
              >
                {grade}
              </button>
            ))}
          </div>
        }
      >
        <div className="library-search-wrapper">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="library-search-input"
          />
          <Search className="library-search-icon" size={20} />
        </div>
      </ContentPageHeader>

      {selectedGrade === 'All' && popularVideos.length > 0 && (
        <motion.div
          className="popular-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="section-header">
            <div className="section-title">
              <Star size={24} className="star-icon" color="#fbbf24" fill="#fbbf24" />
              <h2>Most Popular</h2>
            </div>
            <p className="section-subtitle">Kids love these videos!</p>
          </div>

          <div className="popular-scroll">
            {popularVideos.map((video, index) => (
              <motion.div
                key={video.id}
                className="popular-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedVideo(video.youtube_id)}
                whileHover={{ y: -8 }}
              >
                <div className="popular-thumbnail">
                  <img src={video.thumbnail} alt={video.title} loading="lazy" />
                  <div className="popular-overlay">
                    <Play size={40} fill="white" />
                  </div>
                  <span className="popular-badge">
                    <Star size={12} fill="currentColor" /> Popular
                  </span>
                  <span className="duration-badge">
                    <Clock size={12} /> {video.duration}
                  </span>
                </div>
                <div className="popular-info">
                  <h3>{video.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="videos-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="section-header">
          <div className="section-title">
            <Users size={24} color="var(--primary-orange)" />
            <h2>
              {selectedGrade === 'All' ? 'All Videos' : `${selectedGrade} Videos`}
            </h2>
          </div>
          <p className="video-count">{filteredVideos.length} videos available</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGrade + searchQuery}
            className="videos-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                className="video-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedVideo(video.youtube_id)}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} loading="lazy" />
                  <div className="video-overlay">
                    <motion.div
                      className="play-button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Play size={32} fill="white" />
                    </motion.div>
                  </div>
                  <div className="video-badges">
                    <span className="type-badge">
                      {categoryIcons[video.category.toLowerCase()]?.icon}
                      {categoryIcons[video.category.toLowerCase()]?.label}
                    </span>
                    <span className="time-badge">
                      <Clock size={12} />
                      {video.duration}
                    </span>
                  </div>
                  {video.isPopular && (
                    <span className="star-badge">
                      <Star size={14} fill="currentColor" />
                    </span>
                  )}
                </div>

                <div className="video-content">
                  <span className="video-grade" style={{ background: 'var(--bg-orange-soft)', color: 'var(--primary-orange-dark)' }}>
                    {gradeInfo[video.grade]?.emoji} {video.grade}
                  </span>
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-desc">{video.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            className="video-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              className="video-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="modal-close"
                onClick={() => setSelectedVideo(null)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Videos;
