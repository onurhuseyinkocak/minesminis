import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
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
const Words = lazy(() => import("./pages/Words"));
const Videos = lazy(() => import("./pages/Videos"));
const StoryPage = lazy(() => import("./pages/Story/StoryPage"));
const Profile = lazy(() => import("./pages/Profile"));
const Premium = lazy(() => import("./pages/Premium"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Worksheets = lazy(() => import("./pages/Worksheets"));
const Favorites = lazy(() => import("./pages/Favorites"));

// Protected – Parent / Teacher
const ParentDashboard = lazy(() => import("./pages/Parent/ParentDashboard"));
const ClassroomMode = lazy(() => import("./pages/Teacher/ClassroomMode"));

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
      console.warn("Service worker registration failed:", err);
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
            <Route path="/pricing" element={<Pricing />} />

            {/* ── Parent / Teacher (protected + AppShell) ────────── */}
            <Route path="/parent" element={<StudentRoute><ParentDashboard /></StudentRoute>} />
            <Route path="/classroom" element={<StudentRoute><ClassroomMode /></StudentRoute>} />

            {/* ── Catch-all ──────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Suspense>
    </>
  );
}

// ─── App Content (auth-dependent overlays) ───────────────────────────────────

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
      navigate("/dashboard");
    }
  }, [user, userProfile, hasSkippedSetup, isSetupRoute, isAdminRoute, loading, profileLoading, navigate, isAdmin]);

  return (
    <>
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
