import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PremiumProvider } from "./contexts/PremiumContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import { HeartsProvider } from "./contexts/HeartsContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/ToastProvider";
import SplashScreen from "./components/SplashScreen";
import { AppShell } from "./components/layout";
import { sendMessageToAI } from "./services/aiService";
import { errorLogger } from "./services/errorLogger";
import OfflineBanner from "./components/OfflineBanner";
import InstallBanner from "./components/InstallBanner";
import { getNextAction } from "./services/learningPathService";
import { getTodayMinutes } from "./services/activityLogger";
import NotificationPrompt from "./components/NotificationPrompt";
import {
  getLessonCount,
  hasSeenNotificationPrompt,
  markNotificationPromptShown,
  requestNotificationPermission,
  scheduleStreakReminder,
} from "./services/notificationService";

import { Star } from "lucide-react";
import LottieCharacter from "./components/LottieCharacter";
import FloatingMascot from "./components/FloatingMascot";
import CatHouseWidget from "./components/CatHouseWidget";
import { validateCurriculumData } from "./utils/dataValidation";
import { LS_DAILY_TIME_LIMIT } from "./config/storageKeys";
import { initTTS } from "./services/ttsService";
import "./App.css";

// Initialize error logging
errorLogger.init();

// ─── Lazy-loaded pages ───────────────────────────────────────────────────────

// Public
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const PrivacyPolicy = lazy(() => import("./pages/Legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/Legal/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/Legal/CookiePolicy"));
const Ataturk = lazy(() => import("./pages/Ataturk"));

// Protected – Student
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ChildHome = lazy(() => import("./pages/ChildHome"));
const WorldMap = lazy(() => import("./pages/WorldMap"));
const WorldDetail = lazy(() => import("./pages/WorldDetail"));
const LessonPlayer = lazy(() => import("./pages/LessonPlayer"));
const Games = lazy(() => import("./pages/Games"));
const PracticeMode = lazy(() => import("./pages/Student/PracticeMode"));
const PlacementTest = lazy(() => import("./pages/Student/PlacementTest"));
const PhonicsLesson = lazy(() => import("./pages/Student/PhonicsLesson"));
const SongsPage = lazy(() => import("./pages/Student/SongsPage"));
const LearningGarden = lazy(() => import("./pages/Student/LearningGarden"));
const Words = lazy(() => import("./pages/Words"));
const FlashcardReview = lazy(() => import("./pages/FlashcardReview"));
const Videos = lazy(() => import("./pages/Videos"));
const StoryPage = lazy(() => import("./pages/Story/StoryPage"));
const StoriesGrid = lazy(() => import("./pages/StoriesGrid"));
const StoryReader = lazy(() => import("./pages/StoryReader"));
const Profile = lazy(() => import("./pages/Profile"));
const Premium = lazy(() => import("./pages/Premium"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Worksheets = lazy(() => import("./pages/Worksheets"));
const Favorites = lazy(() => import("./pages/Favorites"));
const ReadingLibrary = lazy(() => import("./pages/Student/ReadingLibrary"));
const PhoneticsTrapTrainer = lazy(() => import("./pages/Student/PhoneticsTrapTrainer"));
const LetterTracingPage = lazy(() => import("./pages/Student/LetterTracingPage"));
const DailyLesson = lazy(() => import("./pages/DailyLesson"));
const FriendsPage = lazy(() =>
  import("./pages/Social").then((m) => ({ default: m.FriendsPage }))
);
const Achievements = lazy(() => import("./pages/Achievements"));
const MascotSelector = lazy(() => import("./pages/MascotSelector"));
const AvatarCustomizer = lazy(() => import("./pages/AvatarCustomizer"));
const LeaderboardPage = lazy(() => import("./components/Leaderboard"));
const SettingsPage = lazy(() => import("./pages/Settings"));

// Parent
const ParentDashboard = lazy(() => import("./pages/Parent/ParentDashboard"));

// Teacher
const TeacherDashboard = lazy(() =>
  import("./pages/Teacher").then((m) => ({ default: m.TeacherDashboard }))
);

// Admin
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));

// 404
const NotFound = lazy(() => import("./pages/NotFound"));

// Gamification overlays
const DailyReward = lazy(() => import("./components/DailyReward"));
const LevelUpModal = lazy(() => import("./components/LevelUpModal"));

// Chat
const ChatHome = lazy(() => import("./components/ChatHome"));

// ─── Service worker ──────────────────────────────────────────────────────────

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      errorLogger.log({
        severity: 'low',
        message: `Service worker registration failed: ${err?.message || err}`,
        component: 'App',
      });
    });
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Scroll window and main content to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      const main = document.getElementById("main-content");
      if (main) main.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);
  return null;
}

/** Loading fallback shown inside Suspense boundaries */
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__spinner" />
    </div>
  );
}

/** Auth-aware loader that shows a timeout message when auth is slow */
function AuthPageLoader() {
  const { authTimeoutReached } = useAuth();
  return (
    <div className="page-loader">
      <div className="page-loader__spinner" />
      {authTimeoutReached && (
        <p style={{ marginTop: 16, color: 'var(--text-secondary)', fontSize: 14, textAlign: 'center' }}>
          {navigator.language.startsWith('tr')
            ? 'Bağlantı yavaşlıyor... Lütfen bekleyin.'
            : 'Connection is slow... Please wait.'}
        </p>
      )}
    </div>
  );
}

/** Wrapper that requires authentication; redirects to /login otherwise */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <AuthPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Wrapper that requires authentication and the 'parent' role */
function ParentRoute({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading, profileLoading } = useAuth();
  if (loading) return <AuthPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (profileLoading) return <AuthPageLoader />;
  if (!userProfile || userProfile.role !== 'parent') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/** Wrapper that requires authentication and the 'teacher' role */
function TeacherRoute({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading, profileLoading } = useAuth();
  if (loading) return <AuthPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (profileLoading) return <AuthPageLoader />;
  if (!userProfile || userProfile.role !== 'teacher') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/** Time limit overlay shown when student exceeds daily limit */
function TimeLimitOverlay({ minutes, limit }: { minutes: number; limit: number }) {
  const isTr = navigator.language.startsWith('tr');
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '70vh', textAlign: 'center',
      padding: '32px 24px', gap: 16,
    }}>
      <div style={{ fontSize: 72, color: 'var(--primary, #E8A317)' }}><Star size={72} /></div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
        {isTr ? 'Harika iş bugün!' : 'Great job today!'}
      </h1>
      <p style={{ fontSize: 18, color: 'var(--text-secondary)', margin: 0, maxWidth: 360 }}>
        {isTr
          ? <><strong>{minutes} dakika</strong> öğrendin bugün. Yarın daha fazlası için geri gel!</>
          : <>You learned for <strong>{minutes} minutes</strong> today. Come back tomorrow for more fun!</>}
      </p>
      <div style={{ display: 'flex', gap: 24, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: 'var(--primary-pale, #eff6ff)', borderRadius: 16, padding: '16px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>{minutes} {isTr ? 'dk' : 'min'}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{isTr ? 'Öğrenme Süresi' : 'Time Learned'}</div>
        </div>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>
        {isTr ? `Günlük limit: ${limit} dakika` : `Daily limit: ${limit} minutes`}
      </p>
    </div>
  );
}

/** Enforces daily time limit for student routes */
function TimeGuardedRoute({ children }: { children: React.ReactNode }) {
  const { userProfile } = useAuth();
  const isStudent = !userProfile?.role || userProfile.role === 'student';

  if (!isStudent) {
    return <>{children}</>;
  }

  const parsed = parseInt(localStorage.getItem(LS_DAILY_TIME_LIMIT) || '0', 10);
  const savedLimit = isNaN(parsed) ? 0 : parsed;
  const rawLimit = userProfile?.settings?.dailyTimeLimit;
  const profileLimit = typeof rawLimit === 'number' ? rawLimit : 0;
  const dailyLimit = savedLimit || profileLimit || 60;
  const todayMinutes = getTodayMinutes();

  if (todayMinutes >= dailyLimit) {
    return <TimeLimitOverlay minutes={todayMinutes} limit={dailyLimit} />;
  }

  return <>{children}</>;
}

/** Wraps protected student pages inside AppShell */
function StudentRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell showSidebar>
        <TimeGuardedRoute>{children}</TimeGuardedRoute>
      </AppShell>
    </ProtectedRoute>
  );
}

/** Returns true when the child-mode experience should be shown. */
function isChildMode(settings: Record<string, unknown> | undefined): boolean {
  if (typeof settings?.ageGroup === 'string' && settings.ageGroup === '3-5') return true;
  try {
    return localStorage.getItem('mm_child_mode') === 'true';
  } catch {
    return false;
  }
}

/**
 * Dashboard selector — renders ChildHome for young learners (ages 3-6 or
 * child mode toggle on), otherwise falls back to the normal Dashboard.
 */
function DashboardSelector() {
  const { userProfile } = useAuth();
  if (isChildMode(userProfile?.settings)) {
    return (
      <Suspense fallback={<PageLoader />}>
        <ChildHome />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <Dashboard />
    </Suspense>
  );
}

// ─── Routes ──────────────────────────────────────────────────────────────────

function AppRoutes() {
  const { user, loading, isAdmin, profileLoading } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const authReady = !loading;
  const profileReady = !user || !profileLoading;
  const showContent = authReady && profileReady;

  // While auth or profile is loading, show loader — prevents flash of onboarding
  if (!showContent) {
    return <PageLoader />;
  }

  // Admin routes have their own layout — no AppShell
  if (isAdminRoute) {
    if (!user || !isAdmin) {
      return (
        <Routes>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      );
    }
    return (
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<PageLoader />}>
              <ErrorBoundary>
                <AdminLayout />
              </ErrorBoundary>
            </Suspense>
          }
        />
      </Routes>
    );
  }

  return (
    <>
      <ScrollToTop />
      <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <div key={location.pathname} className="route-fade">
          <Routes>
            {/* ── Public ────────────────────────────────────────── */}
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />
                ) : (
                  <Landing />
                )
              }
            />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/signup"
              element={
                user ? (
                  <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />
                ) : (
                  <Navigate to="/login?tab=signup" replace />
                )
              }
            />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/ataturk" element={<Ataturk />} />

            {/* ── Onboarding (protected, no shell) ──────────────── */}
            <Route
              path="/setup"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            {/* ── Student routes (protected + AppShell) ─────────── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppShell showSidebar>
                    <TimeGuardedRoute>
                      <DashboardSelector />
                    </TimeGuardedRoute>
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route path="/worlds" element={<StudentRoute><WorldMap /></StudentRoute>} />
            <Route path="/worlds/:worldId" element={<StudentRoute><WorldDetail /></StudentRoute>} />
            <Route path="/worlds/:worldId/lessons/:lessonId" element={<StudentRoute><LessonPlayer /></StudentRoute>} />
            <Route path="/games" element={<StudentRoute><Games /></StudentRoute>} />
            <Route path="/practice" element={<StudentRoute><PracticeMode /></StudentRoute>} />
            <Route path="/words" element={<StudentRoute><Words /></StudentRoute>} />
            <Route path="/review/flashcards" element={<StudentRoute><FlashcardReview /></StudentRoute>} />
            <Route path="/videos" element={<StudentRoute><Videos /></StudentRoute>} />
            <Route path="/story" element={<StudentRoute><StoryPage /></StudentRoute>} />
            <Route path="/stories" element={<StudentRoute><StoriesGrid /></StudentRoute>} />
            <Route path="/stories/:id" element={<StudentRoute><StoryReader /></StudentRoute>} />
            <Route path="/profile" element={<StudentRoute><Profile /></StudentRoute>} />
            <Route path="/premium" element={<StudentRoute><Premium /></StudentRoute>} />
            <Route path="/premium/success" element={<StudentRoute><Premium /></StudentRoute>} />
            <Route path="/worksheets" element={<StudentRoute><Worksheets /></StudentRoute>} />
            <Route path="/favorites" element={<StudentRoute><Favorites /></StudentRoute>} />
            <Route path="/placement" element={<ErrorBoundary><ProtectedRoute><PlacementTest /></ProtectedRoute></ErrorBoundary>} />
            <Route path="/phonics/:soundId" element={<StudentRoute><PhonicsLesson /></StudentRoute>} />
            <Route path="/songs" element={<StudentRoute><SongsPage /></StudentRoute>} />
            <Route path="/garden" element={<StudentRoute><LearningGarden /></StudentRoute>} />
            <Route path="/reading" element={<StudentRoute><ReadingLibrary /></StudentRoute>} />
            <Route path="/reading/:bookId" element={<StudentRoute><ReadingLibrary /></StudentRoute>} />
            <Route path="/daily-lesson" element={<StudentRoute><DailyLesson /></StudentRoute>} />
            <Route path="/social/friends" element={<StudentRoute><FriendsPage /></StudentRoute>} />
            <Route path="/achievements" element={<StudentRoute><Achievements /></StudentRoute>} />
            <Route path="/leaderboard" element={<StudentRoute><LeaderboardPage /></StudentRoute>} />
            <Route path="/mascots" element={<StudentRoute><MascotSelector /></StudentRoute>} />
            <Route path="/avatar" element={<StudentRoute><AvatarCustomizer /></StudentRoute>} />
            <Route path="/phonetics/traps" element={<StudentRoute><PhoneticsTrapTrainer /></StudentRoute>} />
            <Route path="/tracing" element={<StudentRoute><LetterTracingPage /></StudentRoute>} />
            <Route path="/settings" element={<StudentRoute><SettingsPage /></StudentRoute>} />
            <Route path="/pricing" element={<Pricing />} />

            {/* ── Parent routes (protected, parent role only) ───── */}
            <Route
              path="/parent"
              element={
                <ParentRoute>
                  <AppShell showSidebar={false}>
                    <ParentDashboard />
                  </AppShell>
                </ParentRoute>
              }
            />

            {/* ── Teacher routes (protected, teacher role only) ── */}
            <Route
              path="/teacher"
              element={
                <TeacherRoute>
                  <AppShell showSidebar={false}>
                    <TeacherDashboard />
                  </AppShell>
                </TeacherRoute>
              }
            />

            {/* ── Catch-all ──────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Suspense>
      </ErrorBoundary>
    </>
  );
}

// ─── App Content (auth-dependent overlays) ───────────────────────────────────

function WhatsNextButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();
  const action = getNextAction();
  const isTr = navigator.language?.startsWith('tr') ?? false;

  return (
    <div style={{ position: "fixed", bottom: 90, right: 20, zIndex: 900 }}>
      {showTooltip && (
        <button
          onClick={() => {
            setShowTooltip(false);
            navigate(action.route);
          }}
          style={{
            position: "absolute",
            bottom: 52,
            right: 0,
            background: "var(--bg-elevated)",
            border: "1px solid var(--glass-border, #334155)",
            borderRadius: 14,
            padding: "10px 16px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            whiteSpace: "nowrap",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-primary)",
            fontFamily: "Nunito, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>{isTr ? 'Sıradaki' : 'Next'}: {isTr ? action.titleTr : action.title}</span>
        </button>
      )}
      <button
        onClick={() => setShowTooltip((v) => !v)}
        aria-label="What's next?"
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1px solid var(--glass-border, #334155)",
          background: "var(--bg-elevated)",
          color: "var(--primary)",
          fontSize: 20,
          fontWeight: 800,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        ?
      </button>
    </div>
  );
}

function AppContent() {
  const [showChat, setShowChat] = useState(false);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isSetupRoute = location.pathname === "/setup";

  const { user, userProfile, hasSkippedSetup, loading, profileLoading, isAdmin } = useAuth();

  // Show notification prompt after 3+ lessons if not yet shown
  useEffect(() => {
    if (!user || isAdminRoute || isSetupRoute) return;
    if (hasSeenNotificationPrompt()) return;
    if (getLessonCount() >= 3) {
      setShowNotifPrompt(true);
    }
  }, [user, isAdminRoute, isSetupRoute]);

  const handleNotifAccept = useCallback(async () => {
    setShowNotifPrompt(false);
    markNotificationPromptShown('accepted');
    const { granted } = await requestNotificationPermission();
    if (granted) {
      scheduleStreakReminder(null, userProfile?.streak_days ?? 0);
    }
  }, [userProfile?.streak_days]);

  const handleNotifDecline = useCallback(() => {
    setShowNotifPrompt(false);
    markNotificationPromptShown('declined');
  }, []);

  // Admin: redirect to admin panel immediately
  useEffect(() => {
    if (user && isAdmin && !isAdminRoute) {
      navigate("/admin");
    }
  }, [user, isAdmin, isAdminRoute, navigate]);

  // Redirect to setup if not completed (non-admin only, after profile loads)
  useEffect(() => {
    if (loading) return;
    if (user && isAdmin) return;
    if (profileLoading) return;

    const isSetupCompleted = userProfile?.settings?.setup_completed === true;

    if (user && !isSetupCompleted && !hasSkippedSetup && !isSetupRoute && !isAdminRoute) {
      navigate("/setup");
    }

    if (user && isSetupCompleted && isSetupRoute) {
      navigate("/dashboard");
    }
  }, [user, userProfile, hasSkippedSetup, isSetupRoute, isAdminRoute, loading, profileLoading, navigate, isAdmin]);

  return (
    <>
      {/* Screen reader live region — must be in the DOM at all times */}
      <div
        id="sr-announcer"
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}
      />
      <OfflineBanner />
      <InstallBanner />
      <AppRoutes />

      {/* Gamification overlays for authenticated users */}
      {user && !isAdminRoute && !isSetupRoute && (
        <Suspense fallback={null}>
          <DailyReward />
          <LevelUpModal />
        </Suspense>
      )}

      {/* Notification permission prompt — shown after 3rd lesson completion */}
      {showNotifPrompt && (
        <NotificationPrompt
          onAccept={handleNotifAccept}
          onDecline={handleNotifDecline}
        />
      )}

      {/* Floating chat button */}
      {user && !isAdminRoute && !isSetupRoute && (
        <button
          className="floating-chat-btn"
          onClick={() => setShowChat(true)}
          aria-label="Open chat"
        >
          <LottieCharacter state="happy" size={28} />
        </button>
      )}

      {/* What's Next? floating button (students only) */}
      {user && !isAdmin && !isAdminRoute && !isSetupRoute && (
        <WhatsNextButton />
      )}

      {/* Floating mascot (authenticated students only) */}
      {user && !isAdmin && !isAdminRoute && !isSetupRoute && (
        <FloatingMascot />
      )}

      {/* Cat house widget — always visible for students */}
      {user && !isAdmin && !isAdminRoute && !isSetupRoute && (
        <CatHouseWidget />
      )}

      {/* Chat modal */}
      {showChat && (
        <Suspense fallback={null}>
          <ChatHome
            onClose={() => setShowChat(false)}
            onSendMessage={async (history) => {
              const messagesForAI = history.map((msg) => ({
                role: msg.role,
                content: msg.content,
                timestamp: new Date(),
              }));
              return await sendMessageToAI(messagesForAI);
            }}
          />
        </Suspense>
      )}
    </>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("mm_splash_seen");
      if (seen) return false;
      sessionStorage.setItem("mm_splash_seen", "1");
      return true;
    }
    return false;
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Pre-load Web Speech API voices so they are ready when the child taps a speak button
  useEffect(() => {
    void initTTS();
  }, []);

  // Hide animated background blobs during splash
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      if (showSplash) root.classList.add('splash-active');
      else root.classList.remove('splash-active');
    }
  }, [showSplash]);

  // Validate curriculum and phonics data in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      const errors = validateCurriculumData();
      if (errors.length > 0) {
        errorLogger.log({ severity: 'low', message: 'Data validation errors', component: 'App', metadata: { errors } });
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        {showSplash ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <LanguageProvider>
            <AuthProvider>
              <PremiumProvider>
                <HeartsProvider>
                <GamificationProvider>
                  <ToastProvider>
                    <AppContent />
                  </ToastProvider>
                </GamificationProvider>
                </HeartsProvider>
              </PremiumProvider>
            </AuthProvider>
          </LanguageProvider>
        )}
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
