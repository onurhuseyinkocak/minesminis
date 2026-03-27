import { useState, useEffect } from 'react';
import {
    GraduationCap, BookOpen, Plus, Pencil, Trash2, X,
    ChevronUp, ChevronDown, Layers, Music, Gamepad2, Mic, Eye, ToggleLeft, ToggleRight
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';
import './AdminCurriculumManager.css';

// The 12 worlds from the curriculum
interface World {
    id: string;
    order: number;
    name: string;
    nameEn: string;
    emoji: string;
    color: string;
    description: string;
    ageRange: string;
    lessonCount: number;
}

interface Lesson {
    id: string;
    worldId: string;
    order: number;
    title: string;
    titleTr: string;
    objective: string;
    vocabularyWords: string[];
    activities: Activity[];
    duration: number; // minutes
    status: 'draft' | 'published';
}

interface Activity {
    id: string;
    type: 'song' | 'game' | 'flashcard' | 'story' | 'practice' | 'quiz';
    title: string;
    duration: number;
}

// Default worlds from brand doc
const DEFAULT_WORLDS: World[] = [
    { id: 'w1', order: 1, name: 'Hello World', nameEn: 'Hello World', emoji: '\u{1F44B}', color: 'var(--warning)', description: 'Greetings, introductions, basic pleasantries', ageRange: '1-3', lessonCount: 0 },
    { id: 'w2', order: 2, name: 'My Body', nameEn: 'My Body', emoji: '\u{1F9D2}', color: 'var(--error)', description: 'Body parts, senses, physical descriptions', ageRange: '2-4', lessonCount: 0 },
    { id: 'w3', order: 3, name: 'Colors & Shapes', nameEn: 'Colors & Shapes', emoji: '\u{1F308}', color: 'var(--accent-purple)', description: 'Colors, basic shapes, patterns', ageRange: '2-4', lessonCount: 0 },
    { id: 'w4', order: 4, name: 'Animals', nameEn: 'Animals', emoji: '\u{1F981}', color: 'var(--accent-emerald)', description: 'Farm, wild, pets, habitats', ageRange: '3-5', lessonCount: 0 },
    { id: 'w5', order: 5, name: 'My Family', nameEn: 'My Family', emoji: '\u{1F46A}', color: 'var(--accent-pink)', description: 'Family members, relationships', ageRange: '3-5', lessonCount: 0 },
    { id: 'w6', order: 6, name: 'Food & Drinks', nameEn: 'Food & Drinks', emoji: '\u{1F34E}', color: 'var(--accent-orange)', description: 'Fruits, vegetables, meals, preferences', ageRange: '4-6', lessonCount: 0 },
    { id: 'w7', order: 7, name: 'My Home', nameEn: 'My Home', emoji: '\u{1F3E0}', color: 'var(--accent-blue)', description: 'Rooms, furniture, household items', ageRange: '4-6', lessonCount: 0 },
    { id: 'w8', order: 8, name: 'Clothes', nameEn: 'Clothes', emoji: '\u{1F455}', color: 'var(--accent-teal)', description: 'Clothing, weather-related dressing', ageRange: '5-7', lessonCount: 0 },
    { id: 'w9', order: 9, name: 'Nature', nameEn: 'Nature', emoji: '\u{1F333}', color: 'var(--accent-green)', description: 'Weather, seasons, plants, environment', ageRange: '5-7', lessonCount: 0 },
    { id: 'w10', order: 10, name: 'School', nameEn: 'School', emoji: '\u{1F3EB}', color: 'var(--accent-indigo)', description: 'Classroom objects, subjects, school life', ageRange: '6-8', lessonCount: 0 },
    { id: 'w11', order: 11, name: 'City & Transport', nameEn: 'City & Transport', emoji: '\u{1F68C}', color: 'var(--accent-violet)', description: 'Vehicles, places, directions', ageRange: '7-9', lessonCount: 0 },
    { id: 'w12', order: 12, name: 'Adventures', nameEn: 'Adventures', emoji: '\u{1F30D}', color: 'var(--accent-fuchsia)', description: 'Travel, countries, cultures, advanced topics', ageRange: '8-10', lessonCount: 0 },
];

// Sample lessons for demo
const SAMPLE_LESSONS: Lesson[] = [
    {
        id: 'l1', worldId: 'w1', order: 1, title: 'Say Hello!', titleTr: 'Merhaba De!',
        objective: 'Learn basic greetings: hello, hi, goodbye, bye',
        vocabularyWords: ['hello', 'hi', 'goodbye', 'bye', 'good morning', 'good night'],
        activities: [
            { id: 'a1', type: 'song', title: 'Hello Song', duration: 3 },
            { id: 'a2', type: 'flashcard', title: 'Greeting Cards', duration: 5 },
            { id: 'a3', type: 'game', title: 'Match the Greeting', duration: 5 },
            { id: 'a4', type: 'practice', title: 'Say it with Mimi', duration: 3 },
        ],
        duration: 16, status: 'published'
    },
    {
        id: 'l2', worldId: 'w1', order: 2, title: 'What is Your Name?', titleTr: 'Senin Adin Ne?',
        objective: 'Learn to introduce yourself and ask names',
        vocabularyWords: ['name', 'my', 'your', 'I am', 'what', 'nice to meet you'],
        activities: [
            { id: 'a5', type: 'story', title: 'Mimi Meets a Friend', duration: 4 },
            { id: 'a6', type: 'flashcard', title: 'Name Words', duration: 4 },
            { id: 'a7', type: 'game', title: 'Name Tag Game', duration: 5 },
            { id: 'a8', type: 'quiz', title: 'Introduction Quiz', duration: 3 },
        ],
        duration: 16, status: 'published'
    },
    {
        id: 'l3', worldId: 'w1', order: 3, title: 'How Are You?', titleTr: 'Nasilsin?',
        objective: 'Express feelings and ask about wellbeing',
        vocabularyWords: ['how', 'are', 'fine', 'happy', 'sad', 'thank you'],
        activities: [
            { id: 'a9', type: 'song', title: 'Feelings Song', duration: 3 },
            { id: 'a10', type: 'flashcard', title: 'Emotion Cards', duration: 5 },
            { id: 'a11', type: 'game', title: 'Emoji Match', duration: 5 },
        ],
        duration: 13, status: 'draft'
    }
];

const activityIcon = (type: string) => {
    switch (type) {
        case 'song': return <Music size={12} />;
        case 'game': return <Gamepad2 size={12} />;
        case 'flashcard': return <Layers size={12} />;
        case 'story': return <BookOpen size={12} />;
        case 'practice': return <Mic size={12} />;
        case 'quiz': return <Eye size={12} />;
        default: return <Layers size={12} />;
    }
};

function AdminCurriculumManager() {
    const [worlds, setWorlds] = useState<World[]>(DEFAULT_WORLDS);
    const [lessons, setLessons] = useState<Lesson[]>(SAMPLE_LESSONS);
    const [selectedWorldId, setSelectedWorldId] = useState<string | null>('w1');
    const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Modal state
    const [isLessonModal, setIsLessonModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [lessonForm, setLessonForm] = useState({
        title: '', titleTr: '', objective: '', vocabularyWords: '', duration: 15, status: 'draft' as 'draft' | 'published'
    });

    const [isWorldModal, setIsWorldModal] = useState(false);
    const [editingWorld, setEditingWorld] = useState<World | null>(null);
    const [worldForm, setWorldForm] = useState({ name: '', nameEn: '', emoji: '', color: 'var(--warning)', description: '', ageRange: '3-5' });

    // Load from Supabase (if available)
    useEffect(() => {
        loadCurriculum();
    }, []);

    const loadCurriculum = async () => {
        setLoading(true);
        try {
            const { data: worldsData } = await supabase.from('curriculum_worlds').select('*').order('order');
            if (worldsData && worldsData.length > 0) {
                setWorlds(worldsData.map((w: Record<string, unknown>) => ({
                    id: String(w.id), order: Number(w.order), name: String(w.name),
                    nameEn: String(w.name_en || w.name), emoji: String(w.emoji || ''),
                    color: String(w.color || 'var(--accent-indigo)'), description: String(w.description || ''),
                    ageRange: String(w.age_range || ''), lessonCount: Number(w.lesson_count || 0)
                })));
            }

            const { data: lessonsData } = await supabase.from('curriculum_lessons').select('*').order('order');
            if (lessonsData && lessonsData.length > 0) {
                setLessons(lessonsData.map((l: Record<string, unknown>) => ({
                    id: String(l.id), worldId: String(l.world_id), order: Number(l.order),
                    title: String(l.title), titleTr: String(l.title_tr || ''),
                    objective: String(l.objective || ''),
                    vocabularyWords: (l.vocabulary_words as string[]) || [],
                    activities: (l.activities as Activity[]) || [],
                    duration: Number(l.duration || 15), status: String(l.status || 'draft') as 'draft' | 'published'
                })));
            }
        } catch {
            toast.error('Could not load from database, using default data');
        } finally {
            setLoading(false);
        }
    };

    const selectedWorld = worlds.find(w => w.id === selectedWorldId);
    const worldLessons = lessons
        .filter(l => l.worldId === selectedWorldId)
        .sort((a, b) => a.order - b.order);

    // Update world lesson counts
    const getWorldLessonCount = (worldId: string) => lessons.filter(l => l.worldId === worldId).length;

    // ---- World CRUD ----
    const openAddWorld = () => {
        setEditingWorld(null);
        setWorldForm({ name: '', nameEn: '', emoji: '', color: 'var(--warning)', description: '', ageRange: '3-5' });
        setIsWorldModal(true);
    };

    const openEditWorld = (world: World) => {
        setEditingWorld(world);
        setWorldForm({ name: world.name, nameEn: world.nameEn, emoji: world.emoji, color: world.color, description: world.description, ageRange: world.ageRange });
        setIsWorldModal(true);
    };

    const handleWorldSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!worldForm.name.trim()) { toast.error('World name is required'); return; }
        setSaving(true);
        try {
            if (editingWorld) {
                const { error } = await supabase.from('curriculum_worlds').update({
                    name: worldForm.name, name_en: worldForm.nameEn, emoji: worldForm.emoji,
                    color: worldForm.color, description: worldForm.description, age_range: worldForm.ageRange
                }).eq('id', editingWorld.id);
                if (error) toast.error('DB update failed, saved locally');
                setWorlds(prev => prev.map(w => w.id === editingWorld.id ? { ...w, ...worldForm } : w));
                toast.success('World updated');
            } else {
                const newWorld: World = {
                    id: `w${Date.now()}`, order: worlds.length + 1,
                    ...worldForm, lessonCount: 0
                };
                const { error } = await supabase.from('curriculum_worlds').insert({
                    id: newWorld.id, order: newWorld.order, name: worldForm.name,
                    name_en: worldForm.nameEn, emoji: worldForm.emoji, color: worldForm.color,
                    description: worldForm.description, age_range: worldForm.ageRange, lesson_count: 0
                });
                if (error) toast.error('DB insert failed, saved locally');
                setWorlds(prev => [...prev, newWorld]);
                toast.success('World added');
            }
            setIsWorldModal(false);
        } catch {
            toast.error('Failed to save world');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteWorld = async (worldId: string) => {
        const worldLessonCount = lessons.filter(l => l.worldId === worldId).length;
        const msg = worldLessonCount > 0
            ? `Delete this world and its ${worldLessonCount} lesson(s)?`
            : 'Delete this world?';
        if (!confirm(msg)) return;
        try {
            await supabase.from('curriculum_lessons').delete().eq('world_id', worldId);
            await supabase.from('curriculum_worlds').delete().eq('id', worldId);
            setLessons(prev => prev.filter(l => l.worldId !== worldId));
            setWorlds(prev => prev.filter(w => w.id !== worldId));
            if (selectedWorldId === worldId) setSelectedWorldId(null);
            toast.success('World deleted');
        } catch {
            toast.error('Failed to delete world');
        }
    };

    // ---- Lesson CRUD ----
    const openAddLesson = () => {
        if (!selectedWorldId) return;
        setEditingLesson(null);
        setLessonForm({ title: '', titleTr: '', objective: '', vocabularyWords: '', duration: 15, status: 'draft' });
        setIsLessonModal(true);
    };

    const openEditLesson = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setLessonForm({
            title: lesson.title, titleTr: lesson.titleTr, objective: lesson.objective,
            vocabularyWords: lesson.vocabularyWords.join(', '),
            duration: lesson.duration, status: lesson.status
        });
        setIsLessonModal(true);
    };

    const handleLessonSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lessonForm.title.trim()) { toast.error('Lesson title is required'); return; }
        setSaving(true);
        const vocabWords = lessonForm.vocabularyWords.split(',').map(w => w.trim()).filter(Boolean);
        try {
            if (editingLesson) {
                const { error } = await supabase.from('curriculum_lessons').update({
                    title: lessonForm.title, title_tr: lessonForm.titleTr,
                    objective: lessonForm.objective, vocabulary_words: vocabWords,
                    duration: lessonForm.duration, status: lessonForm.status
                }).eq('id', editingLesson.id);
                if (error) toast.error('DB update failed, saved locally');
                setLessons(prev => prev.map(l => l.id === editingLesson.id ? {
                    ...l, title: lessonForm.title, titleTr: lessonForm.titleTr,
                    objective: lessonForm.objective, vocabularyWords: vocabWords,
                    duration: lessonForm.duration, status: lessonForm.status
                } : l));
                toast.success('Lesson updated');
            } else {
                const newLesson: Lesson = {
                    id: `l${Date.now()}`, worldId: selectedWorldId!,
                    order: worldLessons.length + 1,
                    title: lessonForm.title, titleTr: lessonForm.titleTr,
                    objective: lessonForm.objective, vocabularyWords: vocabWords,
                    activities: [], duration: lessonForm.duration, status: lessonForm.status
                };
                const { error } = await supabase.from('curriculum_lessons').insert({
                    id: newLesson.id, world_id: newLesson.worldId, order: newLesson.order,
                    title: newLesson.title, title_tr: newLesson.titleTr,
                    objective: newLesson.objective, vocabulary_words: vocabWords,
                    activities: [], duration: newLesson.duration, status: newLesson.status
                });
                if (error) toast.error('DB insert failed, saved locally');
                setLessons(prev => [...prev, newLesson]);
                toast.success('Lesson added');
            }
            setIsLessonModal(false);
        } catch {
            toast.error('Failed to save lesson');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm('Delete this lesson?')) return;
        try {
            await supabase.from('curriculum_lessons').delete().eq('id', lessonId);
        } catch {
            toast.error('DB delete failed, removed locally');
        }
        setLessons(prev => prev.filter(l => l.id !== lessonId));
        if (expandedLessonId === lessonId) setExpandedLessonId(null);
        toast.success('Lesson deleted');
    };

    const moveLessonUp = (lesson: Lesson) => {
        setLessons(prev => {
            const wl = prev.filter(l => l.worldId === lesson.worldId).sort((a, b) => a.order - b.order);
            const idx = wl.findIndex(l => l.id === lesson.id);
            if (idx <= 0) return prev;
            const swapWith = wl[idx - 1];
            return prev.map(l => {
                if (l.id === lesson.id) return { ...l, order: swapWith.order };
                if (l.id === swapWith.id) return { ...l, order: lesson.order };
                return l;
            });
        });
    };

    const moveLessonDown = (lesson: Lesson) => {
        setLessons(prev => {
            const wl = prev.filter(l => l.worldId === lesson.worldId).sort((a, b) => a.order - b.order);
            const idx = wl.findIndex(l => l.id === lesson.id);
            if (idx < 0 || idx >= wl.length - 1) return prev;
            const swapWith = wl[idx + 1];
            return prev.map(l => {
                if (l.id === lesson.id) return { ...l, order: swapWith.order };
                if (l.id === swapWith.id) return { ...l, order: lesson.order };
                return l;
            });
        });
    };

    const toggleLessonStatus = async (lesson: Lesson) => {
        const newStatus = lesson.status === 'published' ? 'draft' : 'published';
        try {
            await supabase.from('curriculum_lessons').update({ status: newStatus }).eq('id', lesson.id);
        } catch {
            // local-only fallback
        }
        setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, status: newStatus } : l));
        toast.success(newStatus === 'published' ? 'Lesson published' : 'Lesson set to draft');
    };


    if (loading) {
        return (
            <div className="adm-loading">
                <div className="adm-spinner" />
                <p>Loading curriculum...</p>
            </div>
        );
    }

    return (
        <div className="adm-curriculum">
            <div className="adm-curriculum-header">
                <div>
                    <h1>Curriculum</h1>
                    <p>Manage the 12 worlds, their lessons, vocabulary, and activities</p>
                </div>
                <button type="button" className="adm-action-btn primary" onClick={openAddWorld}>
                    <Plus size={14} /> Add World
                </button>
            </div>

            {/* Layout: Worlds sidebar + Lessons panel */}
            <div className="adm-curriculum-layout">
                {/* Worlds List */}
                <div className="adm-worlds-list">
                    <div className="adm-worlds-list-header">
                        <span>{worlds.length} Worlds</span>
                    </div>
                    {worlds.sort((a, b) => a.order - b.order).map(world => (
                        <div
                            key={world.id}
                            className={`adm-world-item ${selectedWorldId === world.id ? 'active' : ''}`}
                            onClick={() => { setSelectedWorldId(world.id); setExpandedLessonId(null); }}
                        >
                            <div className="adm-world-item-color" style={{ background: world.color }} />
                            <div className="adm-world-item-info">
                                <div className="adm-world-item-name">
                                    <span className="adm-world-emoji">{world.emoji}</span>
                                    {world.name}
                                </div>
                                <div className="adm-world-item-count">
                                    {getWorldLessonCount(world.id)} lesson{getWorldLessonCount(world.id) !== 1 ? 's' : ''} &middot; Ages {world.ageRange}
                                </div>
                            </div>
                            <button
                                className="adm-icon-btn adm-world-edit-btn"
                                onClick={(e) => { e.stopPropagation(); openEditWorld(world); }}
                                title="Edit world"
                            >
                                <Pencil size={12} />
                            </button>
                            <button
                                className="adm-icon-btn danger adm-world-edit-btn"
                                onClick={(e) => { e.stopPropagation(); handleDeleteWorld(world.id); }}
                                title="Delete world"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Lessons Panel */}
                {selectedWorld ? (
                    <div className="adm-lessons-panel">
                        <div className="adm-lessons-header">
                            <div className="adm-lessons-title">
                                <span className="adm-lessons-title-emoji">{selectedWorld.emoji}</span>
                                {selectedWorld.name}
                                <span className="adm-lessons-title-desc">
                                    ({selectedWorld.description})
                                </span>
                            </div>
                            <button type="button" className="adm-action-btn primary" onClick={openAddLesson}>
                                <Plus size={14} /> Add Lesson
                            </button>
                        </div>

                        {worldLessons.length === 0 ? (
                            <div className="adm-curriculum-empty">
                                <GraduationCap size={40} />
                                <p>No lessons yet. Add the first lesson for {selectedWorld.name}.</p>
                            </div>
                        ) : (
                            <div className="adm-lessons-list">
                                {worldLessons.map((lesson, idx) => (
                                    <div key={lesson.id}>
                                        <div className="adm-lesson-row">
                                            <div className="adm-lesson-order">{idx + 1}</div>
                                            <div className="adm-lesson-info adm-lesson-info-clickable" onClick={() => setExpandedLessonId(expandedLessonId === lesson.id ? null : lesson.id)}>
                                                <div className="adm-lesson-name">
                                                    {lesson.title}
                                                    {lesson.status === 'draft' && (
                                                        <span className="adm-lesson-draft-badge">DRAFT</span>
                                                    )}
                                                </div>
                                                <div className="adm-lesson-details">
                                                    <span>{lesson.titleTr}</span>
                                                    <span>{lesson.activities.length} activities</span>
                                                    <span>{lesson.duration} min</span>
                                                    <span>{lesson.vocabularyWords.length} words</span>
                                                </div>
                                            </div>
                                            <div className="adm-lesson-actions">
                                                <button
                                                    className={`adm-icon-btn ${idx === 0 ? 'adm-move-btn-disabled' : 'adm-move-btn-active'}`}
                                                    onClick={() => moveLessonUp(lesson)}
                                                    disabled={idx === 0}
                                                    title="Move up"
                                                >
                                                    <ChevronUp size={14} />
                                                </button>
                                                <button
                                                    className={`adm-icon-btn ${idx === worldLessons.length - 1 ? 'adm-move-btn-disabled' : 'adm-move-btn-active'}`}
                                                    onClick={() => moveLessonDown(lesson)}
                                                    disabled={idx === worldLessons.length - 1}
                                                    title="Move down"
                                                >
                                                    <ChevronDown size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="adm-icon-btn"
                                                    onClick={() => toggleLessonStatus(lesson)}
                                                    title={lesson.status === 'published' ? 'Set to draft' : 'Publish'}
                                                >
                                                    {lesson.status === 'published' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                                </button>
                                                <button type="button" className="adm-icon-btn" onClick={() => openEditLesson(lesson)}><Pencil size={13} /></button>
                                                <button type="button" className="adm-icon-btn danger" onClick={() => handleDeleteLesson(lesson.id)}><Trash2 size={13} /></button>
                                            </div>
                                        </div>

                                        {/* Expanded Lesson Detail */}
                                        {expandedLessonId === lesson.id && (
                                            <>
                                                {lesson.activities.length > 0 && (
                                                    <div className="adm-activities-section">
                                                        <div className="adm-activities-title">Lesson Flow</div>
                                                        {lesson.activities.map((act, i) => (
                                                            <span key={act.id} className="adm-activity-chip">
                                                                {activityIcon(act.type)}
                                                                {i + 1}. {act.title} ({act.duration}m)
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {lesson.vocabularyWords.length > 0 && (
                                                    <div className="adm-vocab-grid">
                                                        {lesson.vocabularyWords.map(word => (
                                                            <span key={word} className="adm-vocab-chip">
                                                                {word}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {lesson.objective && (
                                                    <div className="adm-lesson-objective">
                                                        <strong>Objective:</strong> {lesson.objective}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="adm-curriculum-empty adm-curriculum-empty-panel">
                        <GraduationCap size={40} />
                        <p>Select a world to view its lessons</p>
                    </div>
                )}
            </div>

            {/* World Modal */}
            {isWorldModal && (
                <div className="adm-modal-overlay" onClick={() => setIsWorldModal(false)}>
                    <div className="adm-modal" onClick={e => e.stopPropagation()}>
                        <div className="adm-modal-header">
                            <h3>{editingWorld ? 'Edit World' : 'Add World'}</h3>
                            <button type="button" className="adm-icon-btn" onClick={() => setIsWorldModal(false)}><X size={16} /></button>
                        </div>
                        <form onSubmit={handleWorldSubmit}>
                            <div className="adm-modal-body">
                                <div className="adm-world-form-top">
                                    <div className="adm-form-group">
                                        <label>Emoji</label>
                                        <input type="text" value={worldForm.emoji} onChange={e => setWorldForm({ ...worldForm, emoji: e.target.value })} className="adm-emoji-input" />
                                    </div>
                                    <div className="adm-form-group">
                                        <label>World Name</label>
                                        <input type="text" value={worldForm.name} onChange={e => setWorldForm({ ...worldForm, name: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="adm-form-group">
                                    <label>English Name</label>
                                    <input type="text" value={worldForm.nameEn} onChange={e => setWorldForm({ ...worldForm, nameEn: e.target.value })} />
                                </div>
                                <div className="adm-form-group">
                                    <label>Description</label>
                                    <input type="text" value={worldForm.description} onChange={e => setWorldForm({ ...worldForm, description: e.target.value })} />
                                </div>
                                <div className="adm-world-form-bottom">
                                    <div className="adm-form-group">
                                        <label>Color (CSS variable or hex)</label>
                                        <input type="text" value={worldForm.color} onChange={e => setWorldForm({ ...worldForm, color: e.target.value })} placeholder="var(--accent-blue) or #3b82f6" />
                                    </div>
                                    <div className="adm-form-group">
                                        <label>Age Range</label>
                                        <input type="text" value={worldForm.ageRange} onChange={e => setWorldForm({ ...worldForm, ageRange: e.target.value })} placeholder="3-5" />
                                    </div>
                                </div>
                            </div>
                            <div className="adm-modal-footer">
                                <button type="button" className="adm-btn" onClick={() => setIsWorldModal(false)} disabled={saving}>Cancel</button>
                                <button type="submit" className="adm-btn primary" disabled={saving}>{saving ? 'Saving...' : editingWorld ? 'Update' : 'Add World'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lesson Modal */}
            {isLessonModal && (
                <div className="adm-modal-overlay" onClick={() => setIsLessonModal(false)}>
                    <div className="adm-modal adm-modal-lesson" onClick={e => e.stopPropagation()}>
                        <div className="adm-modal-header">
                            <h3>{editingLesson ? 'Edit Lesson' : 'Add Lesson'}</h3>
                            <button type="button" className="adm-icon-btn" onClick={() => setIsLessonModal(false)}><X size={16} /></button>
                        </div>
                        <form onSubmit={handleLessonSubmit}>
                            <div className="adm-modal-body">
                                <div className="adm-form-group">
                                    <label>Lesson Title (English)</label>
                                    <input type="text" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="e.g. Say Hello!" required />
                                </div>
                                <div className="adm-form-group">
                                    <label>Lesson Title (Turkish)</label>
                                    <input type="text" value={lessonForm.titleTr} onChange={e => setLessonForm({ ...lessonForm, titleTr: e.target.value })} placeholder="e.g. Merhaba De!" />
                                </div>
                                <div className="adm-form-group">
                                    <label>Learning Objective</label>
                                    <textarea value={lessonForm.objective} onChange={e => setLessonForm({ ...lessonForm, objective: e.target.value })} rows={2} placeholder="What will students learn?" />
                                </div>
                                <div className="adm-form-group">
                                    <label>Vocabulary Words (comma-separated)</label>
                                    <input type="text" value={lessonForm.vocabularyWords} onChange={e => setLessonForm({ ...lessonForm, vocabularyWords: e.target.value })} placeholder="hello, hi, goodbye, bye" />
                                    <small>Enter words separated by commas</small>
                                </div>
                                <div className="adm-lesson-form-bottom">
                                    <div className="adm-form-group">
                                        <label>Duration (minutes)</label>
                                        <input type="number" value={lessonForm.duration} onChange={e => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 15 })} min={1} max={60} />
                                    </div>
                                    <div className="adm-form-group">
                                        <label>Status</label>
                                        <select value={lessonForm.status} onChange={e => setLessonForm({ ...lessonForm, status: e.target.value as 'draft' | 'published' })}>
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="adm-modal-footer">
                                <button type="button" className="adm-btn" onClick={() => setIsLessonModal(false)} disabled={saving}>Cancel</button>
                                <button type="submit" className="adm-btn primary" disabled={saving}>{saving ? 'Saving...' : editingLesson ? 'Update' : 'Add Lesson'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCurriculumManager;
