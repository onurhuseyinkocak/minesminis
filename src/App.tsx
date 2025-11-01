import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Words from "./pages/Words";
import Videos from "./pages/Videos";
import Worksheets from "./pages/Worksheets";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Discover from "./pages/Discover/Discover";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import { ToastProvider } from "./components/ToastProvider";
import "./App.css";

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
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/discover" replace /> : <Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/words" element={<Words />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/worksheets" element={<Worksheets />} />
          <Route path="/discover" element={user ? <Discover /> : <Landing />} />
          <Route path="/favorites" element={user ? <Favorites /> : <Landing />} />
          <Route path="/profile" element={user ? <Profile /> : <Landing />} />
          <Route path="/login" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;