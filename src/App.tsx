import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Words from "./pages/Words";
import Videos from "./pages/Videos";
import Worksheets from "./pages/Worksheets";
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
import { sendMessageToAI } from "./services/aiService";
import "./App.css";
import "./premium-colorful-theme.css";

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
          <Route path="/login" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function AppContent() {
  const [showChat, setShowChat] = useState(false);
  const [showLearning, setShowLearning] = useState(false);
  const location = useLocation();
  const isAtaturkPage = location.pathname === '/ataturk';

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

      {!isAtaturkPage && (
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

      {!isAtaturkPage && !showChat && !showLearning && (
        <button 
          className="floating-chat-btn"
          onClick={() => setShowChat(true)}
          aria-label="Mimi ile sohbet et"
        >
          <span className="chat-btn-icon">💬</span>
          <span className="chat-btn-text">Sohbet</span>
        </button>
      )}
    </>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
      return !hasSeenSplash;
    }
    return true;
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
