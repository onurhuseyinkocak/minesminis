import { useState, useMemo, useEffect } from 'react';
import {
    Search, Plus, Pencil, Trash2, X, Download, Sparkles,
    Gamepad2, Video, BookOpen, FileText, ChevronLeft, ChevronRight,
    Play, Upload, RefreshCw, ExternalLink
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import { adminFetch, getAdminApiBase } from '../../utils/adminApi';
import { KidsWord } from '../../data/wordsData';
import { wordStore } from '../../data/wordStore';
import { gameStore } from '../../data/gameStore';
import { videoStore, type Video as VideoType } from '../../data/videoStore';
import { Worksheet, categories as wsCategories, grades as wsGrades } from '../../data/worksheetsData';
import toast from 'react-hot-toast';
import './AdminContentManager.css';

type TabType = 'words' | 'games' | 'videos' | 'worksheets';

type GameRow = { id: string; title: string; embedUrl: string; thumbnailUrl: string; type: string; grade: string; };

const extractEmbedFromIframe = (text: string): string => {
    const m = text.match(/src=["']([^"']+)["']/i) || text.match(/https?:\/\/[^\s"']+/);
    return m ? (m[1] || m[0]).trim() : '';
};

function mapSupabaseToWorksheet(ws: Record<string, unknown>): Worksheet {
    return {
        id: String(ws.id), title: String(ws.title), description: String(ws.description || ''),
        category: String(ws.subject || 'Vocabulary'), grade: String(ws.grade || '2'),
        thumbnailUrl: String(ws.thumbnail_url || ''), externalUrl: String(ws.file_url || ''),
        source: String(ws.source || 'MinesMinis')
    };
}

const ITEMS_PER_PAGE = 12;
const gameTypes = ['Quiz', 'Match Up', 'Maze Chase', 'Whack-a-Mole', 'Open Box', 'Memory Game'];

function AdminContentManager() {
    const [activeTab, setActiveTab] = useState<TabType>('words');
    const [searchTerm, setSearchTerm] = useState('');

    // --- Words State ---
    const [words, setWords] = useState<KidsWord[]>([]);
    const [wordsLoading, setWordsLoading] = useState(true);
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [wordsPage, setWordsPage] = useState(1);

    // --- Games State ---
    const [games, setGames] = useState<GameRow[]>([]);
    const [gamesLoading, setGamesLoading] = useState(true);
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [gamesPage, setGamesPage] = useState(1);

    // --- Videos State ---
    const [videos, setVideos] = useState<VideoType[]>([]);
    const [videosLoading, setVideosLoading] = useState(true);
    const [selectedVGrade, setSelectedVGrade] = useState('all');
    const [selectedVType, setSelectedVType] = useState('all');
    const [videosPage, setVideosPage] = useState(1);

    // --- Worksheets State ---
    const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
    const [worksheetsLoading, setWorksheetsLoading] = useState(true);
    const [selectedWGrade, setSelectedWGrade] = useState('All');
    const [selectedWCat, setSelectedWCat] = useState('All');
    const [worksheetsPage, setWorksheetsPage] = useState(1);

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<unknown>(null);
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [enriching, setEnriching] = useState(false);
    const [uploading, setUploading] = useState(false);

    // ========== Load Data ==========
    useEffect(() => {
        loadWords();
        loadGames();
        loadVideos();
        loadWorksheets();
    }, []);

    const loadWords = async () => {
        setWordsLoading(true);
        try {
            const { data, error } = await supabase.from('words').select('*').order('word');
            if (!error && data && data.length > 0) {
                setWords(data.map((r: Record<string, unknown>) => ({
                    word: String(r.word), turkish: String(r.turkish),
                    level: (r.level as KidsWord['level']) || 'beginner',
                    category: String(r.category || 'Animals'),
                    emoji: String(r.emoji || '\u{1F4DA}'),
                    example: r.example ? String(r.example) : undefined
                })));
            } else {
                setWords(wordStore.getWords());
            }
        } catch { setWords(wordStore.getWords()); }
        finally { setWordsLoading(false); }
    };

    const loadGames = async () => {
        setGamesLoading(true);
        try {
            const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
            if (!error && data && data.length > 0) {
                setGames(data.map((r: Record<string, unknown>) => ({
                    id: String(r.id), title: String(r.title), embedUrl: String(r.url),
                    thumbnailUrl: String(r.thumbnail_url || ''), type: String(r.category || 'Quiz'),
                    grade: String(r.target_audience || '2')
                })));
            } else {
                const local = gameStore.getGames();
                setGames(local.map(g => ({ id: String(g.id), title: g.title, embedUrl: g.embedUrl, thumbnailUrl: g.thumbnailUrl, type: g.type, grade: g.grade || '2' })));
            }
        } catch {
            const local = gameStore.getGames();
            setGames(local.map(g => ({ id: String(g.id), title: g.title, embedUrl: g.embedUrl, thumbnailUrl: g.thumbnailUrl, type: g.type, grade: g.grade || '2' })));
        } finally { setGamesLoading(false); }
    };

    const loadVideos = async () => {
        setVideosLoading(true);
        try {
            await videoStore.fetchVideos();
            setVideos(videoStore.getVideos());
        } catch { /* handled by store */ }
        finally { setVideosLoading(false); }
    };

    const loadWorksheets = async () => {
        setWorksheetsLoading(true);
        try {
            const { data, error } = await supabase.from('worksheets').select('id, title, description, subject, grade, thumbnail_url, file_url, source');
            if (!error) setWorksheets((data || []).map(mapSupabaseToWorksheet));
        } catch { /* ignore */ }
        finally { setWorksheetsLoading(false); }
    };

    // ========== Filtered & Paginated Data ==========
    const wordCategories = useMemo(() => {
        const cats = new Set(words.map(w => w.category));
        return ['all', ...Array.from(cats)];
    }, [words]);

    const filteredWords = useMemo(() => words.filter(w => {
        const s = searchTerm.toLowerCase();
        return (w.word.toLowerCase().includes(s) || w.turkish.toLowerCase().includes(s)) &&
            (selectedLevel === 'all' || w.level === selectedLevel) &&
            (selectedCategory === 'all' || w.category === selectedCategory);
    }), [words, searchTerm, selectedLevel, selectedCategory]);

    const filteredGames = useMemo(() => games.filter(g =>
        g.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedGrade === 'all' || g.grade === selectedGrade)
    ), [games, searchTerm, selectedGrade]);

    const filteredVideos = useMemo(() => videos.filter(v =>
        (v.title.toLowerCase().includes(searchTerm.toLowerCase()) || v.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedVGrade === 'all' || v.grade === selectedVGrade) &&
        (selectedVType === 'all' || v.category === selectedVType)
    ), [videos, searchTerm, selectedVGrade, selectedVType]);

    const filteredWorksheets = useMemo(() => worksheets.filter(ws =>
        (ws.title.toLowerCase().includes(searchTerm.toLowerCase()) || ws.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedWGrade === 'All' || ws.grade === selectedWGrade) &&
        (selectedWCat === 'All' || ws.category === selectedWCat)
    ), [worksheets, searchTerm, selectedWGrade, selectedWCat]);

    const paginate = <T,>(items: T[], page: number) => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return items.slice(start, start + ITEMS_PER_PAGE);
    };

    // ========== CRUD Handlers ==========
    const openAddModal = () => {
        setEditingItem(null);
        if (activeTab === 'words') setFormData({ word: '', turkish: '', level: 'beginner', category: 'Animals', emoji: '\u{1F4DA}', example: '' });
        else if (activeTab === 'games') setFormData({ title: '', embedUrl: '', thumbnailUrl: '', type: 'Quiz', grade: '2' });
        else if (activeTab === 'videos') setFormData({ id: '', title: '', description: '', grade: '2nd Grade', type: 'song', duration: '', isPopular: false });
        else setFormData({ title: '', description: '', category: 'Vocabulary', grade: '2', thumbnailUrl: '', externalUrl: '', source: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (item: unknown) => {
        setEditingItem(item);
        if (activeTab === 'words') {
            const w = item as KidsWord;
            setFormData({ word: w.word, turkish: w.turkish, level: w.level, category: w.category, emoji: w.emoji, example: w.example || '' });
        } else if (activeTab === 'games') {
            const g = item as GameRow;
            setFormData({ title: g.title, embedUrl: g.embedUrl, thumbnailUrl: g.thumbnailUrl, type: g.type, grade: g.grade });
        } else if (activeTab === 'videos') {
            const v = item as VideoType;
            setFormData({ id: v.youtube_id, title: v.title, description: v.description, grade: v.grade, type: v.category || 'song', duration: v.duration, isPopular: v.isPopular || false });
        } else {
            const ws = item as Worksheet;
            setFormData({ title: ws.title, description: ws.description, category: ws.category, grade: ws.grade, thumbnailUrl: ws.thumbnailUrl, externalUrl: ws.externalUrl, source: ws.source });
        }
        setIsModalOpen(true);
    };

    // Word enrich
    const fetchWordEnrich = async () => {
        const w = String(formData.word || '').trim().toLowerCase();
        if (!w) { toast.error('Enter an English word first'); return; }
        setEnriching(true);
        try {
            const res = await adminFetch('/api/words/enrich', { method: 'POST', body: JSON.stringify({ word: w }) });
            const json = await res.json().catch(() => ({}));
            if (json.turkish) {
                setFormData(f => ({ ...f, turkish: json.turkish, emoji: json.emoji || f.emoji, example: json.example || f.example }));
                toast.success('Auto-filled Turkish, emoji, and example');
            } else toast.error(json.error || 'Could not fetch word info');
        } catch { toast.error('Could not fetch word info'); }
        finally { setEnriching(false); }
    };

    // YouTube meta
    const fetchYouTubeMeta = async () => {
        const raw = String(formData.id || '').trim();
        if (!raw) { toast.error('Enter a video URL or ID first'); return; }
        setEnriching(true);
        try {
            const res = await fetch(`${getAdminApiBase()}/api/youtube/metadata?url=${encodeURIComponent(raw)}`);
            const json = await res.json().catch(() => ({}));
            if (json.videoId) {
                setFormData(f => ({ ...f, id: json.videoId, title: json.title || f.title, description: json.description || f.description, duration: json.duration || f.duration }));
                toast.success('Auto-filled title, description, and duration');
            } else toast.error(json.error || 'Could not fetch video info');
        } catch { toast.error('Could not fetch video info'); }
        finally { setEnriching(false); }
    };

    // File upload for worksheets
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext || '')) { toast.error('Only PDF, JPEG, PNG allowed'); return; }
        setUploading(true);
        try {
            const base64 = await new Promise<string>((res, rej) => {
                const reader = new FileReader();
                reader.onload = () => { const r = reader.result as string; res(r.includes(',') ? r.split(',')[1] : r); };
                reader.onerror = rej;
                reader.readAsDataURL(file);
            });
            const resp = await adminFetch('/api/admin/upload', { method: 'POST', body: JSON.stringify({ file: base64, name: file.name }) });
            const json = await resp.json().catch(() => ({}));
            if (json.url) {
                setFormData(f => ({ ...f, externalUrl: json.url, thumbnailUrl: json.thumbnailUrl || f.thumbnailUrl, source: 'Uploaded file' }));
                toast.success('File uploaded');
            } else throw new Error(json.error || 'Upload failed');
        } catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Upload failed'); }
        finally { setUploading(false); e.target.value = ''; }
    };

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (activeTab === 'words') {
                const w = String(formData.word || '').trim();
                if (!w) return;
                const wordData = { ...formData, example: formData.example || undefined } as unknown as KidsWord;
                if (editingItem) {
                    const oldWord = (editingItem as KidsWord).word;
                    const res = await adminFetch(`/api/admin/words/${encodeURIComponent(oldWord)}`, {
                        method: 'PATCH', body: JSON.stringify({ turkish: formData.turkish, level: formData.level, category: formData.category, emoji: formData.emoji, example: formData.example || null })
                    });
                    if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Update failed'); }
                    wordStore.updateWord(oldWord, wordData);
                    setWords(prev => prev.map(x => x.word === oldWord ? { ...wordData, word: oldWord } : x));
                    toast.success('Word updated');
                } else {
                    if (words.some(x => x.word.toLowerCase() === w.toLowerCase())) { toast.error('Word already exists'); return; }
                    const res = await adminFetch('/api/admin/words', { method: 'POST', body: JSON.stringify({ word: w, turkish: formData.turkish, level: formData.level, category: formData.category, emoji: formData.emoji, example: formData.example || null }) });
                    if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Create failed'); }
                    wordStore.addWord(wordData);
                    setWords(prev => [...prev, wordData]);
                    toast.success('Word added');
                }
            } else if (activeTab === 'games') {
                const url = extractEmbedFromIframe(String(formData.embedUrl || '')) || String(formData.embedUrl || '');
                if (!url.startsWith('http')) { toast.error('Enter a valid embed URL'); return; }
                const body = { title: formData.title, url, category: formData.type, thumbnail_url: formData.thumbnailUrl || null, description: formData.type, target_audience: formData.grade };
                if (editingItem) {
                    const g = editingItem as GameRow;
                    const res = await adminFetch(`/api/admin/games/${g.id}`, { method: 'PATCH', body: JSON.stringify(body) });
                    if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Update failed'); }
                    setGames(prev => prev.map(x => x.id === g.id ? { ...x, ...formData as unknown as GameRow, embedUrl: url } : x));
                    toast.success('Game updated');
                } else {
                    const res = await adminFetch('/api/admin/games', { method: 'POST', body: JSON.stringify(body) });
                    const json = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(json.error || 'Create failed');
                    setGames(prev => [{ ...formData as unknown as GameRow, id: json.id || Date.now().toString(), embedUrl: url }, ...prev]);
                    toast.success('Game added');
                }
            } else if (activeTab === 'videos') {
                const extractYTId = (url: string) => {
                    const p = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, /^([a-zA-Z0-9_-]{11})$/];
                    for (const pat of p) { const m = url.match(pat); if (m) return m[1]; }
                    return url;
                };
                const videoId = extractYTId(String(formData.id || ''));
                const payload = { youtube_id: videoId, title: formData.title, description: formData.description, thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, grade: formData.grade, category: formData.type, duration: formData.duration, isPopular: formData.isPopular };
                if (editingItem) {
                    const v = editingItem as VideoType;
                    const res = await adminFetch(`/api/admin/videos/${v.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
                    if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Update failed'); }
                    await videoStore.fetchVideos();
                    setVideos(videoStore.getVideos());
                    toast.success('Video updated');
                } else {
                    const res = await adminFetch('/api/admin/videos', { method: 'POST', body: JSON.stringify(payload) });
                    if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Create failed'); }
                    await videoStore.fetchVideos();
                    setVideos(videoStore.getVideos());
                    toast.success('Video added');
                }
            } else {
                const payload = { title: formData.title, description: formData.description, category: formData.category, grade: formData.grade, thumbnailUrl: formData.thumbnailUrl || '', externalUrl: formData.externalUrl, source: formData.source };
                if (editingItem) {
                    const ws = editingItem as Worksheet;
                    const res = await adminFetch(`/api/admin/worksheets/${ws.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
                    if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Update failed'); }
                    toast.success('Worksheet updated');
                } else {
                    const res = await adminFetch('/api/admin/worksheets', { method: 'POST', body: JSON.stringify(payload) });
                    if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Create failed'); }
                    toast.success('Worksheet added');
                }
                await loadWorksheets();
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Operation failed');
        }
    };

    // Delete handlers
    const handleDeleteWord = async (word: string) => {
        if (!confirm(`Delete word "${word}"?`)) return;
        try {
            const res = await adminFetch(`/api/admin/words/${encodeURIComponent(word)}`, { method: 'DELETE' });
            if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Delete failed'); }
            wordStore.deleteWord(word);
            setWords(prev => prev.filter(x => x.word !== word));
            toast.success('Word deleted');
        } catch (err) { toast.error(err instanceof Error ? err.message : 'Delete failed'); }
    };

    const handleDeleteGame = async (id: string) => {
        if (!confirm('Delete this game?')) return;
        try {
            const res = await adminFetch(`/api/admin/games/${id}`, { method: 'DELETE' });
            if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Delete failed'); }
            setGames(prev => prev.filter(g => g.id !== id));
            toast.success('Game deleted');
        } catch (err) { toast.error(err instanceof Error ? err.message : 'Delete failed'); }
    };

    const handleDeleteVideo = async (id: string) => {
        if (!confirm('Delete this video?')) return;
        try {
            const res = await adminFetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
            if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Delete failed'); }
            await videoStore.fetchVideos();
            setVideos(videoStore.getVideos());
            toast.success('Video deleted');
        } catch (err) { toast.error(err instanceof Error ? err.message : 'Delete failed'); }
    };

    const handleDeleteWorksheet = async (id: string) => {
        if (!confirm('Delete this worksheet?')) return;
        try {
            const res = await adminFetch(`/api/admin/worksheets/${id}`, { method: 'DELETE' });
            if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Delete failed'); }
            toast.success('Worksheet deleted');
            await loadWorksheets();
        } catch (err) { toast.error(err instanceof Error ? err.message : 'Delete failed'); }
    };

    const exportWords = () => {
        const csv = words.map(w => `${w.word},${w.turkish},${w.level},${w.category},${w.emoji},${w.example || ''}`).join('\n');
        const blob = new Blob([`word,turkish,level,category,emoji,example\n${csv}`], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'words_export.csv'; a.click();
        toast.success('Words exported');
    };

    // ========== Pagination Helper ==========
    const renderPagination = (total: number, current: number, setCurrent: (n: number) => void) => {
        const pages = Math.ceil(total / ITEMS_PER_PAGE);
        if (pages <= 1) return null;
        return (
            <div className="adm-content-pagination">
                <span>{total} items total</span>
                <div className="adm-content-pagination-btns">
                    <button type="button" className="adm-page-btn" onClick={() => setCurrent(Math.max(1, current - 1))} disabled={current === 1}>
                        <ChevronLeft size={14} />
                    </button>
                    <span style={{ padding: '0 0.5rem', fontSize: '0.8rem' }}>{current} / {pages}</span>
                    <button type="button" className="adm-page-btn" onClick={() => setCurrent(Math.min(pages, current + 1))} disabled={current === pages}>
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        );
    };

    // ========== Render ==========
    const isLoading = activeTab === 'words' ? wordsLoading : activeTab === 'games' ? gamesLoading : activeTab === 'videos' ? videosLoading : worksheetsLoading;

    return (
        <div className="adm-content">
            <div className="adm-content-header">
                <h1>Content</h1>
                <p>Manage all educational content in one place</p>
            </div>

            {/* Tabs */}
            <div className="adm-tabs">
                {([
                    { key: 'words' as TabType, icon: BookOpen, label: 'Words', count: words.length },
                    { key: 'games' as TabType, icon: Gamepad2, label: 'Games', count: games.length },
                    { key: 'videos' as TabType, icon: Video, label: 'Videos', count: videos.length },
                    { key: 'worksheets' as TabType, icon: FileText, label: 'Worksheets', count: worksheets.length },
                ]).map(tab => (
                    <button
                        key={tab.key}
                        className={`adm-tab ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => { setActiveTab(tab.key); setSearchTerm(''); }}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        <span className="adm-tab-count">{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="adm-content-toolbar">
                <div className="adm-search-input">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Tab-specific filters */}
                {activeTab === 'words' && (
                    <>
                        <select className="adm-filter-select" value={selectedLevel} onChange={(e) => { setSelectedLevel(e.target.value); setWordsPage(1); }}>
                            <option value="all">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        <select className="adm-filter-select" value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setWordsPage(1); }}>
                            {wordCategories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
                        </select>
                    </>
                )}
                {activeTab === 'games' && (
                    <select className="adm-filter-select" value={selectedGrade} onChange={(e) => { setSelectedGrade(e.target.value); setGamesPage(1); }}>
                        <option value="all">All Grades</option>
                        <option value="2">2nd Grade</option>
                        <option value="3">3rd Grade</option>
                        <option value="4">4th Grade</option>
                        <option value="primary">Primary</option>
                    </select>
                )}
                {activeTab === 'videos' && (
                    <>
                        <select className="adm-filter-select" value={selectedVGrade} onChange={(e) => { setSelectedVGrade(e.target.value); setVideosPage(1); }}>
                            <option value="all">All Grades</option>
                            <option value="2nd Grade">2nd Grade</option>
                            <option value="3rd Grade">3rd Grade</option>
                            <option value="4th Grade">4th Grade</option>
                        </select>
                        <select className="adm-filter-select" value={selectedVType} onChange={(e) => { setSelectedVType(e.target.value); setVideosPage(1); }}>
                            <option value="all">All Types</option>
                            <option value="song">Song</option>
                            <option value="lesson">Lesson</option>
                            <option value="story">Story</option>
                        </select>
                    </>
                )}
                {activeTab === 'worksheets' && (
                    <>
                        <select className="adm-filter-select" value={selectedWGrade} onChange={(e) => { setSelectedWGrade(e.target.value); setWorksheetsPage(1); }}>
                            {wsGrades.map(g => <option key={g} value={g}>{g === 'All' ? 'All Grades' : `${g}. Grade`}</option>)}
                        </select>
                        <select className="adm-filter-select" value={selectedWCat} onChange={(e) => { setSelectedWCat(e.target.value); setWorksheetsPage(1); }}>
                            {wsCategories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                        </select>
                    </>
                )}

                <div className="adm-toolbar-divider" />

                {activeTab === 'words' && (
                    <button type="button" className="adm-action-btn" onClick={exportWords}>
                        <Download size={14} /> Export
                    </button>
                )}
                <button type="button" className="adm-action-btn primary" onClick={openAddModal}>
                    <Plus size={14} /> Add {activeTab === 'words' ? 'Word' : activeTab === 'games' ? 'Game' : activeTab === 'videos' ? 'Video' : 'Worksheet'}
                </button>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="adm-loading" style={{ minHeight: '20vh' }}>
                    <div className="adm-spinner" />
                    <p>Loading {activeTab}...</p>
                </div>
            )}

            {/* Words Table */}
            {!isLoading && activeTab === 'words' && (
                <div className="adm-content-table-wrap">
                    <table className="adm-content-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Word</th>
                                <th>Turkish</th>
                                <th>Category</th>
                                <th>Level</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginate(filteredWords, wordsPage).map(word => (
                                <tr key={word.word}>
                                    <td><div className="adm-thumb-emoji">{word.emoji}</div></td>
                                    <td><strong>{word.word}</strong></td>
                                    <td>{word.turkish}</td>
                                    <td style={{ fontSize: '0.775rem', color: 'var(--admin-text-secondary)' }}>{word.category}</td>
                                    <td>
                                        <span className={`adm-level-badge ${word.level}`}>
                                            {word.level === 'beginner' ? 'Beginner' : word.level === 'intermediate' ? 'Intermediate' : 'Advanced'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="adm-table-actions">
                                            <button type="button" className="adm-icon-btn" onClick={() => openEditModal(word)}><Pencil size={14} /></button>
                                            <button type="button" className="adm-icon-btn danger" onClick={() => handleDeleteWord(word.word)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredWords.length === 0 && <div className="adm-no-data"><BookOpen size={40} /><p>No words found</p></div>}
                    {renderPagination(filteredWords.length, wordsPage, setWordsPage)}
                </div>
            )}

            {/* Games Table */}
            {!isLoading && activeTab === 'games' && (
                <div className="adm-content-table-wrap">
                    <table className="adm-content-table">
                        <thead>
                            <tr>
                                <th>Thumb</th>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Grade</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginate(filteredGames, gamesPage).map(game => (
                                <tr key={game.id}>
                                    <td>
                                        <img
                                            src={game.thumbnailUrl}
                                            alt={game.title}
                                            className="adm-thumb"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </td>
                                    <td><strong>{game.title}</strong></td>
                                    <td><span className="adm-level-badge beginner">{game.type}</span></td>
                                    <td>{game.grade === 'primary' ? 'Primary' : `${game.grade}. Grade`}</td>
                                    <td>
                                        <div className="adm-table-actions">
                                            <button type="button" className="adm-icon-btn" onClick={() => openEditModal(game)}><Pencil size={14} /></button>
                                            <button type="button" className="adm-icon-btn danger" onClick={() => handleDeleteGame(game.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredGames.length === 0 && <div className="adm-no-data"><Gamepad2 size={40} /><p>No games found</p></div>}
                    {renderPagination(filteredGames.length, gamesPage, setGamesPage)}
                </div>
            )}

            {/* Videos Table */}
            {!isLoading && activeTab === 'videos' && (
                <div className="adm-content-table-wrap">
                    <table className="adm-content-table">
                        <thead>
                            <tr>
                                <th>Thumb</th>
                                <th>Title</th>
                                <th>Grade</th>
                                <th>Type</th>
                                <th>Duration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginate(filteredVideos, videosPage).map(video => (
                                <tr key={video.id}>
                                    <td>
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                src={video.thumbnail?.startsWith('http') ? video.thumbnail : `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                                                alt={video.title}
                                                className="adm-thumb"
                                            />
                                            <Play size={12} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--white)', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                                        </div>
                                    </td>
                                    <td>
                                        <strong>{video.title}</strong>
                                        {video.isPopular && <span style={{ marginLeft: 6, fontSize: '0.7rem', color: 'var(--warning)', fontWeight: 600 }}>POPULAR</span>}
                                    </td>
                                    <td style={{ fontSize: '0.775rem' }}>{video.grade}</td>
                                    <td><span className="adm-level-badge intermediate">{video.category}</span></td>
                                    <td style={{ fontSize: '0.775rem', color: 'var(--admin-text-muted)' }}>{video.duration}</td>
                                    <td>
                                        <div className="adm-table-actions">
                                            <button type="button" className="adm-icon-btn" onClick={() => openEditModal(video)}><Pencil size={14} /></button>
                                            <button type="button" className="adm-icon-btn danger" onClick={() => handleDeleteVideo(video.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredVideos.length === 0 && <div className="adm-no-data"><Video size={40} /><p>No videos found</p></div>}
                    {renderPagination(filteredVideos.length, videosPage, setVideosPage)}
                </div>
            )}

            {/* Worksheets Table */}
            {!isLoading && activeTab === 'worksheets' && (
                <div className="adm-content-table-wrap">
                    <table className="adm-content-table">
                        <thead>
                            <tr>
                                <th>Thumb</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Grade</th>
                                <th>Source</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginate(filteredWorksheets, worksheetsPage).map(ws => (
                                <tr key={ws.id}>
                                    <td><img src={ws.thumbnailUrl} alt={ws.title} className="adm-thumb" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} /></td>
                                    <td>
                                        <strong>{ws.title}</strong>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginTop: 2 }}>{ws.description}</div>
                                    </td>
                                    <td><span className="adm-level-badge beginner">{ws.category}</span></td>
                                    <td>{ws.grade}. Grade</td>
                                    <td>
                                        <a href={ws.externalUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--admin-primary)', textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            {ws.source} <ExternalLink size={11} />
                                        </a>
                                    </td>
                                    <td>
                                        <div className="adm-table-actions">
                                            <button type="button" className="adm-icon-btn" onClick={() => openEditModal(ws)}><Pencil size={14} /></button>
                                            <button type="button" className="adm-icon-btn danger" onClick={() => handleDeleteWorksheet(ws.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredWorksheets.length === 0 && <div className="adm-no-data"><FileText size={40} /><p>No worksheets found</p></div>}
                    {renderPagination(filteredWorksheets.length, worksheetsPage, setWorksheetsPage)}
                </div>
            )}

            {/* ========== Add/Edit Modal ========== */}
            {isModalOpen && (
                <div className="adm-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="adm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
                        <div className="adm-modal-header">
                            <h3>{editingItem ? 'Edit' : 'Add'} {activeTab === 'words' ? 'Word' : activeTab === 'games' ? 'Game' : activeTab === 'videos' ? 'Video' : 'Worksheet'}</h3>
                            <button type="button" className="adm-icon-btn" onClick={() => setIsModalOpen(false)}><X size={16} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="adm-modal-body">
                                {/* WORDS FORM */}
                                {activeTab === 'words' && (
                                    <>
                                        <div className="adm-form-group">
                                            <label>English Word</label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input type="text" value={String(formData.word || '')} onChange={e => setFormData({ ...formData, word: e.target.value })} placeholder="e.g. apple" required style={{ flex: 1 }} />
                                                <button type="button" className="adm-btn" onClick={fetchWordEnrich} disabled={enriching} style={{ whiteSpace: 'nowrap' }}>
                                                    <Sparkles size={14} /> {enriching ? '...' : 'Auto Fill'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="adm-form-group">
                                            <label>Turkish</label>
                                            <input type="text" value={String(formData.turkish || '')} onChange={e => setFormData({ ...formData, turkish: e.target.value })} placeholder="e.g. elma" required />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '0.75rem' }}>
                                            <div className="adm-form-group">
                                                <label>Emoji</label>
                                                <input type="text" value={String(formData.emoji || '')} onChange={e => setFormData({ ...formData, emoji: e.target.value })} style={{ textAlign: 'center', fontSize: '1.25rem' }} />
                                            </div>
                                            <div className="adm-form-group">
                                                <label>Category</label>
                                                <input type="text" value={String(formData.category || '')} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                                            </div>
                                            <div className="adm-form-group">
                                                <label>Level</label>
                                                <select value={String(formData.level || 'beginner')} onChange={e => setFormData({ ...formData, level: e.target.value })}>
                                                    <option value="beginner">Beginner</option>
                                                    <option value="intermediate">Intermediate</option>
                                                    <option value="advanced">Advanced</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="adm-form-group">
                                            <label>Example Sentence</label>
                                            <input type="text" value={String(formData.example || '')} onChange={e => setFormData({ ...formData, example: e.target.value })} placeholder="I eat an apple every day." />
                                        </div>
                                    </>
                                )}

                                {/* GAMES FORM */}
                                {activeTab === 'games' && (
                                    <>
                                        <div className="adm-form-group">
                                            <label>Game Title</label>
                                            <input type="text" value={String(formData.title || '')} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Animals Quiz" required />
                                        </div>
                                        <div className="adm-form-group">
                                            <label>Embed URL or iframe</label>
                                            <input type="text" value={String(formData.embedUrl || '')} onChange={e => setFormData({ ...formData, embedUrl: e.target.value })} placeholder="https://wordwall.net/embed/..." required />
                                            <small>Paste iframe code or direct URL</small>
                                        </div>
                                        <div className="adm-form-group">
                                            <label>Thumbnail URL</label>
                                            <input type="text" value={String(formData.thumbnailUrl || '')} onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })} placeholder="https://..." />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <div className="adm-form-group">
                                                <label>Game Type</label>
                                                <select value={String(formData.type || 'Quiz')} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                                    {gameTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div className="adm-form-group">
                                                <label>Grade</label>
                                                <select value={String(formData.grade || '2')} onChange={e => setFormData({ ...formData, grade: e.target.value })}>
                                                    <option value="2">2nd Grade</option>
                                                    <option value="3">3rd Grade</option>
                                                    <option value="4">4th Grade</option>
                                                    <option value="primary">Primary</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* VIDEOS FORM */}
                                {activeTab === 'videos' && (
                                    <>
                                        <div className="adm-form-group">
                                            <label>YouTube URL or Video ID</label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input type="text" value={String(formData.id || '')} onChange={e => setFormData({ ...formData, id: e.target.value })} placeholder="https://youtube.com/watch?v=..." required style={{ flex: 1 }} />
                                                <button type="button" className="adm-btn" onClick={fetchYouTubeMeta} disabled={enriching} style={{ whiteSpace: 'nowrap' }}>
                                                    <RefreshCw size={14} /> {enriching ? '...' : 'Fetch'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="adm-form-group">
                                            <label>Title</label>
                                            <input type="text" value={String(formData.title || '')} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                        </div>
                                        <div className="adm-form-group">
                                            <label>Description</label>
                                            <textarea value={String(formData.description || '')} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                                            <div className="adm-form-group">
                                                <label>Grade</label>
                                                <select value={String(formData.grade || '2nd Grade')} onChange={e => setFormData({ ...formData, grade: e.target.value })}>
                                                    <option value="2nd Grade">2nd Grade</option>
                                                    <option value="3rd Grade">3rd Grade</option>
                                                    <option value="4th Grade">4th Grade</option>
                                                </select>
                                            </div>
                                            <div className="adm-form-group">
                                                <label>Type</label>
                                                <select value={String(formData.type || 'song')} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                                    <option value="song">Song</option>
                                                    <option value="lesson">Lesson</option>
                                                    <option value="story">Story</option>
                                                </select>
                                            </div>
                                            <div className="adm-form-group">
                                                <label>Duration</label>
                                                <input type="text" value={String(formData.duration || '')} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="2:30" />
                                            </div>
                                        </div>
                                        <div className="adm-form-check">
                                            <input type="checkbox" checked={!!formData.isPopular} onChange={e => setFormData({ ...formData, isPopular: e.target.checked })} />
                                            <label style={{ margin: 0 }}>Mark as Popular</label>
                                        </div>
                                    </>
                                )}

                                {/* WORKSHEETS FORM */}
                                {activeTab === 'worksheets' && (
                                    <>
                                        <div className="adm-form-group">
                                            <label>Title</label>
                                            <input type="text" value={String(formData.title || '')} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                        </div>
                                        <div className="adm-form-group">
                                            <label>Description</label>
                                            <input type="text" value={String(formData.description || '')} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <div className="adm-form-group">
                                                <label>Category</label>
                                                <select value={String(formData.category || 'Vocabulary')} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                    {wsCategories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div className="adm-form-group">
                                                <label>Grade</label>
                                                <select value={String(formData.grade || '2')} onChange={e => setFormData({ ...formData, grade: e.target.value })}>
                                                    {wsGrades.filter(g => g !== 'All').map(g => <option key={g} value={g}>{g}. Grade</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="adm-form-group">
                                            <label>Thumbnail URL</label>
                                            <input type="url" value={String(formData.thumbnailUrl || '')} onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })} placeholder="https://..." />
                                        </div>
                                        <div className="adm-form-group">
                                            <label>File or External URL</label>
                                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <label className="adm-btn" style={{ cursor: 'pointer' }}>
                                                    <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload File'}
                                                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} disabled={uploading} style={{ display: 'none' }} />
                                                </label>
                                            </div>
                                            <input type="url" value={String(formData.externalUrl || '')} onChange={e => setFormData({ ...formData, externalUrl: e.target.value })} placeholder="https://..." required />
                                        </div>
                                        <div className="adm-form-group">
                                            <label>Source Name</label>
                                            <input type="text" value={String(formData.source || '')} onChange={e => setFormData({ ...formData, source: e.target.value })} placeholder="e.g. British Council" required />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="adm-modal-footer">
                                <button type="button" className="adm-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="adm-btn primary">{editingItem ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminContentManager;
