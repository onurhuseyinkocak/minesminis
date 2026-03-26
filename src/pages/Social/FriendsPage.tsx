import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getFriendCode,
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
  getPendingRequests,
  removeFriend,
  getFriendLeaderboard,
  type Friend,
  type FriendWeeklyStats,
} from '../../services/friendService';
import './FriendsPage.css';

function AvatarCircle({ name, url, size = 40 }: { name: string; url?: string; size?: number }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  // Zero-emoji rule: never render raw emoji as avatar.
  // If the URL doesn't look like a real image URL (http/https or /path), treat it as missing.
  const isRealImage = url && (url.startsWith('http') || url.startsWith('/'));

  return (
    <div
      className="friends-avatar"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label={name}
    >
      {isRealImage ? (
        <img src={url} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        initial
      )}
    </div>
  );
}

function MedalBadge({ rank, lang }: { rank: number; lang: 'en' | 'tr' }) {
  if (rank === 1)
    return (
      <span className="friends-medal friends-medal--gold" aria-label={lang === 'tr' ? '1. sıra' : '1st place'}>
        {lang === 'tr' ? '1.' : '1st'}
      </span>
    );
  if (rank === 2)
    return (
      <span className="friends-medal friends-medal--silver" aria-label={lang === 'tr' ? '2. sıra' : '2nd place'}>
        {lang === 'tr' ? '2.' : '2nd'}
      </span>
    );
  if (rank === 3)
    return (
      <span className="friends-medal friends-medal--bronze" aria-label={lang === 'tr' ? '3. sıra' : '3rd place'}>
        {lang === 'tr' ? '3.' : '3rd'}
      </span>
    );
  return (
    <span className="friends-rank-num" aria-label={lang === 'tr' ? `${rank}. sıra` : `Rank ${rank}`}>
      {rank}
    </span>
  );
}

export default function FriendsPage() {
  const { user } = useAuth();
  const { lang } = useLanguage();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [pending, setPending] = useState<Friend[]>([]);
  const [leaderboard, setLeaderboard] = useState<FriendWeeklyStats[]>([]);

  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  const [addCode, setAddCode] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addFeedback, setAddFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [copied, setCopied] = useState(false);

  const myCode = user ? getFriendCode(user.uid) : '';

  const loadAll = useCallback(async () => {
    if (!user) return;
    setLoadingFriends(true);
    setLoadingLeaderboard(true);

    try {
      const [friendsData, pendingData, leaderboardData] = await Promise.all([
        getFriends(user.uid),
        getPendingRequests(user.uid),
        getFriendLeaderboard(user.uid),
      ]);

      setFriends(friendsData);
      setPending(pendingData);
      setLeaderboard(leaderboardData);
    } catch {
      setFriends([]);
      setPending([]);
      setLeaderboard([]);
    } finally {
      setLoadingFriends(false);
      setLoadingLeaderboard(false);
    }
  }, [user]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleCopy = () => {
    navigator.clipboard.writeText(myCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Clipboard API can fail in insecure contexts or denied permissions
    });
  };

  const handleSendRequest = async () => {
    if (!user || !addCode.trim()) return;
    setAddLoading(true);
    setAddFeedback(null);
    const result = await sendFriendRequest(user.uid, addCode.trim());
    setAddLoading(false);
    if (result.success) {
      setAddFeedback({
        type: 'success',
        message: lang === 'tr' ? 'Arkadaşlık isteği gönderildi!' : 'Friend request sent!',
      });
      setAddCode('');
    } else {
      setAddFeedback({
        type: 'error',
        message: result.error ?? (lang === 'tr' ? 'İstek gönderilemedi.' : 'Failed to send request.'),
      });
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      await loadAll();
    } catch {
      setAddFeedback({
        type: 'error',
        message: lang === 'tr' ? 'Arkadaşlık isteği kabul edilemedi.' : 'Failed to accept friend request.',
      });
    }
  };

  const handleDecline = async (friendRowId: string) => {
    try {
      await removeFriend(friendRowId);
      await loadAll();
    } catch {
      setAddFeedback({
        type: 'error',
        message: lang === 'tr' ? 'Arkadaşlık isteği reddedilemedi.' : 'Failed to decline friend request.',
      });
    }
  };

  const handleRemove = async (friendRowId: string) => {
    try {
      await removeFriend(friendRowId);
      await loadAll();
    } catch {
      setAddFeedback({
        type: 'error',
        message: lang === 'tr' ? 'Arkadaş kaldırılamadı.' : 'Failed to remove friend.',
      });
    }
  };

  if (!user) {
    return (
      <div className="friends-page">
        <div className="friends-empty-state">
          <p>
            {lang === 'tr'
              ? 'Arkadaşlarını görmek için giriş yap.'
              : 'Please log in to see your friends.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="friends-page">
      <div className="friends-page__inner">

        {/* Page Header */}
        <div className="friends-header">
          <h1 className="friends-title">
            {lang === 'tr' ? 'Arkadaşlar & Haftalık Yarışma' : 'Friends & Weekly Challenge'}
          </h1>
          <p className="friends-subtitle">
            {lang === 'tr'
              ? 'Arkadaşlarınla bağlan ve haftalık XP sıralamasında yarış!'
              : 'Connect with friends and compete on the weekly XP leaderboard!'}
          </p>
        </div>

        {/* My Friend Code */}
        <section className="friends-section friends-code-section">
          <h2 className="friends-section-title">
            {lang === 'tr' ? 'Arkadaş Kodum' : 'My Friend Code'}
          </h2>
          <div className="friends-code-card">
            <div className="friends-code-display">
              <span className="friends-code-value">{myCode}</span>
            </div>
            <button
              type="button"
              className={`friends-btn friends-btn--outline ${copied ? 'friends-btn--copied' : ''}`}
              onClick={handleCopy}
              aria-label={lang === 'tr' ? 'Arkadaş kodunu kopyala' : 'Copy friend code'}
            >
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {lang === 'tr' ? 'Kopyalandı!' : 'Copied!'}
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {lang === 'tr' ? 'Kodu Kopyala' : 'Copy Code'}
                </>
              )}
            </button>
          </div>
          <p className="friends-code-hint">
            {lang === 'tr'
              ? 'Bu kodu arkadaşlarınla paylaş, seni ekleyebilsinler!'
              : 'Share this code with friends so they can add you!'}
          </p>
        </section>

        {/* Add Friend */}
        <section className="friends-section">
          <h2 className="friends-section-title">
            {lang === 'tr' ? 'Arkadaş Ekle' : 'Add a Friend'}
          </h2>
          <div className="friends-add-form">
            <input
              type="text"
              className="friends-input"
              placeholder={lang === 'tr' ? '8 karakterli arkadaş kodunu gir' : 'Enter 8-character friend code'}
              value={addCode}
              onChange={(e) => setAddCode(e.target.value)}
              maxLength={8}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendRequest(); }}
              aria-label={lang === 'tr' ? 'Arkadaş kodu girişi' : 'Friend code input'}
            />
            <button
              type="button"
              className="friends-btn friends-btn--primary"
              onClick={handleSendRequest}
              disabled={addLoading || addCode.trim().length === 0}
            >
              {addLoading ? (
                <span className="friends-spinner" aria-hidden="true" />
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                  {lang === 'tr' ? 'İstek Gönder' : 'Send Request'}
                </>
              )}
            </button>
          </div>
          {addFeedback && (
            <p className={`friends-feedback friends-feedback--${addFeedback.type}`} role="status">
              {addFeedback.message}
            </p>
          )}
        </section>

        {/* Pending Requests */}
        {(loadingFriends || pending.length > 0) && (
          <section className="friends-section">
            <h2 className="friends-section-title">
              {lang === 'tr' ? 'Bekleyen İstekler' : 'Pending Requests'}
              {pending.length > 0 && (
                <span className="friends-badge">{pending.length}</span>
              )}
            </h2>
            {loadingFriends ? (
              <div className="friends-loading" role="status" aria-label={lang === 'tr' ? 'İstekler yükleniyor' : 'Loading requests'}>
                <span className="friends-spinner friends-spinner--lg" aria-hidden="true" />
              </div>
            ) : (
              <ul className="friends-pending-list" aria-label={lang === 'tr' ? 'Bekleyen arkadaşlık istekleri' : 'Pending friend requests'}>
                {pending.map((req) => (
                  <li key={req.id} className="friends-pending-item">
                    <AvatarCircle name={req.friendDisplayName} url={req.friendAvatarUrl} size={44} />
                    <span className="friends-pending-name">{req.friendDisplayName}</span>
                    <div className="friends-pending-actions">
                      <button
                        type="button"
                        className="friends-btn friends-btn--sm friends-btn--accept"
                        onClick={() => handleAccept(req.id)}
                        aria-label={
                          lang === 'tr'
                            ? `${req.friendDisplayName} isteğini kabul et`
                            : `Accept request from ${req.friendDisplayName}`
                        }
                      >
                        {lang === 'tr' ? 'Kabul Et' : 'Accept'}
                      </button>
                      <button
                        type="button"
                        className="friends-btn friends-btn--sm friends-btn--decline"
                        onClick={() => handleDecline(req.id)}
                        aria-label={
                          lang === 'tr'
                            ? `${req.friendDisplayName} isteğini reddet`
                            : `Decline request from ${req.friendDisplayName}`
                        }
                      >
                        {lang === 'tr' ? 'Reddet' : 'Decline'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Friends Grid */}
        <section className="friends-section">
          <h2 className="friends-section-title">
            {lang === 'tr' ? 'Arkadaşlarım' : 'My Friends'}
            {friends.length > 0 && (
              <span className="friends-count">{friends.length}</span>
            )}
          </h2>
          {loadingFriends ? (
            <div className="friends-loading" role="status" aria-label={lang === 'tr' ? 'Arkadaşlar yükleniyor' : 'Loading friends'}>
              <span className="friends-spinner friends-spinner--lg" aria-hidden="true" />
            </div>
          ) : friends.length === 0 ? (
            <div className="friends-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="friends-empty-icon" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p>
                {lang === 'tr'
                  ? 'Henüz arkadaş yok. Başlamak için kodunu paylaş!'
                  : 'No friends yet. Share your code to get started!'}
              </p>
            </div>
          ) : (
            <ul className="friends-grid" aria-label={lang === 'tr' ? 'Arkadaş listesi' : 'Friends list'}>
              {friends.map((friend) => (
                <li key={friend.id} className="friends-card">
                  <AvatarCircle name={friend.friendDisplayName} url={friend.friendAvatarUrl} size={52} />
                  <div className="friends-card__info">
                    <span className="friends-card__name">{friend.friendDisplayName}</span>
                    <span className="friends-card__code">#{getFriendCode(friend.friendId)}</span>
                  </div>
                  <button
                    type="button"
                    className="friends-btn friends-btn--ghost friends-btn--sm"
                    onClick={() => handleRemove(friend.id)}
                    aria-label={
                      lang === 'tr'
                        ? `${friend.friendDisplayName} arkadaşlıktan çıkar`
                        : `Remove ${friend.friendDisplayName} from friends`
                    }
                    title={lang === 'tr' ? 'Arkadaşı kaldır' : 'Remove friend'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Weekly Leaderboard */}
        <section className="friends-section">
          <h2 className="friends-section-title">
            {lang === 'tr' ? 'Haftalık XP Sıralaması' : 'Weekly XP Leaderboard'}
          </h2>
          <p className="friends-section-desc">
            {lang === 'tr'
              ? 'Her Pazartesi sıfırlanır — sıralamada yükselmek için öğrenmeye devam et!'
              : 'Resets every Monday — keep learning to climb the ranks!'}
          </p>
          {loadingLeaderboard ? (
            <div className="friends-loading" role="status" aria-label={lang === 'tr' ? 'Sıralama yükleniyor' : 'Loading leaderboard'}>
              <span className="friends-spinner friends-spinner--lg" aria-hidden="true" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="friends-empty-state">
              <p>
                {lang === 'tr'
                  ? 'Haftalık sıralamayı görmek için arkadaş ekle!'
                  : 'Add friends to see the weekly leaderboard!'}
              </p>
            </div>
          ) : (
            <ol className="friends-leaderboard" aria-label={lang === 'tr' ? 'Haftalık XP sıralaması' : 'Weekly XP leaderboard'}>
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                const isMe = entry.userId === user.uid;
                return (
                  <li
                    key={entry.userId}
                    className={`friends-leaderboard__row ${isMe ? 'friends-leaderboard__row--me' : ''} ${rank <= 3 ? `friends-leaderboard__row--top${rank}` : ''}`}
                  >
                    <div className="friends-leaderboard__rank">
                      <MedalBadge rank={rank} lang={lang} />
                    </div>
                    <AvatarCircle name={entry.displayName} url={entry.avatarUrl} size={40} />
                    <div className="friends-leaderboard__info">
                      <span className="friends-leaderboard__name">
                        {entry.displayName}
                        {isMe && (
                          <span className="friends-leaderboard__you">
                            {lang === 'tr' ? ' (Sen)' : ' (You)'}
                          </span>
                        )}
                      </span>
                      <div className="friends-leaderboard__stats">
                        <span className="friends-stat">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          Lv {entry.level}
                        </span>
                        <span className="friends-stat">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                          </svg>
                          {entry.streak}{lang === 'tr' ? 'g seri' : 'd streak'}
                        </span>
                      </div>
                    </div>
                    <div className="friends-leaderboard__xp">
                      <span className="friends-leaderboard__xp-value">{entry.weeklyXP.toLocaleString()}</span>
                      <span className="friends-leaderboard__xp-label">XP</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

      </div>
    </div>
  );
}
