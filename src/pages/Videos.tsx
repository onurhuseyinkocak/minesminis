import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Clock, Users, Music, BookOpen, Heart, Search, X, Check, Eye } from 'lucide-react';
import ContentPageHeader from '../components/ContentPageHeader';
import './Videos.css';
import { videoStore, type Video } from '../data/videoStore';
import {
  PHONICS_GROUP_LABELS,
  getVideosForGroup,
  getWatchedVideoIds,
  markVideoWatched,
  type PhonicsVideo,
} from '../data/phonicsVideos';
import { useGamification } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';


const categoryIcons: Record<string, { icon: React.ReactNode; label: string }> = {
  song: { icon: <Music size={14} />, label: 'Song' },
  lesson: { icon: <BookOpen size={14} />, label: 'Lesson' },
  story: { icon: <Heart size={14} />, label: 'Story' }
};

const phonicsTypeInfo: Record<PhonicsVideo['type'], { icon: React.ReactNode; label: string; color: string }> = {
  song: { icon: <Music size={12} />, label: 'Song', color: 'var(--accent-orange)' },
  lesson: { icon: <BookOpen size={12} />, label: 'Lesson', color: 'var(--accent-blue)' },
  story: { icon: <Heart size={12} />, label: 'Story', color: 'var(--accent-purple)' },
  review: { icon: <Eye size={12} />, label: 'Review', color: 'var(--mimi-green)' },
};

function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [expandedGroup, setExpandedGroup] = useState<number | null>(1);
  const { addXP } = useGamification();
  const { t } = useLanguage();

  useEffect(() => {
    videoStore.fetchVideos().then((list) => {
      setVideos(list);
    });
    const unsubscribe = videoStore.subscribe((updatedVideos) => {
      setVideos(updatedVideos);
    });
    setWatchedIds(getWatchedVideoIds());
    return () => unsubscribe?.();
  }, []);

  const grades = ['All', '2nd Grade', '3rd Grade', '4th Grade'] as const;
  const gradeLabels: Record<string, string> = {
    'All': t('videos.all'),
    '2nd Grade': t('videos.grade2'),
    '3rd Grade': t('videos.grade3'),
    '4th Grade': t('videos.grade4'),
  };

  const filteredVideos = videos.filter(video => {
    const matchesGrade = selectedGrade === 'All' || video.grade === selectedGrade;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const popularVideos = videos.filter(v => v.isPopular);

  const handlePhonicsVideoClick = useCallback(async (video: PhonicsVideo) => {
    setSelectedVideo(video.youtubeId);
    const isFirstWatch = markVideoWatched(video.id);
    if (isFirstWatch) {
      setWatchedIds(getWatchedVideoIds());
      try {
        await addXP(10, 'Watched phonics video', { videoId: video.id, group: video.group });
      } catch {
        // XP award failed silently
      }
    }
  }, [addXP]);

  // Phonics groups 1-7
  const phonicsGroups = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="videos-page">
      <ContentPageHeader
        icon={Play}
        title={t('videos.title')}
        description={t('videos.description')}
        iconColor="var(--error)"
        filterSlot={
          <div className="modern-tabs">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`modern-tab ${selectedGrade === grade ? 'active' : ''}`}
              >
                {gradeLabels[grade]}
              </button>
            ))}
          </div>
        }
      >
        <div className="library-search-wrapper">
          <input
            type="text"
            placeholder={t('videos.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="library-search-input"
          />
          <Search className="library-search-icon" size={20} />
        </div>
      </ContentPageHeader>

      {/* ================================================================
          PHONICS VIDEOS SECTION — Grouped by phonics group
          Only shown when no grade filter is active
          ================================================================ */}
      {selectedGrade === 'All' && <motion.div
        className="phonics-videos-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div className="section-header">
          <div className="section-title">
            <Music size={24} color="var(--accent-orange)" />
            <h2>{t('videos.phonicsTitle')}</h2>
          </div>
          <p className="section-subtitle">{t('videos.phonicsSubtitle')}</p>
        </div>

        <div className="phonics-groups-list">
          {phonicsGroups.map((groupNum) => {
            const groupVideos = getVideosForGroup(groupNum);
            const isExpanded = expandedGroup === groupNum;
            const watchedCount = groupVideos.filter((v) => watchedIds.includes(v.id)).length;
            const allWatched = watchedCount === groupVideos.length;

            return (
              <motion.div
                key={groupNum}
                className={`phonics-group-block ${isExpanded ? 'expanded' : ''}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * groupNum }}
              >
                {/* Group Header — Clickable to expand/collapse */}
                <button
                  className="phonics-group-header"
                  onClick={() => setExpandedGroup(isExpanded ? null : groupNum)}
                  type="button"
                >
                  <div className="phonics-group-header-left">
                    <span className="phonics-group-number">G{groupNum}</span>
                    <div className="phonics-group-info">
                      <h3>Group {groupNum}: {PHONICS_GROUP_LABELS[groupNum]}</h3>
                      <span className="phonics-group-watched">
                        {allWatched ? (
                          <><Check size={14} /> {t('videos.allWatched')}</>
                        ) : (
                          <>{watchedCount}/{groupVideos.length} {t('videos.watched')}</>
                        )}
                      </span>
                    </div>
                  </div>
                  <span className={`phonics-group-chevron ${isExpanded ? 'open' : ''}`}>
                    {'\u25BC'}
                  </span>
                </button>

                {/* Group Videos — shown when expanded */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className="phonics-group-videos"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="phonics-videos-grid">
                        {groupVideos.map((video, idx) => {
                          const watched = watchedIds.includes(video.id);
                          const typeInfo = phonicsTypeInfo[video.type];
                          return (
                            <motion.div
                              key={video.id}
                              className={`phonics-video-card ${watched ? 'watched' : ''}`}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.06 }}
                              onClick={() => handlePhonicsVideoClick(video)}
                              whileHover={{ y: -4, scale: 1.02 }}
                            >
                              <div className="phonics-video-thumbnail">
                                <img
                                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                  alt={video.title}
                                  loading="lazy"
                                />
                                <div className="phonics-video-overlay">
                                  <Play size={28} fill="white" />
                                </div>
                                {watched && (
                                  <span className="phonics-watched-badge">
                                    <Check size={14} />
                                  </span>
                                )}
                                <span className="phonics-duration-badge">
                                  <Clock size={11} /> {video.duration}
                                </span>
                              </div>
                              <div className="phonics-video-info">
                                <div className="phonics-video-meta">
                                  <span
                                    className="phonics-type-badge"
                                    style={{ background: typeInfo.color }}
                                  >
                                    {typeInfo.icon} {typeInfo.label}
                                  </span>
                                  <span className="phonics-age-badge">{video.ageRange}</span>
                                </div>
                                <h4 className="phonics-video-title">{video.title}</h4>
                                {watched && (
                                  <span className="phonics-xp-earned">{t('videos.xpEarned')}</span>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>}

      {/* ================================================================
          MORE VIDEOS — Grade-based (existing content)
          ================================================================ */}
      {selectedGrade === 'All' && popularVideos.length > 0 && (
        <motion.div
          className="popular-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="section-header">
            <div className="section-title">
              <Star size={24} className="star-icon" color="var(--primary-light)" fill="var(--primary-light)" />
              <h2>{t('videos.mostPopular')}</h2>
            </div>
            <p className="section-subtitle">{t('videos.kidsLoveThese')}</p>
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
                    <Star size={12} fill="currentColor" /> {t('videos.popular')}
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
            <Users size={24} color="var(--accent-orange)" />
            <h2>
              {selectedGrade === 'All' ? t('videos.moreVideos') : `${gradeLabels[selectedGrade]}`}
            </h2>
          </div>
          <p className="video-count">{filteredVideos.length} {t('videos.videosAvailable')}</p>
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
                  <span className="video-grade" style={{ background: 'var(--primary-pale)', color: 'var(--primary-dark)' }}>
                    {video.grade}
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
