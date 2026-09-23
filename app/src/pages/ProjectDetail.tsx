import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useApp } from '../store';
import { api, fileUrl, formatDate, type Project, type RecordItem } from '../api';
import { TopBar, Header, Tabs } from '../components/Shell';
import { Icon } from '../components/Icon';
import { RecordToolbar } from '../components/RecordParts';
import { QuickView } from '../components/QuickView';

type Tab = 'overview' | 'feedback' | 'notes';

function SessionCard({ label, records, onOpen, onSeeAll }: { label: string; records: RecordItem[]; onOpen: (r: RecordItem) => void; onSeeAll: () => void }) {
  return (
    <div className="session-card">
      <div className="session-head"><b>{records.length}</b><span>{label}</span></div>
      {records.length === 0 && <div className="session-empty">No {label.toLowerCase()} linked yet.</div>}
      {records.slice(0, 5).map((r) => (
        <div key={r.id} className="session-row" role="button" tabIndex={0} onClick={() => onOpen(r)} onKeyDown={(e) => { if (e.key === 'Enter') onOpen(r); }}>
          <div className="session-title">
            <Icon name="left-indent-image" size={11.4} />
            <span>{r.title}</span>
          </div>
          <div className="session-date">
            <Icon name="icon-time" size={14} />
            <span className="trim">{formatDate(r.createdAt)}</span>
          </div>
        </div>
      ))}
      {records.length > 0 && <button type="button" className="see-all" onClick={onSeeAll}>See all</button>}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const { openProjectModal, reloadProjects, projectModal } = useApp();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const tab = (search.get('tab') as Tab) || 'overview';

  const load = useCallback(() => {
    api.get<Project>(`/api/projects/${id}`)
      .then((p) => { setProject(p); setNotes(p.notes); })
      .catch((e) => setError(e.message));
  }, [id]);
  useEffect(() => { load(); }, [load]);
  // Refresh after the edit modal closes.
  useEffect(() => { if (!projectModal) load(); }, [projectModal, load]);

  if (error) {
    return (
      <main className="main">
        <div className="page stack-36">
          <TopBar back={{ label: 'Back to projects', onClick: () => navigate('/projects') }} />
          <div className="empty"><div className="output-status">Project unavailable</div><p>{error}</p></div>
        </div>
      </main>
    );
  }
  if (!project) return <main className="main"><div className="page"><TopBar /></div></main>;

  const records = project.records || [];
  const feedback = records.filter((r) => r.kind === 'feedback');
  const comparisons = records.filter((r) => r.kind === 'compare');
  const setTab = (t: Tab) => setSearch(t === 'overview' ? {} : { tab: t }, { replace: true });

  const toggleFavourite = async () => {
    await api.patch(`/api/projects/${project.id}`, { favourite: !project.favourite });
    reloadProjects();
    load();
  };
  const remove = async () => {
    if (!window.confirm(`Delete the project “${project.title}”? Linked feedback and comparisons stay in their libraries.`)) return;
    await api.del(`/api/projects/${project.id}`);
    reloadProjects();
    navigate('/projects', { replace: true });
  };
  const saveNotes = async () => {
    await api.patch(`/api/projects/${project.id}`, { notes });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 1600);
    load();
  };

  return (
    <main className="main">
      <div className="page stack-36">
        <TopBar back={{ label: 'Back to projects', onClick: () => navigate('/projects') }} />
        <Header
          breadcrumb="Director / Projects"
          title={project.title}
          subtitle={tab === 'feedback' && project.description ? project.description : undefined}
          top
          tools={
            <RecordToolbar
              favourite={project.favourite}
              onEdit={() => openProjectModal(project)}
              onFavourite={toggleFavourite}
              onDelete={remove}
            />
          }
        />
        <div className="page" style={{ gap: 28 }}>
          <Tabs<Tab>
            tabs={[{ id: 'overview', label: 'Overview' }, { id: 'feedback', label: 'Feedback' }, { id: 'notes', label: 'Notes' }]}
            value={tab}
            onChange={setTab}
          />
          {tab === 'overview' && (
            <div className="page" style={{ gap: 28 }}>
              <div className="summary">
                <h2 className="h5 medium">Project Summary</h2>
                <p className="subtitle">{project.description || 'No summary yet. Edit the project to add a description.'}</p>
              </div>
              <div className="page" style={{ gap: 20 }}>
                <h2 className="h5 medium">Latest Activity</h2>
                <div className="sessions">
                  <SessionCard label="Feedback Sessions" records={feedback} onOpen={setSelected} onSeeAll={() => setTab('feedback')} />
                  <SessionCard label="Compare Sessions" records={comparisons} onOpen={setSelected} onSeeAll={() => setTab('feedback')} />
                </div>
              </div>
            </div>
          )}
          {tab === 'feedback' && (
            records.length === 0 ? (
              <div className="empty">
                <div className="output-status">No feedback yet</div>
                <p>Link feedback or comparisons to this project from Director using Project Link.</p>
              </div>
            ) : (
              <div className="grid-thumbs">
                {records.map((r) => {
                  const cover = r.kind === 'compare' ? r.sources[(r.recommendations[0]?.source || 1) - 1] || r.sources[0] : r.sources[0];
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className={`grid-thumb${selected?.id === r.id ? ' active' : ''}`}
                      title={r.title}
                      onClick={() => setSelected(r)}
                    >
                      {cover && <img src={fileUrl(cover)} alt={r.title} loading="lazy" />}
                      <span className="veil"><Icon name="view" size={19} /></span>
                    </button>
                  );
                })}
              </div>
            )
          )}
          {tab === 'notes' && (
            <div className="page" style={{ gap: 20, maxWidth: 776 }}>
              <textarea
                className="textarea p32"
                rows={14}
                value={notes}
                placeholder="Notes for this project…"
                onChange={(e) => setNotes(e.target.value)}
                aria-label="Project notes"
              />
              <div>
                <button type="button" className="btn" style={{ minWidth: 140 }} onClick={saveNotes} disabled={notes === project.notes}>
                  {notesSaved ? 'Saved' : 'Save notes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {selected && (
        <QuickView
          record={selected}
          onClose={() => setSelected(null)}
          onOpen={() => navigate(`/projects/${project.id}/records/${selected.id}`)}
        />
      )}
    </main>
  );
}
