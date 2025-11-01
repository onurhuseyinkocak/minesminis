import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, BookOpen, GamepadIcon, Video, Users, Trophy } from 'lucide-react';
import './Landing.css';

const Landing: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          setError('This email is already registered. Please login instead.');
          setIsLogin(true);
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(error.message);
        }
      }
    } catch (err: any) {
      if (err?.message?.includes('already registered')) {
        setError('This email is already registered. Please login instead.');
        setIsLogin(true);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mascot"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles size={80} className="mascot-icon" />
          </motion.div>

          <h1 className="hero-title">
            Welcome to <span className="gradient-text">MinesMinis</span>
          </h1>
          <p className="hero-subtitle">
            The most fun and engaging English learning platform for children!
          </p>

          <div className="feature-badges">
            <motion.div className="feature-badge" whileHover={{ scale: 1.05 }}>
              <BookOpen size={24} />
              <span>Interactive Lessons</span>
            </motion.div>
            <motion.div className="feature-badge" whileHover={{ scale: 1.05 }}>
              <GamepadIcon size={24} />
              <span>Fun Games</span>
            </motion.div>
            <motion.div className="feature-badge" whileHover={{ scale: 1.05 }}>
              <Video size={24} />
              <span>Educational Videos</span>
            </motion.div>
            <motion.div className="feature-badge" whileHover={{ scale: 1.05 }}>
              <Users size={24} />
              <span>Social Learning</span>
            </motion.div>
            <motion.div className="feature-badge" whileHover={{ scale: 1.05 }}>
              <Trophy size={24} />
              <span>Earn Rewards</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="auth-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            )}

            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="auth-submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="spinner" />
              ) : isLogin ? (
                'Login'
              ) : (
                'Create Account'
              )}
            </motion.button>

            <p className="auth-hint">
              {isLogin ? (
                <>Don't have an account? <button type="button" onClick={() => setIsLogin(false)} className="link-button">Sign up</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => setIsLogin(true)} className="link-button">Login</button></>
              )}
            </p>
          </form>
        </motion.div>
      </div>

      <div className="floating-shapes">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`shape shape-${i + 1}`}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Landing;
