import { useEffect, useRef, useState } from 'react';
import { useApp } from '../store';
import { api, type Project } from '../api';
import { Select } from './Select';

/** The one canonical project create/edit modal. */
export function ProjectModal() {
  const { projectModal, closeProjectModal, reloadProjects } = useApp();
  const existing = projectModal?.project || null;
  const [title, setTitle] = useState(existing?.title || '');
  const [type, setType] = useState(existing?.type || 'Photography');
  const [description, setDescription] = useState(existing?.description || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeProjectModal(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeProjectModal]);

  const save = async () => {
    if (!title.trim()) { setError('A project needs a title.'); return; }
    setSaving(true);
    try {
      const body = { title: title.trim(), type, description };
      const saved = existing
        ? await api.patch<Project>(`/api/projects/${existing.id}`, body)
        : await api.post<Project>('/api/projects', body);
      await reloadProjects();
      projectModal?.onSaved?.(saved);
      closeProjectModal();
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) closeProjectModal(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
        <h2 id="project-modal-title" className="modal-title">{existing ? 'Edit project' : 'New project'}</h2>
        <div className="modal-fields">
          <div className="modal-field">
            <label className="form-label regular trim" htmlFor="pm-title">Project title</label>
            <input
              id="pm-title"
              ref={titleRef}
              className="input"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
            />
          </div>
          <div className="modal-field">
            <span className="form-label regular trim">Type</span>
            <Select
              value={type}
              size="h40"
              primaryText
              options={['Photography', 'Design', 'Mixed'].map((t) => ({ value: t, label: t }))}
              onChange={setType}
              ariaLabel="Project type"
            />
          </div>
          <div className="modal-field">
            <label className="form-label regular trim" htmlFor="pm-desc">Description</label>
            <textarea id="pm-desc" className="textarea" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={closeProjectModal}>Cancel</button>
            <button type="button" className="btn" onClick={save} disabled={saving}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
