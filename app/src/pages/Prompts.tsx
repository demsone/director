import { useMemo, useState } from 'react';
import { useApp } from '../store';
import { api, type Prompt } from '../api';
import { TopBar, Header } from '../components/Shell';
import { Select } from '../components/Select';
import { Badge, categoryBadge, useTypeBadge } from '../components/Common';
import { Icon } from '../components/Icon';
import { Drawer } from '../components/QuickView';

export const CATEGORIES = ['Photography', 'Design Studio', 'Compare', 'General'];
export const USE_TYPES = ['Feedback', 'Compare'];

type Editing = { prompt: Prompt | null; seed?: Partial<Prompt> };

export default function Prompts() {
  const { prompts, reloadPrompts } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [showArchive, setShowArchive] = useState(false);
  const [editing, setEditing] = useState<Editing | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((p) =>
      (showArchive || !p.archived)
      && (category === 'all' || p.category === category)
      && (!q || [p.name, p.description, p.body, p.category, p.useType].some((v) => v.toLowerCase().includes(q))));
  }, [prompts, query, category, showArchive]);

  const duplicate = async (p: Prompt) => {
    const created = await api.post<Prompt>('/api/prompts', { ...p, name: `${p.name} (copy)`, archived: false });
    await reloadPrompts();
    setEditing({ prompt: created });
  };

  const toggleArchive = async (p: Prompt) => {
    await api.patch(`/api/prompts/${p.id}`, { archived: !p.archived });
    reloadPrompts();
  };

  return (
    <main className="main">
      <div className="page stack-36">
        <TopBar />
        <Header
          breadcrumb="Director / Prompts"
          title="Prompt Library"
          subtitle="Editable defaults for photography, design, comparison, and general feedback."
          tools={<button type="button" className="btn" onClick={() => setEditing({ prompt: null })}>Add prompt</button>}
        />
        <div className="page" style={{ gap: 16 }}>
          <div className="search-bar">
            <input className="input" type="search" placeholder="Search Prompts" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search prompts" />
            <Select
              value={category}
              size="h40"
              options={[{ value: 'all', label: 'All categories' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
              onChange={setCategory}
              ariaLabel="Category"
            />
            <label className="check">
              <input type="checkbox" checked={showArchive} onChange={(e) => setShowArchive(e.target.checked)} />
              <span className="trim">Show archive</span>
            </label>
          </div>
          {visible.length === 0 ? (
            <div className="empty">
              <div className="output-status">No prompts found</div>
              <p>{prompts.length ? 'Try another search or category.' : 'Add a prompt to begin.'}</p>
            </div>
          ) : (
            <div className="card-grid">
              {visible.map((p) => (
                <div key={p.id} className={`card toolbar-card${p.archived ? ' archived' : ''}`}>
                  <div className="card-head">
                    <h3 className="card-title" style={{ cursor: 'pointer' }} onClick={() => setEditing({ prompt: p })}>{p.name}</h3>
                  </div>
                  <p className="card-desc l2">{p.description || p.body}</p>
                  <div className="card-tools">
                    <Badge color={categoryBadge(p.category)}>{p.category === 'Design Studio' ? 'Design' : p.category}</Badge>
                    <Badge color={useTypeBadge(p.useType)}>{p.useType}</Badge>
                    <div className="actions">
                      <button type="button" className="tool-btn" title="Edit" onClick={() => setEditing({ prompt: p })}><Icon name="pencil" size={13} /></button>
                      <button type="button" className="tool-btn" title="Duplicate" onClick={() => duplicate(p)}><Icon name="copy" size={12} /></button>
                      <button type="button" className="tool-btn" title={p.archived ? 'Restore from archive' : 'Archive'} onClick={() => toggleArchive(p)}>
                        <Icon name={p.archived ? 'refresh' : 'bin'} size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {editing && <PromptEditor editing={editing} onClose={() => setEditing(null)} />}
    </main>
  );
}

function PromptEditor({ editing, onClose }: { editing: Editing; onClose: () => void }) {
  const { reloadPrompts } = useApp();
  const base = editing.prompt;
  const [form, setForm] = useState({
    name: base?.name || '',
    category: base?.category || 'Photography',
    useType: base?.useType || 'Feedback',
    description: base?.description || '',
    body: base?.body || '',
    systemNote: base?.systemNote || '',
    archived: base?.archived || false,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const save = async () => {
    if (!form.name.trim()) { setError('A prompt needs a name.'); return; }
    setSaving(true);
    try {
      if (base) await api.patch(`/api/prompts/${base.id}`, form);
      else await api.post('/api/prompts', form);
      await reloadPrompts();
      onClose();
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  };

  return (
    <Drawer onClose={onClose} labelledBy="pe-title">
      <div className="drawer-head" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2 id="pe-title" className="drawer-title h3">{base ? 'Edit Prompt' : 'New Prompt'}</h2>
        <button type="button" className="drawer-close" onClick={onClose} aria-label="Close" style={{ marginTop: 5 }}>
          <Icon name="button-close" size={19} />
        </button>
      </div>
      <div className="drawer-body">
        <label className="field-label-lg" htmlFor="pe-name">Name</label>
        <input id="pe-name" className="input h52" style={{ height: 'auto', padding: '13px 30px 13px 18px' }} value={form.name} onChange={(e) => { set({ name: e.target.value }); setError(''); }} autoFocus />
        <span className="field-label-lg">Category</span>
        <Select value={form.category} size="h52" primaryText options={CATEGORIES.map((c) => ({ value: c, label: c }))} onChange={(v) => set({ category: v })} ariaLabel="Category" />
        <span className="field-label-lg">Use Type</span>
        <Select value={form.useType} size="h52" primaryText options={USE_TYPES.map((c) => ({ value: c, label: c }))} onChange={(v) => set({ useType: v })} ariaLabel="Use type" />
        <label className="field-label-lg" htmlFor="pe-desc">Description</label>
        <input id="pe-desc" className="input" style={{ height: 'auto', padding: '13px 30px 13px 18px' }} value={form.description} onChange={(e) => set({ description: e.target.value })} />
        <label className="field-label-lg" htmlFor="pe-body">Prompt</label>
        <textarea id="pe-body" className="textarea p32 secondary" rows={12} value={form.body} onChange={(e) => set({ body: e.target.value })} />
        <label className="field-label-lg" htmlFor="pe-note">System Note (optional)</label>
        <textarea id="pe-note" className="textarea p32 secondary" rows={3} value={form.systemNote} onChange={(e) => set({ systemNote: e.target.value })} />
        {error && <div className="form-error">{error}</div>}
        <div className="drawer-row">
          <div className="buttons">
            <button type="button" className="btn cancel" onClick={onClose}>Cancel</button>
            <button type="button" className="btn" onClick={save} disabled={saving}>Save prompt</button>
          </div>
          <label className="check">
            <input type="checkbox" checked={form.archived} onChange={(e) => set({ archived: e.target.checked })} />
            <span className="trim">Archive</span>
          </label>
        </div>
      </div>
    </Drawer>
  );
}
