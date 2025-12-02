import { Routes, Route, Navigate } from "react-router-dom";
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
import Reels from "./pages/Reels";
import Search from "./pages/Search";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import { ToastProvider } from "./components/ToastProvider";
import TeacherMode from "./components/TeacherMode";
import AnimatedBackground from "./components/AnimatedBackground";
import FloatingParticles from "./components/FloatingParticles";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard";
import LivingBearImages from "./components/LivingBearImages";
import ChatHome from "./components/ChatHome";
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
          <Route path="/worksheets" element={<Worksheets />} />
          <Route path="/reels" element={user ? <Reels /> : <Landing />} />
          <Route path="/search" element={user ? <Search /> : <Landing />} />
          <Route path="/messages" element={user ? <Messages /> : <Landing />} />
          <Route path="/notifications" element={user ? <Notifications /> : <Landing />} />
          <Route path="/favorites" element={user ? <Favorites /> : <Landing />} />
          <Route path="/teacher/dashboard" element={user ? <TeacherDashboard /> : <Landing />} />
          <Route path="/student/dashboard" element={user ? <StudentDashboard /> : <Landing />} />
          <Route path="/profile" element={user ? <Profile /> : <Landing />} />
          <Route path="/profile/:userId" element={user ? <Profile /> : <Landing />} />
          <Route path="/login" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [showChat, setShowChat] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
      return !hasSeenSplash;
    }
    return true;
  });

  const handleMascotClick = () => {
    console.log('🎈 Opening AI chat with Mimi!');
    setShowChat(true);
  };

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
        <AnimatedBackground />
        <FloatingParticles />
        <AppRoutes />
        <TeacherMode />

        {/* AI-Powered Living Mascot - Freely roaming on website */}
        <LivingBearImages onMascotClick={handleMascotClick} />

        {/* AI Chat Window - Opens when mascot is clicked */}
        {showChat && (
          <ChatHome
            onClose={() => setShowChat(false)}
            onSendMessage={async (text) => {
              const response = await sendMessageToAI([{
                role: 'user',
                content: text,
                timestamp: new Date()
              }]);
              return response;
            }}
          />
        )}
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;