import { useState, useMemo, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Search, FileText, ExternalLink } from 'lucide-react';
import { Worksheet, categories, grades } from '../../data/worksheetsData';
import { worksheetStore } from '../../data/worksheetStore';
import toast from 'react-hot-toast';

function WorksheetsManager() {
    const [worksheets, setWorksheets] = useState<Worksheet[]>(() => worksheetStore.getWorksheets());
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

    // Subscribe to store changes
    useEffect(() => {
        const unsubscribe = worksheetStore.subscribe((updatedWorksheets) => {
            setWorksheets(updatedWorksheets);
        });
        return unsubscribe;
    }, []);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingWorksheet) {
            worksheetStore.updateWorksheet(editingWorksheet.id, formData);
            setWorksheets(worksheetStore.getWorksheets());
            toast.success('Çalışma kağıdı güncellendi ve siteye kaydedildi!');
        } else {
            worksheetStore.addWorksheet(formData);
            setWorksheets(worksheetStore.getWorksheets());
            toast.success('Yeni çalışma kağıdı eklendi ve siteye kaydedildi! 📄');
        }

        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Bu çalışma kağıdını silmek istediğinize emin misiniz?')) {
            worksheetStore.deleteWorksheet(id);
            setWorksheets(worksheetStore.getWorksheets());
            toast.success('Çalışma kağıdı silindi!');
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Vocabulary': return '📖';
            case 'Grammar': return '📝';
            case 'Reading': return '📕';
            case 'Writing': return '✍️';
            case 'Phonics': return '🔤';
            default: return '📚';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Vocabulary': return '#6366f1';
            case 'Grammar': return '#10b981';
            case 'Reading': return '#f59e0b';
            case 'Writing': return '#ec4899';
            case 'Phonics': return '#8b5cf6';
            default: return '#6366f1';
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
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Çalışma kağıdı ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                        <button className="add-btn" onClick={openAddModal}>
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
                            {grade === 'All' ? '📚 Tümü' : `📖 ${grade}. Sınıf`}
                        </button>
                    ))}
                </div>

                <div className="filter-chips" style={{ paddingTop: 0 }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                            style={selectedCategory === cat && cat !== 'All' ? { background: getCategoryColor(cat) } : {}}
                        >
                            {cat === 'All' ? '🏷️ Tüm Kategoriler' : `${getCategoryIcon(cat)} ${cat}`}
                        </button>
                    ))}
                </div>

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
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect fill="%236366f1" width="60" height="40"/><text x="30" y="25" text-anchor="middle" fill="white" font-size="16">📄</text></svg>';
                                        }}
                                    />
                                </td>
                                <td>
                                    <div>
                                        <strong>{ws.title}</strong>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ws.description}</div>
                                    </div>
                                </td>
                                <td>
                                    <span
                                        className="badge"
                                        style={{
                                            background: `${getCategoryColor(ws.category)}15`,
                                            color: getCategoryColor(ws.category)
                                        }}
                                    >
                                        {getCategoryIcon(ws.category)} {ws.category}
                                    </span>
                                </td>
                                <td>{ws.grade}. Sınıf</td>
                                <td>
                                    <a
                                        href={ws.externalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            color: '#6366f1',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        {ws.source} <ExternalLink size={12} />
                                    </a>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="edit-btn" onClick={() => openEditModal(ws)}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(ws.id)}>
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
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingWorksheet ? 'Düzenle' : 'Yeni Çalışma Kağıdı Ekle'}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
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
                                            <option key={cat} value={cat}>{getCategoryIcon(cat)} {cat}</option>
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
                                    <label>Harici URL (Kaynak Linki)</label>
                                    <input
                                        type="url"
                                        value={formData.externalUrl}
                                        onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                                        placeholder="https://..."
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
                                <button type="submit" className="save-btn">
                                    {editingWorksheet ? 'Güncelle' : 'Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorksheetsManager;
