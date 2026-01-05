import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Search, Video, Play } from 'lucide-react';
import { Video as VideoType, gradeInfo } from '../../data/videosData';
import { videoStore } from '../../data/videoStore';
import toast from 'react-hot-toast';

function VideosManager() {
    const [videos, setVideos] = useState<VideoType[]>(() => videoStore.getVideos());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
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

    // Subscribe to store changes
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
        const matchesType = selectedType === 'all' || video.type === selectedType;
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

    const openEditModal = (video: VideoType) => {
        setEditingVideo(video);
        setFormData({
            id: video.id,
            title: video.title,
            description: video.description,
            grade: video.grade,
            type: video.type,
            duration: video.duration,
            isPopular: video.isPopular || false
        });
        setIsModalOpen(true);
    };

    const extractYouTubeId = (url: string): string => {
        // Handle various YouTube URL formats
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const videoId = extractYouTubeId(formData.id);

        if (editingVideo) {
            // Update existing video via store
            videoStore.updateVideo(editingVideo.id, {
                id: videoId,
                title: formData.title,
                description: formData.description,
                thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                grade: formData.grade,
                type: formData.type,
                duration: formData.duration,
                isPopular: formData.isPopular
            });
            setVideos(videoStore.getVideos());
            toast.success('Video güncellendi ve siteye kaydedildi!');
        } else {
            // Add new video via store
            const newVideo: VideoType = {
                id: videoId,
                title: formData.title,
                description: formData.description,
                thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                grade: formData.grade,
                type: formData.type,
                duration: formData.duration,
                isPopular: formData.isPopular
            };
            videoStore.addVideo(newVideo);
            setVideos(videoStore.getVideos());
            toast.success('Yeni video eklendi ve siteye kaydedildi! 🎉');
        }

        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Bu videoyu silmek istediğinize emin misiniz?')) {
            videoStore.deleteVideo(id);
            setVideos(videoStore.getVideos());
            toast.success('Video silindi!');
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'song': return '🎵';
            case 'lesson': return '📚';
            case 'story': return '❤️';
            default: return '🎬';
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1><Video size={28} /> Video Yönetimi</h1>
                <p>YouTube videolarını ekleyin ve yönetin</p>
            </div>

            <div className="data-table-container">
                <div className="table-header">
                    <h2>{filteredVideos.length} Video</h2>
                    <div className="table-actions">
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Video ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                                style={{ paddingLeft: '40px' }}
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
                            {grade === 'all' ? '🎯 Tümü' : `${gradeInfo[grade]?.emoji || '📚'} ${grade}`}
                        </button>
                    ))}
                    <span style={{ margin: '0 0.5rem', color: '#cbd5e1' }}>|</span>
                    {types.map(type => (
                        <button
                            key={type}
                            className={`filter-chip ${selectedType === type ? 'active' : ''}`}
                            onClick={() => setSelectedType(type)}
                        >
                            {type === 'all' ? '📺 Tüm Türler' : `${getTypeIcon(type)} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
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
                                        style={{ position: 'relative', cursor: 'pointer' }}
                                        onClick={() => setPreviewVideo(video.id)}
                                    >
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="table-thumbnail"
                                        />
                                        <Play size={16} style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            color: 'white',
                                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                                        }} />
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <strong>{video.title}</strong>
                                        {video.isPopular && <span style={{ marginLeft: '8px', color: '#fbbf24' }}>⭐</span>}
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{video.description}</div>
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
                                        {gradeInfo[video.grade]?.emoji} {video.grade}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge badge-intermediate">
                                        {getTypeIcon(video.type)} {video.type}
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
                        <Video size={48} style={{ opacity: 0.3 }} />
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
                                    <input
                                        type="text"
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        placeholder="XqZsoesa55w veya https://youtube.com/watch?v=..."
                                        required
                                    />
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
                                        <option value="song">🎵 Şarkı</option>
                                        <option value="lesson">📚 Ders</option>
                                        <option value="story">❤️ Hikaye</option>
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
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.isPopular}
                                            onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                            style={{ width: 'auto' }}
                                        />
                                        ⭐ Popüler Video Olarak İşaretle
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
                        className="modal"
                        onClick={e => e.stopPropagation()}
                        style={{ maxWidth: '800px' }}
                    >
                        <div className="modal-header">
                            <h3>Video Önizleme</h3>
                            <button className="modal-close" onClick={() => setPreviewVideo(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div style={{ padding: 0 }}>
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
