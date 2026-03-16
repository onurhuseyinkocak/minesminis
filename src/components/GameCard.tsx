type Props = {
  title: string;
  description: string;
};

function GameCard({ title, description }: Props) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default GameCard;
