// Badge System - Achievement Tracking
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: number;
    category: 'learning' | 'streak' | 'social' | 'special';
    earned: boolean;
    earnedDate?: Date;
}

export const AVAILABLE_BADGES: Badge[] = [
    // Learning Badges
    { id: 'first_word', name: 'First Word', description: 'Learned your first word!', icon: '📖', requirement: 1, category: 'learning', earned: false },
    { id: 'word_master_10', name: 'Word Explorer', description: 'Learned 10 words', icon: '🌟', requirement: 10, category: 'learning', earned: false },
    { id: 'word_master_50', name: 'Word Champion', description: 'Learned 50 words', icon: '🏆', requirement: 50, category: 'learning', earned: false },
    { id: 'word_master_100', name: 'Word Legend', description: 'Learned 100 words!', icon: '👑', requirement: 100, category: 'learning', earned: false },

    // Streak Badges
    { id: 'streak_3', name: '3-Day Streak', description: '3 days in a row!', icon: '🔥', requirement: 3, category: 'streak', earned: false },
    { id: 'streak_7', name: 'Week Warrior', description: '7 days in a row!', icon: '⚡', requirement: 7, category: 'streak', earned: false },
    { id: 'streak_30', name: 'Monthly Master', description: '30 days in a row!', icon: '💎', requirement: 30, category: 'streak', earned: false },

    // Points Badges
    { id: 'points_100', name: 'Century Club', description: 'Earned 100 points', icon: '💯', requirement: 100, category: 'learning', earned: false },
    { id: 'points_500', name: 'Point Star', description: 'Earned 500 points', icon: '⭐', requirement: 500, category: 'learning', earned: false },
    { id: 'points_1000', name: 'Point Legend', description: 'Earned 1000 points!', icon: '🌟', requirement: 1000, category: 'learning', earned: false },

    // Special Badges
    { id: 'early_bird', name: 'Early Bird', description: 'Logged in before 8 AM', icon: '🌅', requirement: 1, category: 'special', earned: false },
    { id: 'night_owl', name: 'Night Owl', description: 'Logged in after 8 PM', icon: '🦉', requirement: 1, category: 'special', earned: false },
    { id: 'perfect_score', name: 'Perfect!', description: 'Got 100% on a quiz', icon: '💯', requirement: 1, category: 'special', earned: false },
    { id: 'ai_friend', name: 'AI Buddy', description: 'Had 10 conversations with Mimi', icon: '🐻', requirement: 10, category: 'social', earned: false },
];

export const checkBadgeProgress = (
    badgeId: string,
    currentProgress: number
): boolean => {
    const badge = AVAILABLE_BADGES.find(b => b.id === badgeId);
    if (!badge) return false;
    return currentProgress >= badge.requirement;
};

export const getUserBadges = (): Badge[] => {
    const stored = localStorage.getItem('user_badges');
    if (!stored) return AVAILABLE_BADGES;
    return JSON.parse(stored);
};

export const awardBadge = (badgeId: string): Badge | null => {
    const badges = getUserBadges();
    const badge = badges.find(b => b.id === badgeId);

    if (!badge || badge.earned) return null;

    badge.earned = true;
    badge.earnedDate = new Date();

    localStorage.setItem('user_badges', JSON.stringify(badges));

    // Show celebration animation
    showBadgeCelebration(badge);

    return badge;
};

const showBadgeCelebration = (badge: Badge) => {
    // Create celebration overlay
    const overlay = document.createElement('div');
    overlay.className = 'badge-celebration-overlay';
    overlay.innerHTML = `
    <div class="badge-celebration">
      <div class="badge-icon-large">${badge.icon}</div>
      <h2>🎉 New Badge Earned! 🎉</h2>
      <h3>${badge.name}</h3>
      <p>${badge.description}</p>
      <button class="celebration-close">Awesome!</button>
    </div>
  `;

    document.body.appendChild(overlay);

    // Add click handler
    overlay.querySelector('.celebration-close')?.addEventListener('click', () => {
        overlay.remove();
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (overlay.parentElement) {
            overlay.remove();
        }
    }, 5000);
};
