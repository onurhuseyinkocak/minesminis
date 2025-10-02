type Props = {
  word: string;
  translation: string;
};

function WordCard({ word, translation }: Props) {
  return (
    <div className="card">
      <h3>{word}</h3>
      <p>{translation}</p>
    </div>
  );
}

export default WordCard;
