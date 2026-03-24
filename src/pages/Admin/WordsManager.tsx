import { useState, useMemo, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Search, BookOpen, Download, Sparkles } from 'lucide-react';
import { KidsWord } from '../../data/wordsData';
import { wordStore } from '../../data/wordStore';
import { adminFetch } from '../../utils/adminApi';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';

function WordsManager() {
    const [words, setWords] = useState<KidsWord[]>([]);
    const [wordsLoading, setWordsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWord, setEditingWord] = useState<KidsWord | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        word: '',
        turkish: '',
        level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
        category: 'Animals',
        emoji: '',
        example: ''
    });

    // Load words from Supabase (public read), fallback to wordStore
    useEffect(() => {
        let cancelled = false;
        (async () => {
            setWordsLoading(true);
            try {
                const { data, error } = await supabase.from('words').select('*').order('word');
                if (!cancelled && !error && data && data.length > 0) {
                    const list: KidsWord[] = data.map((r: Record<string, unknown>) => ({
                        word: String(r.word),
                        turkish: String(r.turkish),
                        level: (r.level as KidsWord['level']) || 'beginner',
                        category: String(r.category || 'Animals'),
                        emoji: String(r.emoji || '📚'),
                        example: r.example ? String(r.example) : undefined
                    }));
                    setWords(list);
                } else if (!cancelled) {
                    setWords(wordStore.getWords());
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('Words load error:', err);
                    toast.error('Kelimeler yüklenirken hata. Yerel veri kullanılıyor.');
                    setWords(wordStore.getWords());
                }
            } finally {
                if (!cancelled) setWordsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Keep in sync with wordStore when it updates (e.g. from another tab)
    useEffect(() => {
        const unsubscribe = wordStore.subscribe((updatedWords) => {
            if (words.length === 0 && !wordsLoading) setWords(updatedWords);
        });
        return unsubscribe;
    }, [words.length, wordsLoading]);

    const itemsPerPage = 10;

    const categories = useMemo(() => {
        const cats = new Set(words.map(w => w.category));
        return ['all', ...Array.from(cats)];
    }, [words]);

    const levels = ['all', 'beginner', 'intermediate', 'advanced'];

    const filteredWords = useMemo(() => {
        return words.filter(word => {
            const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                word.turkish.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = selectedLevel === 'all' || word.level === selectedLevel;
            const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
            return matchesSearch && matchesLevel && matchesCategory;
        });
    }, [words, searchTerm, selectedLevel, selectedCategory]);

    const paginatedWords = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredWords.slice(start, start + itemsPerPage);
    }, [filteredWords, currentPage]);

    const totalPages = Math.ceil(filteredWords.length / itemsPerPage);

    const openAddModal = () => {
        setEditingWord(null);
        setFormData({
            word: '',
            turkish: '',
            level: 'beginner',
            category: 'Animals',
            emoji: '',
            example: ''
        });
        setIsModalOpen(true);
    };

    const [enriching, setEnriching] = useState(false);
    const fetchWordEnrich = async () => {
        const w = formData.word.trim().toLowerCase();
        if (!w) {
            toast.error('Önce İngilizce kelime yazın');
            return;
        }
        setEnriching(true);
        try {
            const res = await adminFetch('/api/words/enrich', {
                method: 'POST',
                body: JSON.stringify({ word: w })
            });
            const json = await res.json().catch(() => ({}));
            if (json.turkish) {
                setFormData(f => ({
                    ...f,
                    turkish: json.turkish,
                    emoji: json.emoji || f.emoji,
                    example: json.example || f.example
                }));
                toast.success('Türkçe, emoji ve örnek cümle otomatik dolduruldu');
            } else toast.error(json.error || 'Bilgiler alınamadı');
        } catch {
            toast.error('Bilgiler alınamadı. İnternet bağlantınızı kontrol edin veya manuel girin.');
        } finally {
            setEnriching(false);
        }
    };

    const openEditModal = (word: KidsWord) => {
        setEditingWord(word);
        setFormData({
            word: word.word,
            turkish: word.turkish,
            level: word.level,
            category: word.category,
            emoji: word.emoji,
            example: word.example || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const wordData = { ...formData, example: formData.example || undefined };
        const w = formData.word.trim();
        if (!w) return;
        try {
            if (editingWord) {
                const res = await adminFetch(`/api/admin/words/${encodeURIComponent(editingWord.word)}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ turkish: wordData.turkish, level: wordData.level, category: wordData.category, emoji: wordData.emoji, example: wordData.example ?? null })
                });
                const json = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json.error || 'Güncelleme başarısız');
                wordStore.updateWord(editingWord.word, wordData);
                setWords(prev => prev.map(x => x.word === editingWord.word ? { ...wordData, word: editingWord.word } as KidsWord : x));
                toast.success('Kelime güncellendi!');
            } else {
                if (words.some(x => x.word.toLowerCase() === w.toLowerCase())) {
                    toast.error('Bu kelime zaten mevcut!');
                    return;
                }
                const res = await adminFetch('/api/admin/words', {
                    method: 'POST',
                    body: JSON.stringify({ word: w, turkish: wordData.turkish, level: wordData.level, category: wordData.category, emoji: wordData.emoji, example: wordData.example ?? null })
                });
                const json = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json.error || 'Kayıt başarısız');
                wordStore.addWord(wordData as KidsWord);
                setWords(prev => [...prev, wordData as KidsWord]);
                toast.success('Yeni kelime eklendi!');
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Kayıt başarısız');
        }
    };

    const handleDelete = async (word: string) => {
        if (!confirm('Bu kelimeyi silmek istediğinize emin misiniz?')) return;
        try {
            const res = await adminFetch(`/api/admin/words/${encodeURIComponent(word)}`, { method: 'DELETE' });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.error || 'Silinemedi');
            wordStore.deleteWord(word);
            setWords(prev => prev.filter(x => x.word !== word));
            toast.success('Kelime silindi!');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Silinemedi');
        }
    };

    const exportWords = () => {
        const csv = words.map(w =>
            `${w.word},${w.turkish},${w.level},${w.category},${w.emoji},${w.example || ''}`
        ).join('\n');

        const blob = new Blob([`word,turkish,level,category,emoji,example\n${csv}`], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'words_export.csv';
        a.click();
        toast.success('Kelimeler dışa aktarıldı!');
    };

    const getLevelBadgeClass = (level: string) => {
        switch (level) {
            case 'beginner': return 'badge-beginner';
            case 'intermediate': return 'badge-intermediate';
            case 'advanced': return 'badge-advanced';
            default: return 'badge-beginner';
        }
    };

    const getLevelLabel = (level: string) => {
        switch (level) {
            case 'beginner': return '2-3. Sınıf';
            case 'intermediate': return '4. Sınıf';
            case 'advanced': return '5. Sınıf';
            default: return level;
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1><BookOpen size={28} /> Kelime Yönetimi</h1>
                <p>İngilizce kelime listesini düzenleyin {wordsLoading ? '(yükleniyor…)' : `(${words.length} kelime)`}</p>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h2>{filteredWords.length} Kelime</h2>
                    <div className="table-actions">
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Kelime ara..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="search-input"
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                        <button className="add-btn" style={{ background: '#10b981' }} onClick={exportWords}>
                            <Download size={18} />
                            Dışa Aktar
                        </button>
                        <button className="add-btn" onClick={openAddModal}>
                            <Plus size={18} />
                            Kelime Ekle
                        </button>
                    </div>
                </div>

                <div className="filter-chips">
                    {levels.map(level => (
                        <button
                            key={level}
                            className={`filter-chip ${selectedLevel === level ? 'active' : ''}`}
                            onClick={() => { setSelectedLevel(level); setCurrentPage(1); }}
                        >
                            {level === 'all' ? 'Tümü' : getLevelLabel(level)}
                        </button>
                    ))}
                </div>

                <div className="filter-chips" style={{ paddingTop: 0 }}>
                    {categories.slice(0, 10).map(cat => (
                        <button
                            key={cat}
                            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                        >
                            {cat === 'all' ? 'Tüm Kategoriler' : cat}
                        </button>
                    ))}
                    {categories.length > 10 && (
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>+{categories.length - 10} daha...</span>
                    )}
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Emoji</th>
                            <th>Kelime</th>
                            <th>Türkçe</th>
                            <th>Kategori</th>
                            <th>Seviye</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedWords.map(word => (
                            <tr key={word.word}>
                                <td style={{ fontSize: '1.5rem' }}>{word.emoji}</td>
                                <td><strong>{word.word}</strong></td>
                                <td>{word.turkish}</td>
                                <td>{word.category}</td>
                                <td>
                                    <span className={`badge ${getLevelBadgeClass(word.level)}`}>
                                        {getLevelLabel(word.level)}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="edit-btn" onClick={() => openEditModal(word)}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(word.word)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredWords.length === 0 && (
                    <div className="no-data">
                        <BookOpen size={48} style={{ opacity: 0.3 }} />
                        <p>Kelime bulunamadı</p>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            ← Önceki
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let page;
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
                            Sonraki →
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingWord ? 'Kelimeyi Düzenle' : 'Yeni Kelime Ekle'}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>İngilizce Kelime</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            value={formData.word}
                                            onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                                            placeholder="Örn: apple"
                                            style={{ flex: 1 }}
                                            required
                                        />
                                        <button type="button" className="cancel-btn" onClick={fetchWordEnrich} disabled={enriching} style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Otomatik doldur">
                                            <Sparkles size={16} />
                                            {enriching ? '...' : 'Otomatik Doldur'}
                                        </button>
                                    </div>
                                    <small style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Kelime yazıp tıklayın — Türkçe, emoji, örnek cümle otomatik gelir. İsterseniz değiştirebilirsiniz.</small>
                                </div>

                                <div className="form-group">
                                    <label>Türkçe Karşılığı</label>
                                    <input
                                        type="text"
                                        value={formData.turkish}
                                        onChange={(e) => setFormData({ ...formData, turkish: e.target.value })}
                                        placeholder="Örn: elma"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Emoji (tıklayarak değiştirebilirsiniz)</label>
                                    <input
                                        type="text"
                                        value={formData.emoji}
                                        onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                                        placeholder="🍎"
                                        style={{ width: '80px', fontSize: '1.5rem', textAlign: 'center' }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Kategori</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="Örn: Food, Animals..."
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Seviye</label>
                                    <select
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
                                    >
                                        <option value="beginner">Başlangıç (2-3. Sınıf)</option>
                                        <option value="intermediate">Orta (4. Sınıf)</option>
                                        <option value="advanced">İleri (5. Sınıf)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Örnek Cümle</label>
                                    <input
                                        type="text"
                                        value={formData.example}
                                        onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                                        placeholder="Örn: I eat an apple every day."
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                                    İptal
                                </button>
                                <button type="submit" className="save-btn">
                                    {editingWord ? 'Güncelle' : 'Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WordsManager;
