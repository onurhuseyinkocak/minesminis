import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Search, Gamepad2 } from 'lucide-react';
import { Game } from '../../data/gamesData';
import { gameStore } from '../../data/gameStore';
import toast from 'react-hot-toast';

function GamesManager() {
    const [games, setGames] = useState<Game[]>(() => gameStore.getGames());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGame, setEditingGame] = useState<Game | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        embedUrl: '',
        thumbnailUrl: '',
        type: 'Quiz',
        grade: '2'
    });

    // Subscribe to store changes
    useEffect(() => {
        const unsubscribe = gameStore.subscribe((updatedGames) => {
            setGames(updatedGames);
        });
        return unsubscribe;
    }, []);

    const grades = ['all', '2', '3', '4', 'primary'];
    const gameTypes = ['Quiz', 'Match Up', 'Maze Chase', 'Whack-a-Mole', 'Open Box', 'Memory Game'];

    const filteredGames = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrade = selectedGrade === 'all' || game.grade === selectedGrade;
        return matchesSearch && matchesGrade;
    });

    const openAddModal = () => {
        setEditingGame(null);
        setFormData({
            title: '',
            embedUrl: '',
            thumbnailUrl: '',
            type: 'Quiz',
            grade: '2'
        });
        setIsModalOpen(true);
    };

    const openEditModal = (game: Game) => {
        setEditingGame(game);
        setFormData({
            title: game.title,
            embedUrl: game.embedUrl,
            thumbnailUrl: game.thumbnailUrl,
            type: game.type,
            grade: game.grade || '2'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingGame) {
            gameStore.updateGame(editingGame.id, formData);
            setGames(gameStore.getGames());
            toast.success('Oyun güncellendi ve siteye kaydedildi!');
        } else {
            const newGame: Game = {
                id: Date.now(),
                ...formData
            };
            gameStore.addGame(newGame);
            setGames(gameStore.getGames());
            toast.success('Yeni oyun eklendi ve siteye kaydedildi! 🎮');
        }

        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Bu oyunu silmek istediğinize emin misiniz?')) {
            gameStore.deleteGame(id);
            setGames(gameStore.getGames());
            toast.success('Oyun silindi!');
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1><Gamepad2 size={28} /> Oyun Yönetimi</h1>
                <p>Eğitici oyunları ekleyin, düzenleyin ve yönetin</p>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h2>{filteredGames.length} Oyun</h2>
                    <div className="table-actions">
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Oyun ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                        <button className="add-btn" onClick={openAddModal}>
                            <Plus size={18} />
                            Oyun Ekle
                        </button>
                    </div>
                </div>

                <div className="filter-chips">
                    {grades.map(grade => (
                        <button
                            key={grade}
                            className={`filter-chip ${selectedGrade === grade ? 'active' : ''}`}
                            onClick={() => setSelectedGrade(grade)}
                        >
                            {grade === 'all' ? '📚 Tümü' :
                                grade === 'primary' ? '🌟 İlkokul' :
                                    `📖 ${grade}. Sınıf`}
                        </button>
                    ))}
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Görsel</th>
                            <th>Başlık</th>
                            <th>Tür</th>
                            <th>Sınıf</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGames.map(game => (
                            <tr key={game.id}>
                                <td>
                                    <img
                                        src={game.thumbnailUrl}
                                        alt={game.title}
                                        className="table-thumbnail"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect fill="%236366f1" width="60" height="40"/><text x="30" y="25" text-anchor="middle" fill="white" font-size="16">🎮</text></svg>';
                                        }}
                                    />
                                </td>
                                <td><strong>{game.title}</strong></td>
                                <td>
                                    <span className="badge badge-beginner">{game.type}</span>
                                </td>
                                <td>{game.grade}. Sınıf</td>
                                <td>
                                    <div className="action-btns">
                                        <button className="edit-btn" onClick={() => openEditModal(game)}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(game.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredGames.length === 0 && (
                    <div className="no-data">
                        <Gamepad2 size={48} style={{ opacity: 0.3 }} />
                        <p>Oyun bulunamadı</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingGame ? 'Oyunu Düzenle' : 'Yeni Oyun Ekle'}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Oyun Adı</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Örn: Animals Quiz"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Embed URL</label>
                                    <input
                                        type="url"
                                        value={formData.embedUrl}
                                        onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })}
                                        placeholder="https://wordwall.net/embed/..."
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Thumbnail URL</label>
                                    <input
                                        type="url"
                                        value={formData.thumbnailUrl}
                                        onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Oyun Türü</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        {gameTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Sınıf</label>
                                    <select
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                    >
                                        <option value="2">2. Sınıf</option>
                                        <option value="3">3. Sınıf</option>
                                        <option value="4">4. Sınıf</option>
                                        <option value="primary">İlkokul</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                                    İptal
                                </button>
                                <button type="submit" className="save-btn">
                                    {editingGame ? 'Güncelle' : 'Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GamesManager;
