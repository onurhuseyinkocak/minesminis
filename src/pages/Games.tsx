import { useState } from 'react';

// Oyun tipini tanımlıyoruz
type Game = {
  id: number;
  title: string;
  embedUrl: string;
  thumbnailUrl: string;
};

// 2. Grade oyun verileri
const grade2Games: Game[] = [
  {
    id: 1,
    title: "2nd Grade 1st Revision",
    embedUrl: "https://wordwall.net/tr/embed/a27e67c8682a4be9a3503f499c937fcc?themeId=21&templateId=69&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/a27e67c8682a4be9a3503f499c937fcc_21"
  },
  {
    id: 2,
    title: "2nd grade animals 2",
    embedUrl: "https://wordwall.net/tr/embed/0ec582f6b6a04f26ad15409b73f7e580?themeId=27&templateId=3&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/0ec582f6b6a04f26ad15409b73f7e580_27"
  },
  {
    id: 3,
    title: "2nd grade quiz",
    embedUrl: "https://wordwall.net/tr/embed/7069b22dfc384f9ba0e1c7de9f1fb835?themeId=44&templateId=5&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/7069b22dfc384f9ba0e1c7de9f1fb835_44"
  },
  {
    id: 4,
    title: "Simple Past Questions",
    embedUrl: "https://wordwall.net/tr/embed/03dd454cab56495a82a08d631b357b9b?themeId=22&templateId=30&fontStackId=15",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/03dd454cab56495a82a08d631b357b9b_22"
  },
  {
    id: 5,
    title: "2nd grade 1st unit",
    embedUrl: "https://wordwall.net/tr/embed/af480055f010480683a676e66fa9dda4?themeId=2&templateId=5&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/af480055f010480683a676e66fa9dda4_2"
  },
  {
    id: 6,
    title: "Action words",
    embedUrl: "https://wordwall.net/tr/embed/896a359f89894d30906243d8619163e1?themeId=43&templateId=8&fontStackId=0",
    thumbnailUrl: "https://screens.cdn.wordwall.net/200/896a359f89894d30906243d8619163e1_43"
  }
];

// Diğer sınıflar için boş diziler (ileride doldurabilirsin)
const primarySchoolGames: Game[] = [];
const grade3Games: Game[] = [];
const grade4Games: Game[] = [];

function Games() {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('grade2'); // Varsayılan olarak 2. grade açık

  const selectedGameData = [...primarySchoolGames, ...grade2Games, ...grade3Games, ...grade4Games]
    .find(game => game.id === selectedGame);

  // Aktif bölüme göre oyunları seç
  const getActiveGames = (): Game[] => {
    switch (activeSection) {
      case 'primary': return primarySchoolGames;
      case 'grade2': return grade2Games;
      case 'grade3': return grade3Games;
      case 'grade4': return grade4Games;
      default: return grade2Games;
    }
  };

  const activeGames = getActiveGames();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Oyunlar</h1>
      
      {/* Bölüm Seçim Butonları */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveSection('primary')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeSection === 'primary' ? '#4CAF50' : '#f0f0f0',
            color: activeSection === 'primary' ? 'white' : 'black',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Primary School
        </button>
        <button
          onClick={() => setActiveSection('grade2')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeSection === 'grade2' ? '#4CAF50' : '#f0f0f0',
            color: activeSection === 'grade2' ? 'white' : 'black',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          2. Grade
        </button>
        <button
          onClick={() => setActiveSection('grade3')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeSection === 'grade3' ? '#4CAF50' : '#f0f0f0',
            color: activeSection === 'grade3' ? 'white' : 'black',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          3. Grade
        </button>
        <button
          onClick={() => setActiveSection('grade4')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeSection === 'grade4' ? '#4CAF50' : '#f0f0f0',
            color: activeSection === 'grade4' ? 'white' : 'black',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          4. Grade
        </button>
      </div>

      {/* Bölüm İçeriği */}
      <div>
        {activeGames.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <h3>Bu bölümde henüz oyun bulunmuyor</h3>
            <p>Yakında yeni oyunlar eklenecek!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {activeGames.map((game) => (
              <div 
                key={game.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onClick={() => setSelectedGame(game.id)}
              >
                <img 
                  src={game.thumbnailUrl} 
                  alt={game.title}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{game.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seçili Oyun Modal'ı */}
      {selectedGame && selectedGameData && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            width: '95%',
            height: '95%',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedGame(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                zIndex: 1001,
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              X
            </button>
            
            <iframe
              src={selectedGameData.embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              title={selectedGameData.title}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default Games;