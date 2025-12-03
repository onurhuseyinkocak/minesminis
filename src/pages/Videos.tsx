import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Clock, Users, Sparkles, GraduationCap, Music, BookOpen, Gamepad2, Heart } from 'lucide-react';

type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  grade: string;
  type: 'song' | 'lesson' | 'story' | 'game';
  duration: string;
  isPopular?: boolean;
};

const videos: Video[] = [
  // 2nd Grade - Basic English (Beginners)
  {
    id: 'ZanHgPprl-0',
    title: 'ABC Song - Learn the Alphabet',
    description: 'Sing along and learn all 26 letters!',
    thumbnail: 'https://img.youtube.com/vi/ZanHgPprl-0/mqdefault.jpg',
    grade: '2nd Grade',
    type: 'song',
    duration: '2:01',
    isPopular: true
  },
  {
    id: 'pO1-gnIvYsg',
    title: 'Learn Colors Song',
    description: 'Red, blue, green - learn all colors!',
    thumbnail: 'https://img.youtube.com/vi/pO1-gnIvYsg/mqdefault.jpg',
    grade: '2nd Grade',
    type: 'song',
    duration: '2:48'
  },
  {
    id: 'DR-cfDsHCHo',
    title: 'Counting 1 to 10 Song',
    description: 'Learn to count with fun music!',
    thumbnail: 'https://img.youtube.com/vi/DR-cfDsHCHo/mqdefault.jpg',
    grade: '2nd Grade',
    type: 'song',
    duration: '2:25',
    isPopular: true
  },
  {
    id: 'WTeqUejf3D0',
    title: 'Baby Shark Dance',
    description: 'The famous Baby Shark song!',
    thumbnail: 'https://img.youtube.com/vi/WTeqUejf3D0/mqdefault.jpg',
    grade: '2nd Grade',
    type: 'song',
    duration: '2:17'
  },
  {
    id: 'e54m6XOpRgU',
    title: 'Head Shoulders Knees Toes',
    description: 'Learn body parts with actions!',
    thumbnail: 'https://img.youtube.com/vi/e54m6XOpRgU/mqdefault.jpg',
    grade: '2nd Grade',
    type: 'song',
    duration: '2:15',
    isPopular: true
  },
  {
    id: 'Yt8GFgxlITs',
    title: 'Five Little Monkeys',
    description: 'Counting song with silly monkeys!',
    thumbnail: 'https://img.youtube.com/vi/Yt8GFgxlITs/mqdefault.jpg',
    grade: '2nd Grade',
    type: 'story',
    duration: '2:30'
  },
  {
    id: '6xZ6R8t4d7g',
    title: 'Animal Sounds Song',
    description: 'What does the cat say? Meow!',
    thumbnail: 'https://img.youtube.com/vi/6xZ6R8t4d7g/mqdefault.jpg',
    grade: '2nd Grade',
    type: 'song',
    duration: '3:10'
  },
  {
    id: 'OEbRDtCAFdU',
    title: 'Five Little Ducks',
    description: 'Quack quack - counting ducks!',
    thumbnail: 'https://img.youtube.com/vi/OEbRDtCAFdU/mqdefault.jpg',
    grade: '2nd Grade',
    type: 'story',
    duration: '3:22'
  },

  // 3rd Grade - Intermediate
  {
    id: 'mXMofxtDPUQ',
    title: 'Days of the Week',
    description: 'Monday, Tuesday, Wednesday...',
    thumbnail: 'https://img.youtube.com/vi/mXMofxtDPUQ/mqdefault.jpg',
    grade: '3rd Grade',
    type: 'song',
    duration: '2:48',
    isPopular: true
  },
  {
    id: 'Fe9bnYRzFvk',
    title: 'Months of the Year',
    description: 'January to December song!',
    thumbnail: 'https://img.youtube.com/vi/Fe9bnYRzFvk/mqdefault.jpg',
    grade: '3rd Grade',
    type: 'song',
    duration: '2:45'
  },
  {
    id: 'CjnDEUyEgPc',
    title: 'Weather Song for Kids',
    description: 'Sunny, rainy, cloudy, snowy!',
    thumbnail: 'https://img.youtube.com/vi/CjnDEUyEgPc/mqdefault.jpg',
    grade: '3rd Grade',
    type: 'song',
    duration: '3:02'
  },
  {
    id: 'FHaObkHEkHQ',
    title: 'Family Song',
    description: 'Mom, Dad, Brother, Sister!',
    thumbnail: 'https://img.youtube.com/vi/FHaObkHEkHQ/mqdefault.jpg',
    grade: '3rd Grade',
    type: 'song',
    duration: '2:35',
    isPopular: true
  },
  {
    id: 'h4eueDYPTIg',
    title: 'Action Verbs Song',
    description: 'Run, jump, swim, fly!',
    thumbnail: 'https://img.youtube.com/vi/h4eueDYPTIg/mqdefault.jpg',
    grade: '3rd Grade',
    type: 'lesson',
    duration: '3:20'
  },
  {
    id: '0lkuWGZTA0E',
    title: 'Feelings Song',
    description: 'Happy, sad, angry, excited!',
    thumbnail: 'https://img.youtube.com/vi/0lkuWGZTA0E/mqdefault.jpg',
    grade: '3rd Grade',
    type: 'song',
    duration: '2:45'
  },
  {
    id: 'L0mL4oZycnU',
    title: 'Fruit Song for Kids',
    description: 'Apple, banana, orange, grape!',
    thumbnail: 'https://img.youtube.com/vi/L0mL4oZycnU/mqdefault.jpg',
    grade: '3rd Grade',
    type: 'song',
    duration: '2:55'
  },
  {
    id: 'loINl3Ln6Ck',
    title: 'Shapes Song',
    description: 'Circle, square, triangle, star!',
    thumbnail: 'https://img.youtube.com/vi/loINl3Ln6Ck/mqdefault.jpg',
    grade: '3rd Grade',
    type: 'song',
    duration: '2:40'
  },

  // 4th Grade - Advanced
  {
    id: 'D1LDPmYLKdE',
    title: 'Present Tense Song',
    description: 'I eat, you eat, he eats!',
    thumbnail: 'https://img.youtube.com/vi/D1LDPmYLKdE/mqdefault.jpg',
    grade: '4th Grade',
    type: 'lesson',
    duration: '3:30',
    isPopular: true
  },
  {
    id: 'Sj8qPwRzcS8',
    title: 'Daily Routines',
    description: 'Wake up, brush teeth, go to school!',
    thumbnail: 'https://img.youtube.com/vi/Sj8qPwRzcS8/mqdefault.jpg',
    grade: '4th Grade',
    type: 'lesson',
    duration: '3:55'
  },
  {
    id: 'WMy7wSuo5BI',
    title: 'Telling Time Song',
    description: 'What time is it? Learn the clock!',
    thumbnail: 'https://img.youtube.com/vi/WMy7wSuo5BI/mqdefault.jpg',
    grade: '4th Grade',
    type: 'lesson',
    duration: '4:05',
    isPopular: true
  },
  {
    id: 'ddDN30evKPc',
    title: 'Prepositions Song',
    description: 'In, on, under, behind, between!',
    thumbnail: 'https://img.youtube.com/vi/ddDN30evKPc/mqdefault.jpg',
    grade: '4th Grade',
    type: 'song',
    duration: '3:18'
  },
  {
    id: 'frN3nvhIHUk',
    title: 'Opposite Words',
    description: 'Big-small, hot-cold, fast-slow!',
    thumbnail: 'https://img.youtube.com/vi/frN3nvhIHUk/mqdefault.jpg',
    grade: '4th Grade',
    type: 'lesson',
    duration: '3:28'
  },
  {
    id: 'wCmBJPF3Vlo',
    title: 'Vegetables Song',
    description: 'Carrot, potato, tomato, onion!',
    thumbnail: 'https://img.youtube.com/vi/wCmBJPF3Vlo/mqdefault.jpg',
    grade: '4th Grade',
    type: 'song',
    duration: '2:50'
  },
  {
    id: 'RE5tvaveVak',
    title: 'Clothes Song',
    description: 'Shirt, pants, shoes, hat!',
    thumbnail: 'https://img.youtube.com/vi/RE5tvaveVak/mqdefault.jpg',
    grade: '4th Grade',
    type: 'song',
    duration: '3:15'
  },
  {
    id: 'tkGeEU0cFqU',
    title: 'Transportation Song',
    description: 'Car, bus, train, airplane!',
    thumbnail: 'https://img.youtube.com/vi/tkGeEU0cFqU/mqdefault.jpg',
    grade: '4th Grade',
    type: 'song',
    duration: '2:42'
  }
];

const gradeInfo: Record<string, { color: string; gradient: string; icon: string; emoji: string }> = {
  '2nd Grade': { 
    color: '#22c55e', 
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    icon: 'leaf',
    emoji: '🌱'
  },
  '3rd Grade': { 
    color: '#3b82f6', 
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    icon: 'star',
    emoji: '⭐'
  },
  '4th Grade': { 
    color: '#8b5cf6', 
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    icon: 'rocket',
    emoji: '🚀'
  }
};

const typeIcons: Record<string, { icon: React.ReactNode; label: string }> = {
  song: { icon: <Music size={14} />, label: 'Song' },
  lesson: { icon: <BookOpen size={14} />, label: 'Lesson' },
  story: { icon: <Heart size={14} />, label: 'Story' },
  game: { icon: <Gamepad2 size={14} />, label: 'Game' }
};

function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>('All');

  const grades = ['All', '2nd Grade', '3rd Grade', '4th Grade'];

  const filteredVideos = selectedGrade === 'All'
    ? videos
    : videos.filter(video => video.grade === selectedGrade);

  const popularVideos = videos.filter(v => v.isPopular);

  return (
    <div className="videos-page">
      {/* Hero Section */}
      <motion.div
        className="videos-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Sparkles size={16} />
            <span>Fun Learning Videos</span>
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Learn English with <span className="highlight">Amazing Videos!</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Songs, stories and lessons for every grade level
          </motion.p>
        </div>

        <div className="floating-icons">
          <motion.div 
            className="float-icon icon-1"
            animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >🎵</motion.div>
          <motion.div 
            className="float-icon icon-2"
            animate={{ y: [10, -10, 10], rotate: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >🎬</motion.div>
          <motion.div 
            className="float-icon icon-3"
            animate={{ y: [-5, 15, -5], rotate: [0, 15, 0] }}
            transition={{ duration: 4.5, repeat: Infinity }}
          >📚</motion.div>
        </div>
      </motion.div>

      {/* Grade Selection */}
      <motion.div 
        className="grade-selection"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="grade-header">
          <GraduationCap size={24} />
          <h2>Choose Your Grade</h2>
        </div>
        
        <div className="grade-buttons">
          {grades.map((grade, index) => (
            <motion.button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`grade-btn ${selectedGrade === grade ? 'active' : ''}`}
              style={grade !== 'All' && selectedGrade === grade ? { 
                background: gradeInfo[grade]?.gradient 
              } : {}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {grade === 'All' ? (
                <>
                  <span className="grade-emoji">🎯</span>
                  <span>All Videos</span>
                </>
              ) : (
                <>
                  <span className="grade-emoji">{gradeInfo[grade]?.emoji}</span>
                  <span>{grade}</span>
                </>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Popular Section - Only show when "All" is selected */}
      {selectedGrade === 'All' && (
        <motion.div 
          className="popular-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="section-header">
            <div className="section-title">
              <Star size={24} className="star-icon" />
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
                onClick={() => setSelectedVideo(video.id)}
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
                  <span 
                    className="grade-tag"
                    style={{ background: gradeInfo[video.grade]?.gradient }}
                  >
                    {gradeInfo[video.grade]?.emoji} {video.grade}
                  </span>
                  <h3>{video.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Videos Grid */}
      <motion.div 
        className="videos-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="section-header">
          <div className="section-title">
            <Users size={24} />
            <h2>
              {selectedGrade === 'All' ? 'All Videos' : `${selectedGrade} Videos`}
            </h2>
          </div>
          <p className="video-count">{filteredVideos.length} videos available</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedGrade}
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
                onClick={() => setSelectedVideo(video.id)}
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
                      {typeIcons[video.type]?.icon}
                      {typeIcons[video.type]?.label}
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
                  <span 
                    className="video-grade"
                    style={{ 
                      background: `${gradeInfo[video.grade]?.color}15`,
                      color: gradeInfo[video.grade]?.color 
                    }}
                  >
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

      {/* Video Modal */}
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
                ✕
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

      <style>{`
        .videos-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8f9ff 0%, #fff 50%, #f0f4ff 100%);
          padding-bottom: 4rem;
        }

        /* Hero Section */
        .videos-hero {
          position: relative;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          padding: 4rem 2rem;
          text-align: center;
          overflow: hidden;
          border-radius: 0 0 40px 40px;
          margin-bottom: 2rem;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          padding: 8px 20px;
          border-radius: 100px;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .hero-title .highlight {
          background: linear-gradient(90deg, #fef08a, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          color: rgba(255,255,255,0.9);
          font-size: 1.2rem;
          font-weight: 500;
        }

        .floating-icons {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .float-icon {
          position: absolute;
          font-size: 2.5rem;
          opacity: 0.3;
        }

        .icon-1 { top: 20%; left: 10%; }
        .icon-2 { top: 30%; right: 15%; }
        .icon-3 { bottom: 20%; left: 20%; }

        /* Grade Selection */
        .grade-selection {
          max-width: 900px;
          margin: 0 auto 3rem;
          padding: 0 1rem;
        }

        .grade-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 1.5rem;
          color: #4a4a6a;
        }

        .grade-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .grade-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .grade-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 1rem 1.75rem;
          border-radius: 16px;
          border: 2px solid #e5e7eb;
          background: white;
          color: #4a4a6a;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .grade-btn:hover {
          border-color: #8b5cf6;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.15);
        }

        .grade-btn.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-color: transparent;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
        }

        .grade-emoji {
          font-size: 1.3rem;
        }

        /* Popular Section */
        .popular-section {
          max-width: 1400px;
          margin: 0 auto 3rem;
          padding: 0 1rem;
        }

        .section-header {
          margin-bottom: 1.5rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 0.25rem;
        }

        .section-title h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
        }

        .section-title .star-icon {
          color: #fbbf24;
        }

        .section-subtitle {
          color: #6b7280;
          font-size: 1rem;
          margin: 0;
        }

        .video-count {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0;
        }

        .popular-scroll {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding: 1rem 0.5rem;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }

        .popular-scroll::-webkit-scrollbar {
          height: 8px;
        }

        .popular-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .popular-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
        }

        .popular-card {
          flex: 0 0 300px;
          scroll-snap-align: start;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .popular-thumbnail {
          position: relative;
          height: 170px;
          overflow: hidden;
        }

        .popular-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .popular-card:hover .popular-thumbnail img {
          transform: scale(1.1);
        }

        .popular-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .popular-card:hover .popular-overlay {
          opacity: 1;
        }

        .popular-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: white;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .duration-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .popular-info {
          padding: 1rem 1.25rem;
        }

        .grade-tag {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }

        .popular-info h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
          line-height: 1.4;
        }

        /* Videos Grid */
        .videos-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .video-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .video-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }

        .video-thumbnail {
          position: relative;
          height: 160px;
          overflow: hidden;
        }

        .video-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .video-card:hover .video-thumbnail img {
          transform: scale(1.1);
        }

        .video-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .video-card:hover .video-overlay {
          opacity: 1;
        }

        .play-button {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        }

        .video-badges {
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;
          display: flex;
          justify-content: space-between;
        }

        .type-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255,255,255,0.95);
          color: #6366f1;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .time-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .star-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-content {
          padding: 1.25rem;
        }

        .video-grade {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .video-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 6px;
          line-height: 1.4;
        }

        .video-desc {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        /* Modal */
        .video-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 2rem;
        }

        .video-modal {
          position: relative;
          width: 100%;
          max-width: 1000px;
          aspect-ratio: 16/9;
          background: #000;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .video-modal iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .modal-close {
          position: absolute;
          top: -50px;
          right: 0;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: white;
          color: #1a1a2e;
          font-size: 1.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          z-index: 10;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 1.75rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .grade-buttons {
            flex-direction: column;
          }

          .grade-btn {
            width: 100%;
            justify-content: center;
          }

          .videos-grid {
            grid-template-columns: 1fr;
          }

          .popular-card {
            flex: 0 0 260px;
          }

          .video-modal {
            border-radius: 12px;
          }

          .modal-close {
            top: -48px;
            right: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Videos;
