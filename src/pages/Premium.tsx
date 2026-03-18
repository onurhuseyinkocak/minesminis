import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import { Crown, Check, Star, Sparkles, Zap, MessageCircle, Gamepad2, BookOpen, Trophy } from 'lucide-react';
import './Premium.css';

const premiumFeatures = [
  { icon: <MessageCircle size={32} strokeWidth={2.5} />, title: 'Unlimited Chat with Mimi', description: 'Practice English as much as you want with our AI dragon Mimi!' },
  { icon: <Gamepad2 size={32} strokeWidth={2.5} />, title: 'All Educational Games', description: 'Word matching, memory games, speed rounds, and more!' },
  { icon: <BookOpen size={32} strokeWidth={2.5} />, title: 'Vocabulary Practice', description: 'Visual and audio learning experience with 100+ words' },
  { icon: <Trophy size={32} strokeWidth={2.5} />, title: 'Daily Challenges', description: 'Keep learning with new questions every day!' },
  { icon: <Zap size={32} strokeWidth={2.5} />, title: 'Sentence Builder', description: 'Learn English sentence structure while having fun' },
  { icon: <Star size={32} strokeWidth={2.5} />, title: 'Balloon Pop', description: 'Exciting timed vocabulary competition!' },
];

export default function Premium() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, plan, subscriptionStatus, isLoading } = usePremium();

  return (
    <div className="premium-page">
      <div className="premium-container">
        <div className="premium-hero">
          <div className="hero-badge">
            <Sparkles size={20} />
            <span>Premium</span>
          </div>
          <h1>{isPremium ? 'You\'re Premium!' : 'Unlimited AI Chat with Mimi!'}</h1>
          <p>
            {isPremium
              ? 'Thank you for being a Premium member! Enjoy unlimited access to all features.'
              : 'Upgrade to Premium to unlock unlimited English practice with Mimi and all educational content.'}
          </p>
          <div className="hero-sparkles">
            <Sparkles className="sparkle-1" size={24} />
            <Sparkles className="sparkle-2" size={20} />
            <Sparkles className="sparkle-3" size={16} />
          </div>
        </div>

        {isLoading ? (
          <div className="premium-coming-soon-card">
            <Crown size={48} className="coming-soon-icon" />
            <h2>Loading your subscription...</h2>
          </div>
        ) : isPremium ? (
          <div className="premium-coming-soon-card">
            <Crown size={48} className="coming-soon-icon" />
            <h2>Active {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan</h2>
            <p>
              You have full access to all worlds, unlimited Mimi chat, educational games, progress tracking, and more.
              {subscriptionStatus === 'active' && ' Your subscription is active.'}
            </p>
            <button type="button" className="back-btn" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="premium-coming-soon-card">
            <Crown size={48} className="coming-soon-icon" />
            <h2>Upgrade to Premium</h2>
            <p>Unlock unlimited Mimi chat, all 12 worlds, progress tracking, achievement badges, and an ad-free experience!</p>
            <button type="button" className="back-btn" onClick={() => navigate('/pricing')}>
              View Plans &amp; Pricing
            </button>
          </div>
        )}

        <div className="features-section animate-up" style={{ animationDelay: '0.2s' }}>
          <div className="section-badge">✨ Premium Perks</div>
          <h2>Why Choose Premium?</h2>
          <div className="features-grid">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="feature-card glass-morphism">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="comparison-section">
          <h2>Free vs Premium</h2>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="feature-col">Feature</div>
              <div className="free-col">Free</div>
              <div className="premium-col">Premium</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Chat with Mimi</div>
              <div className="free-col">10 messages / day</div>
              <div className="premium-col"><Check size={18} /> Unlimited</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Educational games</div>
              <div className="free-col"><Check size={18} /> All</div>
              <div className="premium-col"><Check size={18} /> All</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Vocabulary practice</div>
              <div className="free-col"><Check size={18} /> All</div>
              <div className="premium-col"><Check size={18} /> All</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Daily challenge</div>
              <div className="free-col"><Check size={18} /></div>
              <div className="premium-col"><Check size={18} /></div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Progress tracking</div>
              <div className="free-col"><Check size={18} /></div>
              <div className="premium-col"><Check size={18} /></div>
            </div>
          </div>
        </div>

        {!user && (
          <div className="login-prompt">
            <p>Log in to get the most out of MinesMinis.</p>
            <button type="button" onClick={() => navigate('/login', { state: { from: '/premium' } })}>
              Log In / Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
