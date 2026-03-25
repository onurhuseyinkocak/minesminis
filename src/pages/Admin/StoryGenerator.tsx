/**
 * ADMIN STORY GENERATOR
 * Form to configure and trigger AI story generation.
 * Preview, publish, and manage all generated stories.
 */

import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, CheckCircle, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';
import './StoryGenerator.css';

// ─── Types ────────────────────────────────────────────────────────────────────

const THEMES = [
  { value: 'adventure', label: 'Adventure / Macera' },
  { value: 'friendship', label: 'Friendship / Arkadaşlık' },
  { value: 'nature', label: 'Nature / Doğa' },
  { value: 'space', label: 'Space / Uzay' },
  { value: 'ocean', label: 'Ocean / Okyanus' },
  { value: 'forest', label: 'Forest / Orman' },
  { value: 'magic', label: 'Magic / Sihir' },
  { value: 'family', label: 'Family / Aile' },
];

const LOCATIONS = [
  { value: 'enchanted_forest', label: 'Enchanted Forest' },
  { value: 'ocean_depths', label: 'Ocean Depths' },
  { value: 'outer_space', label: 'Outer Space' },
  { value: 'snowy_mountain', label: 'Snowy Mountain' },
  { value: 'magical_village', label: 'Magical Village' },
  { value: 'desert_oasis', label: 'Desert Oasis' },
  { value: 'underwater_castle', label: 'Underwater Castle' },
];

const CHARACTERS = [
  { value: 'mimi_dragon', label: 'Mimi (Dragon)' },
  { value: 'luna_owl', label: 'Luna (Owl)' },
  { value: 'rocky_bear', label: 'Rocky (Bear)' },
  { value: 'stella_fox', label: 'Stella (Fox)' },
  { value: 'pip_bunny', label: 'Pip (Bunny)' },
  { value: 'finn_turtle', label: 'Finn (Turtle)' },
];

interface GeneratedScene {
  id: string;
  text: string;
  text_tr?: string;
  location?: string;
  characters?: Array<{ name: string; emoji?: string }>;
  choices?: Array<{ id: string; text: string; text_tr?: string; next_scene_id: string }>;
  vocabulary?: Array<{ word: string; word_tr?: string; emoji?: string }>;
  sound_effect?: string;
  animation_cue?: string;
}

interface GeneratedStory {
  id?: string;
  title: string;
  title_tr: string;
  summary: string;
  summary_tr: string;
  cover_scene: string;
  target_age: number[];
  scenes: GeneratedScene[];
  published?: boolean;
  created_at?: string;
}

interface StoredStory {
  id: string;
  title: string;
  title_tr: string;
  summary: string;
  target_age: number[];
  published: boolean;
  created_at: string;
  scene_count?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function StoryGenerator() {
  // Form state
  const [theme, setTheme] = useState('adventure');
  const [location, setLocation] = useState('enchanted_forest');
  const [selectedChars, setSelectedChars] = useState<string[]>(['mimi_dragon']);
  const [ageMin, setAgeMin] = useState(4);
  const [ageMax, setAgeMax] = useState(8);

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStep, setGenStep] = useState('');
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);
  const [genError, setGenError] = useState('');

  // Publish state
  const [publishing, setPublishing] = useState(false);

  // Stories list
  const [stories, setStories] = useState<StoredStory[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    fetchStoriesList();
  }, []);

  const fetchStoriesList = async () => {
    setLoadingList(true);
    try {
      const res = await adminFetch('/api/admin/stories');
      if (res.ok) {
        const d = await res.json();
        setStories(d.stories || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingList(false);
    }
  };

  const toggleChar = (val: string) => {
    setSelectedChars(prev =>
      prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
    );
  };

  const handleGenerate = async () => {
    if (generating) return;
    setGenerating(true);
    setGenError('');
    setGeneratedStory(null);
    setGenProgress(10);
    setGenStep('Connecting to AI...');

    try {
      setGenProgress(25);
      setGenStep('Generating story structure...');

      const res = await adminFetch('/api/admin/stories/generate', {
        method: 'POST',
        body: JSON.stringify({
          theme,
          location,
          characters: selectedChars,
          target_age: [ageMin, ageMax],
        }),
      });

      setGenProgress(75);
      setGenStep('Processing scenes...');

      const data = await res.json();

      if (!res.ok || !data.story) {
        throw new Error(data.error || 'Generation failed');
      }

      setGenProgress(100);
      setGenStep('Done!');
      setGeneratedStory(data.story);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setGenError(msg);
      setGenProgress(0);
      setGenStep('');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedStory || publishing) return;
    setPublishing(true);
    try {
      const res = await adminFetch('/api/admin/stories', {
        method: 'POST',
        body: JSON.stringify({ ...generatedStory, published: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Publish failed');
      setGeneratedStory(null);
      await fetchStoriesList();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Publish failed');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (storyId: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await adminFetch(`/api/admin/stories/${storyId}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Delete failed');
      }
      await fetchStoriesList();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleTogglePublish = async (story: StoredStory) => {
    try {
      const res = await adminFetch(`/api/admin/stories/${story.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ published: !story.published }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Update failed');
      }
      await fetchStoriesList();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Update failed');
    }
  };

  return (
    <div className="admin-page story-gen-page">
      {/* Header */}
      <div className="story-gen-header">
        <div>
          <h1><BookOpen size={26} /> Story Generator</h1>
          <p>AI-powered story generation for MinesMinis children.</p>
        </div>
      </div>

      {/* Main layout */}
      <div className="story-gen-layout">
        {/* ── Form Panel ── */}
        <div className="story-gen-form-panel">
          <h2>Configure Story</h2>

          {/* Theme */}
          <div className="story-gen-field">
            <label>Theme</label>
            <select value={theme} onChange={e => setTheme(e.target.value)}>
              {THEMES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="story-gen-field">
            <label>Location</label>
            <select value={location} onChange={e => setLocation(e.target.value)}>
              {LOCATIONS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Characters */}
          <div className="story-gen-field">
            <label>Characters (select one or more)</label>
            <div className="story-gen-chars">
              {CHARACTERS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  className={`story-gen-char-chip${selectedChars.includes(c.value) ? ' selected' : ''}`}
                  onClick={() => toggleChar(c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target age */}
          <div className="story-gen-field">
            <label>Target Age Range</label>
            <div className="story-gen-age-row">
              <input
                type="number"
                min={2}
                max={12}
                value={ageMin}
                onChange={e => setAgeMin(Number(e.target.value))}
              />
              <span>to</span>
              <input
                type="number"
                min={2}
                max={12}
                value={ageMax}
                onChange={e => setAgeMax(Number(e.target.value))}
              />
              <span>yrs</span>
            </div>
          </div>

          {/* Progress */}
          {generating && (
            <div className="story-gen-progress">
              <div className="story-gen-progress-bar">
                <div className="story-gen-progress-fill" style={{ width: `${genProgress}%` }} />
              </div>
              <span className="story-gen-progress-label">{genStep}</span>
            </div>
          )}

          {/* Error */}
          {genError && (
            <p className="story-gen-error">
              {genError}
            </p>
          )}

          {/* Generate button */}
          <button
            className="story-gen-btn"
            onClick={handleGenerate}
            disabled={generating || selectedChars.length === 0}
          >
            {generating ? (
              <>
                <Loader2 size={18} className="spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Generate Story
              </>
            )}
          </button>
        </div>

        {/* ── Preview Panel ── */}
        {generatedStory && (
          <div className="story-gen-preview">
            <div className="story-gen-preview-header">
              <h3>{generatedStory.title}</h3>
              <div className="story-gen-preview-badges">
                <span className="story-gen-badge story-gen-badge--age">
                  Age {generatedStory.target_age[0]}–{generatedStory.target_age[1]}
                </span>
                <span className="story-gen-badge story-gen-badge--scenes">
                  {generatedStory.scenes?.length ?? 0} scenes
                </span>
              </div>
            </div>

            <p className="story-gen-preview-summary">{generatedStory.summary}</p>
            {generatedStory.title_tr && (
              <p className="story-gen-title-tr">
                <span className="story-gen-lang-badge">TR</span> {generatedStory.title_tr}
              </p>
            )}

            {/* Scenes list */}
            <div className="story-gen-preview-scenes">
              {generatedStory.scenes?.map((scene, i) => (
                <div key={scene.id ?? i} className="story-gen-scene-card">
                  <div className="story-gen-scene-num">Scene {i + 1}</div>
                  <p className="story-gen-scene-text">{scene.text}</p>
                  {scene.choices && scene.choices.length > 0 && (
                    <div className="story-gen-scene-choices">
                      {scene.choices.map((c, ci) => (
                        <span key={ci} className="story-gen-scene-choice">{c.text}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="story-gen-preview-actions">
              <button
                className="story-gen-publish-btn"
                onClick={handlePublish}
                disabled={publishing}
              >
                {publishing ? (
                  <><Loader2 size={16} className="spin" /> Publishing...</>
                ) : (
                  <><CheckCircle size={16} /> Publish Story</>
                )}
              </button>
              <button
                className="story-gen-discard-btn"
                onClick={() => setGeneratedStory(null)}
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Placeholder when no preview */}
        {!generatedStory && !generating && (
          <div className="story-gen-placeholder">
            <BookOpen size={40} className="story-gen-placeholder-icon" />
            <p className="story-gen-placeholder-text">
              Configure options and click "Generate Story" to preview a new AI-generated story.
            </p>
          </div>
        )}
      </div>

      {/* ── Stories List ── */}
      <div className="story-gen-list">
        <div className="story-gen-list-header">
          <h2>All Generated Stories</h2>
          <button
            type="button"
            className="story-gen-refresh-btn"
            onClick={fetchStoriesList}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loadingList ? (
          <div className="story-gen-list-empty">
            <Loader2 size={24} className="spin" style={{ marginBottom: '0.5rem' }} />
            <p>Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="story-gen-list-empty">
            <BookOpen size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <p>No stories generated yet. Use the form above to create your first story.</p>
          </div>
        ) : (
          stories.map(story => (
            <div key={story.id} className="story-gen-story-row">
              <div className="story-gen-story-info">
                <h4>{story.title}</h4>
                <div className="story-gen-story-meta">
                  <span>{new Date(story.created_at).toLocaleDateString('en-US')}</span>
                  {story.scene_count !== undefined && (
                    <span>{story.scene_count} scenes</span>
                  )}
                  <span>Age {story.target_age?.[0]}–{story.target_age?.[1]}</span>
                  {story.published ? (
                    <span className="story-gen-story-published">Published</span>
                  ) : (
                    <span className="story-gen-story-draft">Draft</span>
                  )}
                </div>
              </div>

              <div className="story-gen-story-actions">
                {/* Toggle publish */}
                <button
                  className="story-gen-action-btn"
                  title={story.published ? 'Unpublish' : 'Publish'}
                  onClick={() => handleTogglePublish(story)}
                >
                  <CheckCircle size={15} />
                </button>

                {/* View live */}
                <a
                  href={`/stories/${story.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="story-gen-action-btn"
                  title="View story"
                >
                  <ExternalLink size={15} />
                </a>

                {/* Delete */}
                <button
                  className="story-gen-action-btn danger"
                  title="Delete"
                  onClick={() => handleDelete(story.id, story.title)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
