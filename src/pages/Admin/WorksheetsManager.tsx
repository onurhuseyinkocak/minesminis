import { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Search, FileText, ExternalLink, Upload } from 'lucide-react';
import { Worksheet, categories, grades } from '../../data/worksheetsData';
import { adminFetch } from '../../utils/adminApi';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import './WorksheetsManager.css';

interface SupabaseWorksheetRow {
    id: string;
    title: string;
    description?: string | null;
    subject?: string | null;
    grade?: string | null;
    thumbnail_url?: string | null;
    file_url?: string | null;
    source?: string | null;
}

function mapSupabaseToWorksheet(ws: SupabaseWorksheetRow): Worksheet {
    return {
        id: ws.id,
        title: ws.title,
        description: ws.description || '',
        category: ws.subject || 'Vocabulary',
        grade: ws.grade || '2',
        thumbnailUrl: ws.thumbnail_url || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=200&fit=crop',
        externalUrl: ws.file_url || '',
        source: ws.source || 'MinesMinis'
    };
}

function WorksheetsManager() {
    const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorksheet, setEditingWorksheet] = useState<Worksheet | null>(null);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        category: 'Vocabulary',
        grade: '2',
        thumbnailUrl: '',
        externalUrl: '',
        source: ''
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Worksheet | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext || '')) {
            toast.error('Sadece PDF, JPEG, PNG yüklenebilir');
            return;
        }
        setUploading(true);
        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result.includes(',') ? result.split(',')[1] : result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            const res = await adminFetch('/api/admin/upload', {
                method: 'POST',
                body: JSON.stringify({ file: base64, name: file.name })
            });
            const json = await res.json().catch(() => ({}));
            if (json.url) {
                setFormData(f => ({
                    ...f,
                    externalUrl: json.url,
                    thumbnailUrl: json.thumbnailUrl || f.thumbnailUrl,
                    source: 'Yüklenen dosya'
                }));
                toast.success('Dosya yüklendi (PDF/PNG/JPEG)');
            } else throw new Error(json.message || json.error || 'Yükleme başarısız');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Yükleme başarısız';
            toast.error(msg);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const fetchWorksheets = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('worksheets').select('id, title, description, subject, grade, thumbnail_url, file_url, source');
            if (error) throw error;
            setWorksheets(((data as SupabaseWorksheetRow[]) || []).map(mapSupabaseToWorksheet));
        } catch {
            toast.error('Çalışma kağıtları yüklenemedi');
            setWorksheets([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWorksheets();
    }, [fetchWorksheets]);

    const filteredWorksheets = useMemo(() => {
        return worksheets.filter(ws => {
            const matchesSearch = ws.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ws.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGrade = selectedGrade === 'All' || ws.grade === selectedGrade;
            const matchesCategory = selectedCategory === 'All' || ws.category === selectedCategory;
            return matchesSearch && matchesGrade && matchesCategory;
        });
    }, [worksheets, searchTerm, selectedGrade, selectedCategory]);

    const openAddModal = () => {
        setEditingWorksheet(null);
        setFormData({
            id: `ws-${Date.now()}`,
            title: '',
            description: '',
            category: 'Vocabulary',
            grade: '2',
            thumbnailUrl: '',
            externalUrl: '',
            source: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (worksheet: Worksheet) => {
        setEditingWorksheet(worksheet);
        setFormData({
            id: worksheet.id,
            title: worksheet.title,
            description: worksheet.description,
            category: worksheet.category,
            grade: worksheet.grade,
            thumbnailUrl: worksheet.thumbnailUrl,
            externalUrl: worksheet.externalUrl,
            source: worksheet.source
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error('Başlık zorunludur');
            return;
        }
        if (!formData.externalUrl.trim()) {
            toast.error('Dosya URL zorunludur');
            return;
        }
        setSaving(true);
        const payload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            grade: formData.grade,
            thumbnailUrl: formData.thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=200&fit=crop',
            externalUrl: formData.externalUrl.trim(),
            source: formData.source.trim()
        };
        try {
            if (editingWorksheet) {
                const res = await adminFetch(`/api/admin/worksheets/${editingWorksheet.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(payload)
                });
                const json: Record<string, unknown> = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error((json.error as string) || 'Güncelleme başarısız');
                toast.success('Çalışma kağıdı güncellendi!');
            } else {
                const res = await adminFetch('/api/admin/worksheets', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                const json: Record<string, unknown> = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error((json.error as string) || 'Ekleme başarısız');
                toast.success('Yeni çalışma kağıdı eklendi!');
            }
            setIsModalOpen(false);
            await fetchWorksheets();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Kayıt başarısız');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (worksheet: Worksheet) => {
        setDeleteTarget(worksheet);
    };

    const executeDelete = async () => {
        if (!deleteTarget) return;
        const id = deleteTarget.id;
        setDeleteTarget(null);
        setDeletingId(id);
        try {
            const res = await adminFetch(`/api/admin/worksheets/${id}`, { method: 'DELETE' });
            const json: Record<string, unknown> = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error((json.error as string) || 'Silme başarısız');
            toast.success('Çalışma kağıdı silindi!');
            await fetchWorksheets();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Silme başarısız');
        } finally {
            setDeletingId(null);
        }
    };

    const getCategoryClass = (category: string) => {
        switch (category) {
            case 'Vocabulary': return 'adm-badge--vocab';
            case 'Grammar':    return 'adm-badge--grammar';
            case 'Reading':    return 'adm-badge--reading';
            case 'Writing':    return 'adm-badge--writing';
            case 'Phonics':    return 'adm-badge--phonics';
            default:           return 'adm-badge--default';
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1><FileText size={28} /> Çalışma Kağıdı Yönetimi</h1>
                <p>Eğitici çalışma kağıtlarını ekleyin ve düzenleyin</p>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h2>{filteredWorksheets.length} Çalışma Kağıdı</h2>
                    <div className="table-actions">
                        <div className="adm-search-wrap">
                            <Search size={18} className="adm-search-icon" />
                            <input
                                type="text"
                                placeholder="Çalışma kağıdı ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input adm-search-input"
                            />
                        </div>
                        <button type="button" className="add-btn" onClick={openAddModal}>
                            <Plus size={18} />
                            Ekle
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
                            {grade === 'All' ? 'Tümü' : `${grade}. Sınıf`}
                        </button>
                    ))}
                </div>

                <div className="filter-chips adm-filter-chips-dense">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat === 'All' ? 'Tüm Kategoriler' : cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="no-data">
                        <p>Yükleniyor...</p>
                    </div>
                ) : (
                <>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Görsel</th>
                            <th>Başlık</th>
                            <th>Kategori</th>
                            <th>Sınıf</th>
                            <th>Kaynak</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWorksheets.map(ws => (
                            <tr key={ws.id}>
                                <td>
                                    <img
                                        src={ws.thumbnailUrl}
                                        alt={ws.title}
                                        className="table-thumbnail"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect fill="%236366f1" width="60" height="40" rx="4"/><text x="30" y="26" text-anchor="middle" fill="white" font-size="14" font-family="sans-serif">PDF</text></svg>';
                                        }}
                                    />
                                </td>
                                <td>
                                    <div>
                                        <strong>{ws.title}</strong>
                                        <div className="adm-ws-desc">{ws.description}</div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`adm-badge ${getCategoryClass(ws.category)}`}>
                                        {ws.category}
                                    </span>
                                </td>
                                <td>{ws.grade}. Sınıf</td>
                                <td>
                                    <a
                                        href={ws.externalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="adm-ws-source-link"
                                    >
                                        {ws.source} <ExternalLink size={12} />
                                    </a>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button type="button" className="edit-btn" onClick={() => openEditModal(ws)} disabled={deletingId === ws.id}>
                                            <Pencil size={16} />
                                        </button>
                                        <button type="button" className="delete-btn" onClick={() => handleDelete(ws)} disabled={deletingId === ws.id}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredWorksheets.length === 0 && (
                    <div className="no-data">
                        <FileText size={48} style={{ opacity: 0.3 }} />
                        <p>Çalışma kağıdı bulunamadı</p>
                    </div>
                )}
                </>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingWorksheet ? 'Düzenle' : 'Yeni Çalışma Kağıdı Ekle'}</h3>
                            <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Başlık</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Örn: Animals Vocabulary"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Açıklama</label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Kısa açıklama..."
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Sınıf</label>
                                    <select
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                    >
                                        {grades.filter(g => g !== 'All').map(grade => (
                                            <option key={grade} value={grade}>{grade}. Sınıf</option>
                                        ))}
                                    </select>
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
                                    <label>Dosya veya Harici URL</label>
                                    <div className="adm-upload-row">
                                        <label className="add-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', margin: 0 }}>
                                            <Upload size={18} />
                                            {uploading ? 'Yükleniyor...' : 'PDF / JPEG / PNG Yükle'}
                                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} disabled={uploading} style={{ display: 'none' }} />
                                        </label>
                                        <span className="adm-upload-hint">veya URL girin:</span>
                                    </div>
                                    <input
                                        type="url"
                                        value={formData.externalUrl}
                                        onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                                        placeholder="https://... veya yukarıdan dosya yükleyin"
                                        className="adm-url-input-mt"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Kaynak Adı</label>
                                    <input
                                        type="text"
                                        value={formData.source}
                                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                        placeholder="Örn: British Council"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                                    İptal
                                </button>
                                <button type="submit" className="save-btn" disabled={saving}>
                                    {saving ? 'Kaydediliyor...' : editingWorksheet ? 'Güncelle' : 'Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={executeDelete}
                title="Çalışma Kağıdını Sil"
                message={`"${deleteTarget?.title}" çalışma kağıdını silmek istediğinizden emin misiniz?`}
                confirmLabel="Sil"
                variant="danger"
            />
        </div>
    );
}

export default WorksheetsManager;
