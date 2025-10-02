import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Words from "./pages/Words";
import Videos from "./pages/Videos";
import Worksheets from "./pages/Worksheets";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/words" element={<Words />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/worksheets" element={<Worksheets />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
