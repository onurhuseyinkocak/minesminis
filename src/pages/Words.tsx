import WordCard from "../components/WordCard";

function Words() {
  const words = [
    { word: "Apple", translation: "Elma" },
    { word: "Cat", translation: "Kedi" },
    { word: "Dog", translation: "Köpek" },
  ];

  return (
    <div>
      <h1>Words</h1>
      <div className="card-grid">
        {words.map((w, i) => (
          <WordCard key={i} word={w.word} translation={w.translation} />
        ))}
      </div>
    </div>
  );
}

export default Words;
