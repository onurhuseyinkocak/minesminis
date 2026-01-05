import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PremiumProvider } from "./contexts/PremiumContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Words from "./pages/Words";
import Videos from "./pages/Videos";
import Worksheets from "./pages/Worksheets";
import Premium from "./pages/Premium";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import { ToastProvider } from "./components/ToastProvider";
import AnimatedBackground from "./components/AnimatedBackground";
import FloatingParticles from "./components/FloatingParticles";
import StudentDashboard from "./pages/Student/StudentDashboard";
import Ataturk from "./pages/Ataturk";
import LivingBearImages from "./components/LivingBearImages";
import ChatHome from "./components/ChatHome";
import MimiLearning from "./components/MimiLearning";
import SplashScreen from "./components/SplashScreen";
import AdminLayout from "./pages/Admin/AdminLayout";
import DailyReward from "./components/DailyReward";
import LevelUpModal from "./components/LevelUpModal";
import ParentDashboard from "./pages/Parent/ParentDashboard";
import { sendMessageToAI } from "./services/aiService";
import "./App.css";
import "./premium-colorful-theme.css";
import "./styles/dark-theme.css";

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration.scope);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '1.5rem',
        color: '#06B6D4'
      }}>
        Loading...
      </div>
    );
  }

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Admin routes have their own layout, no navbar/footer
  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <Navbar />
      <main id="main-content" className="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/games" replace /> : <Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/words" element={<Words />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/ataturk" element={<Ataturk />} />
          <Route path="/worksheets" element={<Worksheets />} />
          <Route path="/favorites" element={user ? <Favorites /> : <Landing />} />
          <Route path="/dashboard" element={user ? <StudentDashboard /> : <Landing />} />
          <Route path="/profile" element={user ? <Profile /> : <Landing />} />
          <Route path="/parent-dashboard" element={user ? <ParentDashboard /> : <Landing />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/premium/success" element={<Premium />} />
          <Route path="/setup" element={<Onboarding />} />
          <Route path="/login" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

// Import Onboarding
import Onboarding from "./pages/Onboarding";

function AppContent() {
  const [showChat, setShowChat] = useState(false);
  const [showLearning, setShowLearning] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAtaturkPage = location.pathname === '/ataturk';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isSetupRoute = location.pathname === '/setup';
  // const isPublicRoute = ['/', '/login', '/about'].includes(location.pathname);

  const { user, userProfile, hasSkippedSetup } = useAuth();

  // Redirect to setup if grounded
  useEffect(() => {
    if (user && !userProfile && !hasSkippedSetup && !isSetupRoute && !isAdminRoute) {
      navigate('/setup');
    }
  }, [user, userProfile, hasSkippedSetup, isSetupRoute, isAdminRoute, navigate]);

  const handleMascotClick = () => {
    console.log('🎈 Opening Mimi Learning!');
    setShowLearning(true);
  };

  const handleHomeClick = () => {
    console.log('🏠 Opening AI chat with Mimi!');
    setShowChat(true);
  };

  return (
    <>
      <AnimatedBackground />
      <FloatingParticles />
      <AppRoutes />

      {/* Gamification Components - only on non-admin pages and when NOT in setup/onboarding */}
      {user && !isAdminRoute && !isSetupRoute && (
        <>
          <DailyReward />
          <LevelUpModal />
        </>
      )}

      {/* Mascot only shows on normal site, NOT on admin or Ataturk pages or Setup */}
      {!isAtaturkPage && !isAdminRoute && !isSetupRoute && (
        <LivingBearImages onMascotClick={handleMascotClick} onHomeClick={handleHomeClick} />
      )}

      {showChat && (
        <ChatHome
          onClose={() => setShowChat(false)}
          onSendMessage={async (history) => {
            const messagesForAI = history.map(msg => ({
              role: msg.role,
              content: msg.content,
              timestamp: new Date()
            }));
            const response = await sendMessageToAI(messagesForAI);
            return response;
          }}
        />
      )}

      {showLearning && (
        <MimiLearning onClose={() => setShowLearning(false)} />
      )}
    </>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      // Check if this is a page reload or fresh navigation
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      const navigationType = navigationEntries.length > 0 ? navigationEntries[0].type : 'navigate';

      // Show splash on:
      // - 'reload' = F5 or browser refresh
      // - 'navigate' = first visit or typing URL directly
      // Don't show on:
      // - 'back_forward' = browser back/forward buttons
      // - React Router navigation (doesn't trigger full page load)

      if (navigationType === 'reload' || navigationType === 'navigate') {
        return true;
      }
      return false;
    }
    return true;
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <PremiumProvider>
          <GamificationProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </GamificationProvider>
        </PremiumProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
