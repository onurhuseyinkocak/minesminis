import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
              <Route path="/words" element={<Words />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/worksheets" element={<Worksheets />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;