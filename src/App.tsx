import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PremiumProvider } from "./contexts/PremiumContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/ToastProvider";
import SplashScreen from "./components/SplashScreen";
import { AppShell } from "./components/layout";
import { sendMessageToAI } from "./services/aiService";
import { errorLogger } from "./services/errorLogger";
import { isOnline, onOnlineStatusChange } from "./utils/offlineManager";
import { getNextAction } from "./services/learningPathService";

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
const Videos = lazy(() => import("./pages/Videos"));
const StoryPage = lazy(() => import("./pages/Story/StoryPage"));
const Profile = lazy(() => import("./pages/Profile"));
const Premium = lazy(() => import("./pages/Premium"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Worksheets = lazy(() => import("./pages/Worksheets"));
const Favorites = lazy(() => import("./pages/Favorites"));
const ReadingLibrary = lazy(() => import("./pages/Student/ReadingLibrary"));

// Protected – Parent / Teacher
const ParentDashboard = lazy(() => import("./pages/Parent/ParentDashboard"));
const ClassroomMode = lazy(() => import("./pages/Teacher/ClassroomMode"));
const ClassroomManager = lazy(() => import("./pages/Teacher/ClassroomManager"));
const TeacherDashboard = lazy(() => import("./pages/Teacher/TeacherDashboard"));

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

/** Offline/online status banner */
function OfflineBanner() {
  const [online, setOnline] = useState(isOnline);
  const [showBackOnline, setShowBackOnline] = useState(false);
  const wasOffline = useRef(false);

  const handleStatusChange = useCallback((status: boolean) => {
    setOnline(status);
    if (status && wasOffline.current) {
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 3000);
    }
    wasOffline.current = !status;
  }, []);

  useEffect(() => {
    const unsub = onOnlineStatusChange(handleStatusChange);
    return unsub;
  }, [handleStatusChange]);

  if (showBackOnline) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "#10b981",
          color: "#fff",
          textAlign: "center",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          animation: "slideDown 0.3s ease",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
        Back online!
      </div>
    );
  }

  if (!online) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "#f59e0b",
          color: "#78350f",
          textAlign: "center",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          animation: "slideDown 0.3s ease",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
        You're offline. Some features may be limited.
      </div>
    );
  }

  return null;
}

/** Wrapper that requires authentication; redirects to /login otherwise */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Wraps protected student pages inside AppShell */
function StudentRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

// ─── Routes ──────────────────────────────────────────────────────────────────

function AppRoutes() {
  const { user, userProfile, loading, isAdmin, profileLoading, hasSkippedSetup } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isSetupRoute = location.pathname === "/setup";
  const isTeacher = userProfile?.role === "teacher";
  const isParent = userProfile?.role === "parent";

  const authReady = !loading;
  const profileReady = !user || !profileLoading;
  const showContent = authReady && profileReady;

  const isSetupCompleted = userProfile?.settings?.setup_completed === true;
  const mustGoToSetup = !!user && !isAdmin && !isSetupRoute && !isSetupCompleted && !hasSkippedSetup && profileReady;

  useEffect(() => {
    if (mustGoToSetup) navigate("/setup", { replace: true });
  }, [mustGoToSetup, navigate]);

  // While auth or profile is loading, show loader — prevents flash of onboarding
  if (!showContent) {
    return <PageLoader />;
  }

  // Admin routes have their own layout — no AppShell
  if (isAdminRoute) {
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
      <Suspense fallback={<PageLoader />}>
        <div key={location.pathname} className="route-fade">
          <Routes>
            {/* ── Public ────────────────────────────────────────── */}
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to={isAdmin ? "/admin" : isParent ? "/parent" : isTeacher ? "/teacher" : "/dashboard"} replace />
                ) : (
                  <Landing />
                )
              }
            />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to={isAdmin ? "/admin" : isParent ? "/parent" : isTeacher ? "/teacher" : "/dashboard"} replace />
                ) : (
                  <Login />
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
            <Route path="/dashboard" element={<StudentRoute><Dashboard /></StudentRoute>} />
            <Route path="/worlds" element={<StudentRoute><WorldMap /></StudentRoute>} />
            <Route path="/worlds/:worldId" element={<StudentRoute><WorldDetail /></StudentRoute>} />
            <Route path="/worlds/:worldId/lessons/:lessonId" element={<StudentRoute><LessonPlayer /></StudentRoute>} />
            <Route path="/games" element={<StudentRoute><Games /></StudentRoute>} />
            <Route path="/practice" element={<StudentRoute><PracticeMode /></StudentRoute>} />
            <Route path="/words" element={<StudentRoute><Words /></StudentRoute>} />
            <Route path="/videos" element={<StudentRoute><Videos /></StudentRoute>} />
            <Route path="/story" element={<StudentRoute><StoryPage /></StudentRoute>} />
            <Route path="/profile" element={<StudentRoute><Profile /></StudentRoute>} />
            <Route path="/premium" element={<StudentRoute><Premium /></StudentRoute>} />
            <Route path="/premium/success" element={<StudentRoute><Premium /></StudentRoute>} />
            <Route path="/worksheets" element={<StudentRoute><Worksheets /></StudentRoute>} />
            <Route path="/favorites" element={<StudentRoute><Favorites /></StudentRoute>} />
            <Route path="/placement" element={<ProtectedRoute><PlacementTest /></ProtectedRoute>} />
            <Route path="/phonics/:soundId" element={<StudentRoute><PhonicsLesson /></StudentRoute>} />
            <Route path="/songs" element={<StudentRoute><SongsPage /></StudentRoute>} />
            <Route path="/garden" element={<StudentRoute><LearningGarden /></StudentRoute>} />
            <Route path="/reading" element={<StudentRoute><ReadingLibrary /></StudentRoute>} />
            <Route path="/reading/:bookId" element={<StudentRoute><ReadingLibrary /></StudentRoute>} />
            <Route path="/pricing" element={<Pricing />} />

            {/* ── Parent (protected, no student AppShell) ────────── */}
            <Route path="/parent" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
            {/* ── Teacher (protected + AppShell) ─────────────────── */}
            <Route path="/classroom" element={<StudentRoute><ClassroomMode /></StudentRoute>} />
            <Route path="/teacher" element={<StudentRoute><TeacherDashboard /></StudentRoute>} />
            <Route path="/teacher/classrooms" element={<StudentRoute><ClassroomManager /></StudentRoute>} />

            {/* ── Catch-all ──────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Suspense>
    </>
  );
}

// ─── App Content (auth-dependent overlays) ───────────────────────────────────

function WhatsNextButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();
  const action = getNextAction();

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
            background: "#fff",
            border: "2px solid #1A6B5A",
            borderRadius: 14,
            padding: "10px 16px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            whiteSpace: "nowrap",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            color: "#1A6B5A",
            fontFamily: "Nunito, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>Next: {action.title} {action.emoji}</span>
        </button>
      )}
      <button
        onClick={() => setShowTooltip((v) => !v)}
        aria-label="What's next?"
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "2px solid #1A6B5A",
          background: "#f0fdf4",
          color: "#1A6B5A",
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
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isSetupRoute = location.pathname === "/setup";

  const { user, userProfile, hasSkippedSetup, loading, profileLoading, isAdmin } = useAuth();

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
      const role = userProfile?.role;
      navigate(role === "parent" ? "/parent" : role === "teacher" ? "/teacher" : "/dashboard");
    }
  }, [user, userProfile, hasSkippedSetup, isSetupRoute, isAdminRoute, loading, profileLoading, navigate, isAdmin]);

  return (
    <>
      <OfflineBanner />
      <AppRoutes />

      {/* Gamification overlays for authenticated users */}
      {user && !isAdminRoute && !isSetupRoute && (
        <Suspense fallback={null}>
          <DailyReward />
          <LevelUpModal />
        </Suspense>
      )}

      {/* Floating chat button */}
      {user && !isAdminRoute && !isSetupRoute && (
        <button
          className="floating-chat-btn"
          onClick={() => setShowChat(true)}
          aria-label="Chat with Mimi"
        >
          🐉
        </button>
      )}

      {/* What's Next? floating button (students only) */}
      {user && !isAdmin && !isAdminRoute && !isSetupRoute && (
        <WhatsNextButton />
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

  // Hide animated background blobs during splash
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      if (showSplash) root.classList.add('splash-active');
      else root.classList.remove('splash-active');
    }
  }, [showSplash]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        {showSplash ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <AuthProvider>
            <PremiumProvider>
              <GamificationProvider>
                <ToastProvider>
                  <AppContent />
                </ToastProvider>
              </GamificationProvider>
            </PremiumProvider>
          </AuthProvider>
        )}
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
