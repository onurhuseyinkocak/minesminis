import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Search, Gamepad2 } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { gameStore } from '../../data/gameStore';
import { adminFetch } from '../../utils/adminApi';
import toast from 'react-hot-toast';

const extractEmbedFromIframe = (text: string): string => {
    const m = text.match(/src=["']([^"']+)["']/i) || text.match(/https?:\/\/[^\s"']+/);
    return m ? (m[1] || m[0]).trim() : '';
};
const extractThumbnailFromEmbed = (text: string): string => {
    const m = text.match(/<img[^>]+src=["']([^"']+)["']/i);
    return m ? m[1].trim() : '';
};

type GameRow = {
    id: string;
    title: string;
    embedUrl: string;
    thumbnailUrl: string;
    type: string;
    grade: string;
};

function GamesManager() {
    const [games, setGames] = useState<GameRow[]>([]);
    const [gamesLoading, setGamesLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGame, setEditingGame] = useState<GameRow | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        embedUrl: '',
        thumbnailUrl: '',
        type: 'Quiz',
        grade: '2'
    });

    useEffect(() => {
        (async () => {
            setGamesLoading(true);
            try {
                const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                if (data && data.length > 0) {
                    setGames(data.map((r: Record<string, unknown>) => ({
                        id: String(r.id),
                        title: String(r.title),
                        embedUrl: String(r.url),
                        thumbnailUrl: String(r.thumbnail_url || ''),
                        type: String(r.category || 'Quiz'),
                        grade: String(r.target_audience || '2')
                    })));
                } else {
                    const local = gameStore.getGames();
                    setGames(local.map(g => ({ id: String(g.id), title: g.title, embedUrl: g.embedUrl, thumbnailUrl: g.thumbnailUrl, type: g.type, grade: g.grade || '2' })));
                }
            } catch (err) {
                console.error('Games load error:', err);
                toast.error('Oyunlar yüklenirken hata. Yerel veri kullanılıyor.');
                const local = gameStore.getGames();
                setGames(local.map(g => ({ id: String(g.id), title: g.title, embedUrl: g.embedUrl, thumbnailUrl: g.thumbnailUrl, type: g.type, grade: g.grade || '2' })));
            } finally {
                setGamesLoading(false);
            }
        })();
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
        setFormData({ title: '', embedUrl: '', thumbnailUrl: '', type: 'Quiz', grade: '2' });
        setIsModalOpen(true);
    };

    const openEditModal = (game: GameRow) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = extractEmbedFromIframe(formData.embedUrl) || formData.embedUrl;
        if (!url.startsWith('http')) {
            toast.error('Geçerli bir embed URL veya iframe kodu girin');
            return;
        }
        try {
            const body = {
                title: formData.title,
                url,
                category: formData.type,
                thumbnail_url: formData.thumbnailUrl || null,
                description: formData.type,
                target_audience: formData.grade
            };
            if (editingGame) {
                const res = await adminFetch(`/api/admin/games/${editingGame.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(body)
                });
                const json = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json.error || 'Güncelleme başarısız');
                setGames(prev => prev.map(g => g.id === editingGame.id ? { ...g, ...formData, embedUrl: url } : g));
                toast.success('Oyun güncellendi!');
            } else {
                const res = await adminFetch('/api/admin/games', {
                    method: 'POST',
                    body: JSON.stringify(body)
                });
                const json = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json.error || 'Kayıt başarısız');
                setGames(prev => [{ id: json.id, ...formData, embedUrl: url }, ...prev]);
                toast.success('Yeni oyun eklendi! 🎮');
                try {
                    const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
                    if (!error && data?.length) setGames(data.map((r: Record<string, unknown>) => ({
                        id: String(r.id),
                        title: String(r.title),
                        embedUrl: String(r.url),
                        thumbnailUrl: String(r.thumbnail_url || ''),
                        type: String(r.category || 'Quiz'),
                        grade: String(r.target_audience || '2')
                    })));
                } catch { /* ignore load error */ }
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Kayıt başarısız');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu oyunu silmek istediğinize emin misiniz?')) return;
        try {
            const res = await adminFetch(`/api/admin/games/${id}`, { method: 'DELETE' });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.error || 'Silinemedi');
            setGames(prev => prev.filter(g => g.id !== id));
            toast.success('Oyun silindi!');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Silinemedi');
        }
    };

    const handleEmbedPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData('text');
        const src = extractEmbedFromIframe(text);
        if (src) {
            e.preventDefault();
            setFormData(f => ({ ...f, embedUrl: src }));
            toast.success('Embed URL iframe\'den alındı');
        }
    };

    const handleThumbnailPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData('text');
        const imgSrc = extractThumbnailFromEmbed(text);
        if (imgSrc) {
            e.preventDefault();
            setFormData(f => ({ ...f, thumbnailUrl: imgSrc }));
            toast.success('Thumbnail iframe/embed\'den alındı');
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1><Gamepad2 size={28} /> Oyun Yönetimi</h1>
                <p>Eğitici oyunları ekleyin, düzenleyin ve yönetin {gamesLoading ? '(yükleniyor…)' : `(${games.length} oyun)`}</p>
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
                                        <button className="delete-btn" onClick={() => handleDelete(String(game.id))}>
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
                                    <label>Embed URL veya iframe (yapıştır: &lt;iframe src=&quot;...&quot;&gt; veya URL)</label>
                                    <input
                                        type="text"
                                        value={formData.embedUrl}
                                        onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })}
                                        onPaste={handleEmbedPaste}
                                        placeholder="https://wordwall.net/tr/embed/... veya iframe kodunu yapıştırın"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Thumbnail URL (veya &lt;a&gt;...&lt;img src=&quot;...&quot;&gt; yapıştır)</label>
                                    <input
                                        type="text"
                                        value={formData.thumbnailUrl}
                                        onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                        onPaste={handleThumbnailPaste}
                                        placeholder="https://screens.cdn.wordwall.net/... veya embed HTML yapıştırın"
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
