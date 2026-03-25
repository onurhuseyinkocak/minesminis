import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Search, Video as VideoIcon, Play, RefreshCw } from 'lucide-react';
import { gradeInfo } from '../../data/videosData';
import { videoStore, type Video } from '../../data/videoStore';
import { adminFetch, getAdminApiBase } from '../../utils/adminApi';
import toast from 'react-hot-toast';
import './VideosManager.css';

function VideosManager() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<Video | null>(null);
    const [previewVideo, setPreviewVideo] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        grade: '2nd Grade',
        type: 'song' as 'song' | 'lesson' | 'story',
        duration: '',
        isPopular: false
    });

    useEffect(() => {
        videoStore.fetchVideos().then(() => setVideos(videoStore.getVideos()));
    }, []);
    useEffect(() => {
        const unsubscribe = videoStore.subscribe((updatedVideos) => {
            setVideos(updatedVideos);
        });
        return unsubscribe;
    }, []);

    const grades = ['all', '2nd Grade', '3rd Grade', '4th Grade'];
    const types = ['all', 'song', 'lesson', 'story'];

    const filteredVideos = videos.filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrade = selectedGrade === 'all' || video.grade === selectedGrade;
        const matchesType = selectedType === 'all' || video.category === selectedType;
        return matchesSearch && matchesGrade && matchesType;
    });

    const openAddModal = () => {
        setEditingVideo(null);
        setFormData({
            id: '',
            title: '',
            description: '',
            grade: '2nd Grade',
            type: 'song',
            duration: '',
            isPopular: false
        });
        setIsModalOpen(true);
    };

    const openEditModal = (video: Video) => {
        setEditingVideo(video);
        setFormData({
            id: video.youtube_id,
            title: video.title,
            description: video.description,
            grade: video.grade,
            type: (video.category || 'song') as 'song' | 'lesson' | 'story',
            duration: video.duration,
            isPopular: video.isPopular || false
        });
        setIsModalOpen(true);
    };

    const extractYouTubeId = (url: string): string => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^([a-zA-Z0-9_-]{11})$/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return url;
    };

    const [fetchingMeta, setFetchingMeta] = useState(false);
    const fetchYouTubeMeta = async () => {
        const raw = formData.id.trim();
        if (!raw) {
            toast.error('Önce URL veya video ID girin');
            return;
        }
        setFetchingMeta(true);
        try {
            const res = await fetch(`${getAdminApiBase()}/api/youtube/metadata?url=${encodeURIComponent(raw)}`);
            const json = await res.json().catch(() => ({}));
            if (json.videoId) {
                setFormData(f => ({
                    ...f,
                    id: json.videoId,
                    title: json.title || f.title,
                    description: json.description || f.description,
                    duration: json.duration || f.duration
                }));
                toast.success('Başlık, açıklama ve süre otomatik dolduruldu');
            } else toast.error(json.error || 'Bilgiler alınamadı');
        } catch {
            toast.error('Video bilgileri alınamadı. Başlık ve süreyi manuel girebilirsiniz.');
        } finally {
            setFetchingMeta(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const videoId = extractYouTubeId(formData.id);
        const thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        const payload = {
            youtube_id: videoId,
            title: formData.title,
            description: formData.description,
            thumbnail,
            grade: formData.grade,
            category: formData.type,
            duration: formData.duration,
            isPopular: formData.isPopular
        };
        try {
            if (editingVideo) {
                const res = await adminFetch(`/api/admin/videos/${editingVideo.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(payload)
                });
                const json = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json.error || 'Güncelleme başarısız');
                await videoStore.fetchVideos();
                setVideos(videoStore.getVideos());
                toast.success('Video güncellendi!');
            } else {
                const res = await adminFetch('/api/admin/videos', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                const json = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(json.error || 'Kayıt başarısız');
                await videoStore.fetchVideos();
                setVideos(videoStore.getVideos());
                toast.success('Yeni video eklendi!');
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Kayıt başarısız');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu videoyu silmek istediğinize emin misiniz?')) return;
        try {
            const res = await adminFetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.error || 'Silinemedi');
            await videoStore.fetchVideos();
            setVideos(videoStore.getVideos());
            toast.success('Video silindi!');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Silinemedi');
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1><VideoIcon size={28} /> Video Yönetimi</h1>
                <p>YouTube videolarını ekleyin ve yönetin</p>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h2>{filteredVideos.length} Video</h2>
                    <div className="table-actions">
                        <div className="adm-search-wrap">
                            <Search size={18} className="adm-search-icon" />
                            <input
                                type="text"
                                placeholder="Video ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input adm-search-input"
                            />
                        </div>
                        <button className="add-btn" onClick={openAddModal}>
                            <Plus size={18} />
                            Video Ekle
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
                            {grade === 'all' ? 'Tümü' : grade}
                        </button>
                    ))}
                    <span className="adm-filter-sep">|</span>
                    {types.map(type => (
                        <button
                            key={type}
                            className={`filter-chip ${selectedType === type ? 'active' : ''}`}
                            onClick={() => setSelectedType(type)}
                        >
                            {type === 'all' ? 'Tüm Türler' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Görsel</th>
                            <th>Başlık</th>
                            <th>Sınıf</th>
                            <th>Tür</th>
                            <th>Süre</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVideos.map(video => (
                            <tr key={video.id}>
                                <td>
                                    <div
                                        className="adm-thumb-wrap"
                                        onClick={() => setPreviewVideo(video.youtube_id)}
                                    >
                                        <img
                                            src={video.thumbnail?.startsWith('http') ? video.thumbnail : `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                                            alt={video.title}
                                            className="table-thumbnail"
                                        />
                                        <Play size={16} className="adm-thumb-play" />
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <strong>{video.title}</strong>
                                        {video.isPopular && <span className="adm-badge-popular">POPÜLER</span>}
                                        <div className="adm-video-desc">{video.description}</div>
                                    </div>
                                </td>
                                <td>
                                    <span
                                        className="badge"
                                        style={{
                                            background: `${gradeInfo[video.grade]?.color}15`,
                                            color: gradeInfo[video.grade]?.color
                                        }}
                                    >
                                        {video.grade}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge badge-intermediate">
                                        {video.category}
                                    </span>
                                </td>
                                <td>{video.duration}</td>
                                <td>
                                    <div className="action-btns">
                                        <button className="edit-btn" onClick={() => openEditModal(video)}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(video.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredVideos.length === 0 && (
                    <div className="no-data">
                        <VideoIcon size={48} style={{ opacity: 0.3 }} />
                        <p>Video bulunamadı</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingVideo ? 'Videoyu Düzenle' : 'Yeni Video Ekle'}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>YouTube Video ID veya URL</label>
                                    <div className="adm-fetch-row">
                                        <input
                                            type="text"
                                            value={formData.id}
                                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                            placeholder="XqZsoesa55w veya https://youtube.com/watch?v=..."
                                            required
                                        />
                                        <button type="button" className="cancel-btn" onClick={fetchYouTubeMeta} disabled={fetchingMeta} style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Otomatik çek">
                                            <RefreshCw size={16} className={fetchingMeta ? 'spin' : ''} />
                                            {fetchingMeta ? '...' : 'Otomatik Çek'}
                                        </button>
                                    </div>
                                    <small className="adm-fetch-hint">URL yapıştırıp "Otomatik Çek" ile başlık, açıklama ve süre gelir</small>
                                </div>

                                <div className="form-group">
                                    <label>Video Başlığı</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Örn: Baby Shark Dance"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Açıklama</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Video hakkında kısa açıklama..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Sınıf</label>
                                    <select
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                    >
                                        <option value="2nd Grade">2. Sınıf</option>
                                        <option value="3rd Grade">3. Sınıf</option>
                                        <option value="4th Grade">4. Sınıf</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Video Türü</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'song' | 'lesson' | 'story' })}
                                    >
                                        <option value="song">Şarkı</option>
                                        <option value="lesson">Ders</option>
                                        <option value="story">Hikaye</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Süre</label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        placeholder="Örn: 2:30"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="adm-check-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.isPopular}
                                            onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                            style={{ width: 'auto' }}
                                        />
                                        Popüler Video Olarak İşaretle
                                    </label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                                    İptal
                                </button>
                                <button type="submit" className="save-btn">
                                    {editingVideo ? 'Güncelle' : 'Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Video Preview Modal */}
            {previewVideo && (
                <div className="modal-overlay" onClick={() => setPreviewVideo(null)}>
                    <div
                        className="modal adm-modal-wide"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>Video Önizleme</h3>
                            <button className="modal-close" onClick={() => setPreviewVideo(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="adm-iframe-wrap">
                            <iframe
                                src={`https://www.youtube.com/embed/${previewVideo}`}
                                width="100%"
                                height="400"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ display: 'block' }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideosManager;
