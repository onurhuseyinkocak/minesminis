import React, { useState } from "react";

interface WordData {
  meta: { id: string };
  hwi?: { prs?: { sound?: { audio?: string } }[] };
}

const Words: React.FC = () => {
  const [word, setWord] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const MW_API_KEY = "c1743210-4596-4a9c-b9db-91795a6463e4";

  const fetchWordData = (searchWord: string) => {
    setLoading(true);
    setError("");
    fetch(`https://www.dictionaryapi.com/api/v3/references/sd2/json/${searchWord}?key=${MW_API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((item: any) => item.hwi && item.hwi.prs);
        if (!filtered.length) {
          setAudioUrl("");
          setImageUrl(`https://picsum.photos/seed/${encodeURIComponent(searchWord)}/300/200`);
          setLoading(false);
          return;
        }

        const audioData = filtered[0].hwi?.prs?.[0]?.sound?.audio;
        if (audioData) {
          const firstLetter = audioData[0];
          setAudioUrl(`https://media.merriam-webster.com/audio/prons/en/us/mp3/${firstLetter}/${audioData}.mp3`);
        } else {
          setAudioUrl("");
        }

        setImageUrl(`https://picsum.photos/seed/${encodeURIComponent(searchWord)}/300/200`);
        setLoading(false);
      })
      .catch(() => {
        setError("Veri çekilemedi");
        setLoading(false);
      });
  };

  const handleRandomWord = () => {
    fetch("https://random-word-api.herokuapp.com/word?number=1")
      .then((res) => res.json())
      .then((data) => {
        const randomWord = data[0];
        setWord(randomWord);
        fetchWordData(randomWord);
      })
      .catch(() => setError("Random kelime alınamadı"));
  };

  return (
    <div className="words-page">
      <h1>Words Explorer</h1>
      <div className="search-section">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Type a word..."
        />
        <button onClick={() => fetchWordData(word)} className="btn search-btn">
          Search
        </button>
        <button onClick={handleRandomWord} className="btn random-btn">
          Random Word
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {word && (
        <div className="results">
          <h2>{word}</h2>
          {imageUrl && <img src={imageUrl} alt={word} className="word-image" />}
          {audioUrl && (
            <audio controls key={audioUrl}>
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}
    </div>
  );
};

export default Words;
