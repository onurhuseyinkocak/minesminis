import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Search, Gamepad2, Loader2 } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { gameStore } from '../../data/gameStore';
import { adminFetch } from '../../utils/adminApi';
import type { Database } from '../../config/supabase';
import toast from 'react-hot-toast';
import './GamesManager.css';

type SupabaseGameRow = Database['public']['Tables']['games']['Row'];

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

interface GameFormData {
    title: string;
    embedUrl: string;
    thumbnailUrl: string;
    type: string;
    grade: string;
}

const INITIAL_FORM: GameFormData = {
    title: '',
    embedUrl: '',
    thumbnailUrl: '',
    type: 'Quiz',
    grade: '2'
};

function mapSupabaseRow(r: SupabaseGameRow): GameRow {
    return {
        id: String(r.id),
        title: String(r.title),
        embedUrl: String(r.url),
        thumbnailUrl: String(r.thumbnail_url || ''),
        type: String(r.category || 'Quiz'),
        grade: String(r.target_audience || '2')
    };
}

function GamesManager() {
    const [games, setGames] = useState<GameRow[]>([]);
    const [gamesLoading, setGamesLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGame, setEditingGame] = useState<GameRow | null>(null);
    const [saving, setSaving] = useState(false);
    const [deletingGameId, setDeletingGameId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState<GameFormData>(INITIAL_FORM);

    const loadLocalGames = useCallback((): GameRow[] => {
        const local = gameStore.getGames();
        return local.map(g => ({ id: String(g.id), title: g.title, embedUrl: g.embedUrl, thumbnailUrl: g.thumbnailUrl, type: g.type, grade: g.grade || '2' }));
    }, []);

    useEffect(() => {
        (async () => {
            setGamesLoading(true);
            try {
                const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                if (data && data.length > 0) {
                    setGames(data.map((r) => mapSupabaseRow(r as SupabaseGameRow)));
                } else {
                    setGames(loadLocalGames());
                }
            } catch {
                toast.error('Oyunlar yüklenirken hata. Yerel veri kullanılıyor.');
                setGames(loadLocalGames());
            } finally {
                setGamesLoading(false);
            }
        })();
    }, [loadLocalGames]);

    // Sync with gameStore for cross-tab updates
    useEffect(() => {
        const unsubscribe = gameStore.subscribe(() => {
            setGames(loadLocalGames());
        });
        return unsubscribe;
    }, [loadLocalGames]);

    const grades = ['all', '2', '3', '4', 'primary'];
    const gameTypes = ['Quiz', 'Match Up', 'Maze Chase', 'Whack-a-Mole', 'Open Box', 'Memory Game'];

    const itemsPerPage = 12;

    const filteredGames = useMemo(() => games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrade = selectedGrade === 'all' || game.grade === selectedGrade;
        return matchesSearch && matchesGrade;
    }), [games, searchTerm, selectedGrade]);

    const totalPages = Math.ceil(filteredGames.length / itemsPerPage);

    const paginatedGames = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredGames.slice(start, start + itemsPerPage);
    }, [filteredGames, currentPage]);

    const openAddModal = useCallback(() => {
        setEditingGame(null);
        setFormData(INITIAL_FORM);
        setIsModalOpen(true);
    }, []);

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
        const title = formData.title.trim();
        if (!title) { toast.error('Oyun adı zorunlu'); return; }

        const url = extractEmbedFromIframe(formData.embedUrl) || formData.embedUrl.trim();
        if (!url.startsWith('http')) {
            toast.error('Geçerli bir embed URL veya iframe kodu girin');
            return;
        }

        setSaving(true);
        try {
            const body = {
                title,
                url,
                category: formData.type,
                thumbnail_url: formData.thumbnailUrl.trim() || null,
                description: formData.type,
                target_audience: formData.grade
            };
            if (editingGame) {
                const res = await adminFetch(`/api/admin/games/${editingGame.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(body)
                });
                const json: Record<string, string> = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json.error || 'Güncelleme başarısız');
                setGames(prev => prev.map(g => g.id === editingGame.id ? { ...g, title, embedUrl: url, thumbnailUrl: formData.thumbnailUrl.trim(), type: formData.type, grade: formData.grade } : g));
                toast.success('Oyun güncellendi!');
            } else {
                const res = await adminFetch('/api/admin/games', {
                    method: 'POST',
                    body: JSON.stringify(body)
                });
                const json: Record<string, string> = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json.error || 'Kayıt başarısız');
                const newId = json.id || `temp-${Date.now()}`;
                setGames(prev => [{ id: newId, title, embedUrl: url, thumbnailUrl: formData.thumbnailUrl.trim(), type: formData.type, grade: formData.grade }, ...prev]);
                toast.success('Yeni oyun eklendi!');
                // Refresh from DB to get accurate data
                try {
                    const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
                    if (!error && data?.length) {
                        setGames(data.map((r) => mapSupabaseRow(r as SupabaseGameRow)));
                    }
                } catch {
                    // DB refresh failed, local state is still valid
                }
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Kayıt başarısız');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu oyunu silmek istediğinizden emin misiniz?')) return;
        setDeletingGameId(id);
        try {
            const res = await adminFetch(`/api/admin/games/${id}`, { method: 'DELETE' });
            const json: Record<string, string> = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.error || 'Silinemedi');
            setGames(prev => prev.filter(g => g.id !== id));
            toast.success('Oyun silindi!');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Silinemedi');
        } finally {
            setDeletingGameId(null);
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
                        <div className="adm-search-wrap">
                            <Search size={18} className="adm-search-icon" />
                            <input
                                type="text"
                                placeholder="Oyun ara..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="search-input adm-search-input"
                            />
                        </div>
                        <button type="button" className="add-btn" onClick={openAddModal}>
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
                            onClick={() => { setSelectedGrade(grade); setCurrentPage(1); }}
                        >
                            {grade === 'all' ? 'Tümü' :
                                grade === 'primary' ? 'İlkokul' :
                                    `${grade}. Sınıf`}
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
                        {paginatedGames.map(game => (
                            <tr key={game.id}>
                                <td>
                                    <img
                                        src={game.thumbnailUrl || undefined}
                                        alt={game.title}
                                        className="table-thumbnail"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect fill="%236366f1" width="60" height="40"/><text x="30" y="25" text-anchor="middle" fill="white" font-size="16">G</text></svg>';
                                        }}
                                    />
                                </td>
                                <td><strong>{game.title}</strong></td>
                                <td>
                                    <span className="badge badge-beginner">{game.type}</span>
                                </td>
                                <td>{game.grade === 'primary' ? 'İlkokul' : `${game.grade}. Sınıf`}</td>
                                <td>
                                    <div className="action-btns">
                                        <button type="button" className="edit-btn" onClick={() => openEditModal(game)} disabled={deletingGameId === game.id}>
                                            <Pencil size={16} />
                                        </button>
                                        <button type="button" className="delete-btn" onClick={() => handleDelete(String(game.id))} disabled={deletingGameId === game.id}>
                                            {deletingGameId === game.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
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

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Önceki
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let page: number;
                            if (totalPages <= 5) {
                                page = i + 1;
                            } else if (currentPage <= 3) {
                                page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                            } else {
                                page = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={page}
                                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Sonraki
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingGame ? 'Oyunu Düzenle' : 'Yeni Oyun Ekle'}</h3>
                            <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>
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
                                <button type="submit" className="save-btn" disabled={saving}>
                                    {saving ? <><Loader2 size={16} className="animate-spin" /> Kaydediliyor...</> : (editingGame ? 'Güncelle' : 'Ekle')}
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
