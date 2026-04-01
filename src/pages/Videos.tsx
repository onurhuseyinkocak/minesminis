import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, X, Check, Music } from 'lucide-react';
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
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';

function isChildModeActive(settings: Record<string, unknown> | undefined): boolean {
  if (typeof settings?.ageGroup === 'string' && settings.ageGroup === '3-5') return true;
  try { return localStorage.getItem('mm_child_mode') === 'true'; } catch { return false; }
}

const spring = { type: 'spring' as const, stiffness: 300, damping: 24 };

function VideoCardSkeleton() {
  return <div className="w-full rounded-3xl bg-gray-100 animate-pulse aspect-video" />;
}

function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [iframeError, setIframeError] = useState(false);
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [watchedRegularIds, setWatchedRegularIds] = useState<Set<string>>(new Set());
  const { addXP, trackActivity } = useGamification();
  const { lang } = useLanguage();
  const { userProfile } = useAuth();
  const childMode = isChildModeActive(userProfile?.settings);
  usePageTitle('Videolar', 'Videos');
  const isTr = lang === 'tr';

  useEffect(() => {
    videoStore.fetchVideos().then((list) => { setVideos(list); setVideosLoading(false); }).catch(() => setVideosLoading(false));
    const unsubscribe = videoStore.subscribe((v) => { setVideos(v); setVideosLoading(false); });
    setWatchedIds(getWatchedVideoIds());
    return () => unsubscribe?.();
  }, []);

  useEffect(() => { setIframeError(false); }, [selectedVideo]);

  const handlePhonicsVideoClick = useCallback(async (video: PhonicsVideo) => {
    setSelectedVideo(video.youtubeId);
    const isFirstWatch = markVideoWatched(video.id);
    if (isFirstWatch) {
      setWatchedIds(getWatchedVideoIds());
      try {
        await addXP(10, 'Watched phonics video', { videoId: video.id, group: video.group });
        await trackActivity('video_watched', { videoId: video.id });
      } catch { /* silent */ }
    }
  }, [addXP, trackActivity]);

  const handleRegularVideoClick = useCallback(async (video: Video) => {
    setSelectedVideo(video.youtube_id);
    if (!watchedRegularIds.has(video.id)) {
      setWatchedRegularIds((prev) => new Set([...prev, video.id]));
      try { await addXP(5, 'Watched educational video', { videoId: video.id }); } catch { /* silent */ }
    }
  }, [addXP, watchedRegularIds]);

  const phonicsGroups = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-red-100 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
            <Play size={20} className="text-red-500" />
          </div>
          <h1 className="text-lg font-bold text-gray-800 flex-1">{isTr ? 'Videolar' : 'Videos'}</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-6">
        {/* Loading skeleton */}
        {videosLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <VideoCardSkeleton key={i} />)}
          </div>
        )}

        {/* Phonics section */}
        {!videosLoading && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Music size={20} className="text-orange-500" />
              <h2 className="text-base font-bold text-gray-800">{isTr ? 'Fonetik Videolar' : 'Phonics Videos'}</h2>
            </div>
            <div className="space-y-3">
              {phonicsGroups.map((groupNum) => {
                const groupVideos = getVideosForGroup(groupNum);
                const watchedCount = groupVideos.filter(v => watchedIds.includes(v.id)).length;
                return (
                  <div key={groupNum}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-xl bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">
                        {groupNum}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 flex-1">
                        {PHONICS_GROUP_LABELS[groupNum]}
                      </span>
                      <span className="text-xs text-gray-400">{watchedCount}/{groupVideos.length}</span>
                    </div>
                    <div className="space-y-2">
                      {groupVideos.map((video, idx) => {
                        const watched = watchedIds.includes(video.id);
                        return (
                          <motion.button
                            key={video.id}
                            type="button"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...spring, delay: idx * 0.05 }}
                            onClick={() => handlePhonicsVideoClick(video)}
                            className="w-full rounded-3xl overflow-hidden bg-white border-2 border-gray-100 shadow-sm active:scale-[0.97] transition-transform"
                          >
                            <div className="relative aspect-video">
                              <img
                                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                alt={video.title}
                                loading="lazy"
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/default.jpg`; }}
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                  <Play size={24} className="text-red-500 ml-1" fill="currentColor" />
                                </div>
                              </div>
                              {watched && (
                                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-green-400 flex items-center justify-center">
                                  <Check size={14} className="text-white" />
                                </div>
                              )}
                              <div className="absolute bottom-3 right-3 h-6 px-2 rounded-lg bg-black/60 text-white text-xs font-medium flex items-center gap-1">
                                <Clock size={10} /> {video.duration}
                              </div>
                            </div>
                            <div className="p-3 text-left">
                              <h3 className="text-sm font-bold text-gray-800 leading-tight">{video.title}</h3>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Regular videos */}
        {!videosLoading && videos.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">{isTr ? 'Daha Fazla Video' : 'More Videos'}</h2>
            <div className="space-y-3">
              {videos.map((video, idx) => (
                <motion.button
                  key={video.id}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: idx * 0.05 }}
                  onClick={() => handleRegularVideoClick(video)}
                  className="w-full rounded-3xl overflow-hidden bg-white border-2 border-gray-100 shadow-sm active:scale-[0.97] transition-transform"
                >
                  <div className="relative aspect-video">
                    <img src={video.thumbnail} alt={video.title} loading="lazy" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play size={24} className="text-red-500 ml-1" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 h-6 px-2 rounded-lg bg-black/60 text-white text-xs font-medium flex items-center gap-1">
                      <Clock size={10} /> {video.duration}
                    </div>
                  </div>
                  <div className="p-3 text-left">
                    <h3 className="text-sm font-bold text-gray-800 leading-tight">{video.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{video.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Video player modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={spring}
              className="w-full max-w-xl bg-black rounded-3xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-90 transition-transform"
                aria-label={isTr ? 'Kapat' : 'Close'}
              >
                <X size={20} />
              </button>
              {iframeError ? (
                <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[200px] text-gray-400 text-center">
                  <Play size={48} style={{ opacity: 0.3 }} />
                  <p className="font-bold text-white">{isTr ? 'Video yuklenemedi.' : 'Video could not be loaded.'}</p>
                  {!childMode && (
                    <a
                      href={`https://www.youtube.com/watch?v=${selectedVideo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 px-4 rounded-2xl bg-red-500 text-white font-bold text-sm flex items-center"
                    >
                      {isTr ? "YouTube'da Ac" : 'Open on YouTube'}
                    </a>
                  )}
                </div>
              ) : (
                <div className="aspect-video">
                  <iframe
                    key={selectedVideo}
                    src={`https://www.youtube-nocookie.com/embed/${selectedVideo}?autoplay=1&rel=0&modestbranding=1`}
                    title="YouTube video player"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                    onError={() => setIframeError(true)}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Videos;
