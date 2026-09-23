import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../store';
import { api, type RecordItem } from '../api';
import { TopBar, Header } from '../components/Shell';
import { Icon } from '../components/Icon';

export default function CompareLibrary() {
  const navigate = useNavigate();
  const { reloadProjects } = useApp();
  const [records, setRecords] = useState<RecordItem[] | null>(null);
  const [error, setError] = useState('');
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const load = () => api.get<RecordItem[]>('/api/records?kind=compare').then(setRecords).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const rename = async (r: RecordItem) => {
    const title = draft.trim();
    setRenaming(null);
    if (!title || title === r.title) return;
    await api.patch(`/api/records/${r.id}`, { title });
    load();
  };

  const remove = async (r: RecordItem) => {
    if (!window.confirm(`Delete “${r.title}”? This cannot be undone.`)) return;
    await api.del(`/api/records/${r.id}`);
    reloadProjects();
    load();
  };

  return (
    <main className="main">
      <div className="page stack-36">
        <TopBar />
        <Header
          breadcrumb="Director / Compare"
          title="Compare Library"
          tools={<button type="button" className="btn w140" onClick={() => navigate('/director/compare')}>Add new</button>}
        />
        <p className="subtitle trim">Saved comparisons of photographs and designs.</p>
        {error && <div className="empty"><div className="output-status">Library unavailable</div><p>{error}</p></div>}
        {records && records.length === 0 && (
          <div className="empty">
            <div className="output-status">No comparisons yet</div>
            <p>Compare 2–6 sources in Director, then save the comparison to keep it here.</p>
          </div>
        )}
        {records && records.length > 0 && (
          <div className="list">
            {records.map((r) => (
              <div
                key={r.id}
                className="list-item"
                role="button"
                tabIndex={0}
                onClick={() => renaming !== r.id && navigate(`/compare/${r.id}`)}
                onKeyDown={(e) => { if (e.key === 'Enter' && renaming !== r.id) navigate(`/compare/${r.id}`); }}
              >
                {renaming === r.id ? (
                  <input
                    className="inline-input"
                    autoFocus
                    value={draft}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => rename(r)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter') rename(r);
                      if (e.key === 'Escape') setRenaming(null);
                    }}
                    aria-label="Comparison title"
                  />
                ) : (
                  <span className="list-item-title">{r.title}</span>
                )}
                <div className="list-item-tools" onClick={(e) => e.stopPropagation()}>
                  <button type="button" className="icon-btn" title="Rename" onClick={() => { setDraft(r.title); setRenaming(r.id); }}>
                    <Icon name="pencil" size={13} />
                  </button>
                  <button type="button" className="icon-btn" title="Delete" onClick={() => remove(r)}>
                    <Icon name="bin" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
