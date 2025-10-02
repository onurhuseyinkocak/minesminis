import GameCard from "../components/GameCard";

function Games() {
  return (
    <div>
      <h1>Games</h1>
      <div className="card-grid">
        <GameCard title="Memory Game" description="Match words with pictures" />
        <GameCard title="Quiz Game" description="Test your English knowledge" />
      </div>
    </div>
  );
}

export default Games;
