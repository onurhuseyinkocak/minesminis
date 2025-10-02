import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Learn English with Fun 🎉</h1>
      <div className="grid-container">
        <Link to="/words" className="grid-card words">
          <span className="icon">📖</span>
          <h2>Words</h2>
        </Link>
        <Link to="/videos" className="grid-card videos">
          <span className="icon">🎬</span>
          <h2>Videos</h2>
        </Link>
        <Link to="/games" className="grid-card games">
          <span className="icon">🎮</span>
          <h2>Games</h2>
        </Link>
        <Link to="/worksheets" className="grid-card worksheets">
          <span className="icon">📝</span>
          <h2>Worksheets</h2>
        </Link>
      </div>
    </div>
  );
}

export default Home;
