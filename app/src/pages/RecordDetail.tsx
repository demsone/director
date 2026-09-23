import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBlocker, useNavigate, useParams } from 'react-router';
import { useApp } from '../store';
import { api, fileUrl, formatDate, type ChatMessage, type RecordItem } from '../api';
import { TopBar, Header } from '../components/Shell';
import { Badge, DateRow, OutputBox, ProjectSelect, SectionTitle, sourceTypeBadge } from '../components/Common';
import { AskDirector } from '../components/AskDirector';
import { EditableTitle, RecordToolbar } from '../components/RecordParts';
import { RecommendationCards, SourceGrid } from '../components/CompareParts';

export interface DetailOrigin {
  backLabel: string;
  backTo: string | ((params: Record<string, string | undefined>) => string);
}

interface Draft {
  title: string;
  favourite: boolean;
  projectId: string | null;
  messages: ChatMessage[];
}

const toDraft = (r: RecordItem): Draft => ({ title: r.title, favourite: r.favourite, projectId: r.projectId, messages: r.messages || [] });
const draftKey = (d: Draft) => JSON.stringify([d.title, d.favourite, d.projectId, d.messages.filter((m) => !m.error).map((m) => [m.role, m.content])]);

/** Canonical saved-record detail: Feedback Detail for feedback, saved Comparison Result for comparisons. */
export default function RecordDetail({ origin }: { origin: DetailOrigin }) {
  const params = useParams();
  const navigate = useNavigate();
  const { reloadProjects, prompts } = useApp();
  const [record, setRecord] = useState<RecordItem | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [saving, setSaving] = useState(false);
  const [chatModel, setChatModel] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  const backTo = typeof origin.backTo === 'function' ? origin.backTo(params) : origin.backTo;

  useEffect(() => {
    setRecord(null);
    api.get<RecordItem>(`/api/records/${params.id}`)
      .then((r) => { setRecord(r); setDraft(toDraft(r)); setChatModel(r.model); })
      .catch((e) => setError(e.message));
  }, [params.id]);

  const dirty = !!record && !!draft && draftKey(draft) !== draftKey(toDraft(record));
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname);
  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (window.confirm('You have unsaved changes to this record. Leave without updating?')) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);
  useEffect(() => {
    if (!dirty) return;
    const onUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [dirty]);

  const update = async () => {
    if (!record || !draft) return;
    setSaving(true);
    try {
      const saved = await api.patch<RecordItem>(`/api/records/${record.id}`, {
        title: draft.title, favourite: draft.favourite, projectId: draft.projectId,
        messages: draft.messages.filter((m) => !m.error),
      });
      setRecord(saved);
      setDraft(toDraft(saved));
      reloadProjects();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1600);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!record) return;
    if (!window.confirm(`Delete this ${record.kind === 'compare' ? 'comparison' : 'feedback'}? This cannot be undone.`)) return;
    await api.del(`/api/records/${record.id}`);
    reloadProjects();
    setRecord(null);
    setDraft(null);
    navigate(backTo, { replace: true });
  };

  const setMessages = useCallback((fn: (m: ChatMessage[]) => ChatMessage[]) => {
    setDraft((d) => (d ? { ...d, messages: fn(d.messages) } : d));
  }, []);

  const chatContext = useMemo(() => record && ({
    kind: record.kind,
    sourceIds: record.sources.map((s) => s.id),
    sourceType: record.sourceType,
    promptText: record.promptBody,
    systemNote: prompts.find((p) => p.id === record.promptId)?.systemNote,
    output: record.output,
    recommendations: record.recommendations,
  }), [record, prompts]);

  if (error && !record) {
    return (
      <main className="main">
        <div className="page stack-36">
          <TopBar back={{ label: origin.backLabel, onClick: () => navigate(backTo) }} />
          <div className="empty"><div className="output-status">Record unavailable</div><p>{error}</p></div>
        </div>
      </main>
    );
  }
  if (!record || !draft) return <main className="main tight"><div className="page"><TopBar /></div></main>;

  const type = sourceTypeBadge(record.sourceType);
  const isCompare = record.kind === 'compare';
  const breadcrumb = isCompare ? 'Director / Compare' : 'Director / Feedback';

  const meta = {
    date: (
      <div className="meta-box">
        <SectionTitle>Date created</SectionTitle>
        <DateRow iso={record.createdAt} />
      </div>
    ),
    type: (
      <div className="meta-box">
        <SectionTitle>Source type</SectionTitle>
        <div><Badge color={type.color} h32>{record.sourceType === 'Design' ? 'Design' : 'Photography'}</Badge></div>
      </div>
    ),
    prompt: (
      <div className="meta-box">
        <SectionTitle>Prompt used</SectionTitle>
        <p className="mono-13">{record.promptBody || 'No prompt text was used.'}</p>
      </div>
    ),
    model: (
      <div className="meta-box">
        <SectionTitle>Review by</SectionTitle>
        <p className="mono-13" style={{ textTransform: 'uppercase' }}>{record.model || '—'}</p>
      </div>
    ),
    project: (
      <div className="meta-box">
        <SectionTitle>Project</SectionTitle>
        <ProjectSelect value={draft.projectId} onChange={(id) => setDraft({ ...draft, projectId: id })} placeholder="No project" />
      </div>
    ),
  };

  return (
    <main className="main tight">
      <div className="page" style={{ gap: 12 }}>
        <div className="page stack-34">
          <TopBar back={{ label: origin.backLabel, onClick: () => navigate(backTo) }} />
          {isCompare ? (
            <Header
              breadcrumb={breadcrumb}
              title={<EditableTitle value={draft.title} editing={editingTitle} onDone={(t) => { setEditingTitle(false); if (t) setDraft({ ...draft, title: t }); }} />}
              tools={<button type="button" className="btn" onClick={() => navigate('/director/compare')}>Ask for new feedback</button>}
            />
          ) : (
            <Header
              breadcrumb={breadcrumb}
              title={<EditableTitle value={draft.title} editing={editingTitle} onDone={(t) => { setEditingTitle(false); if (t) setDraft({ ...draft, title: t }); }} />}
              subtitle={`${record.promptName || 'Custom'} Read · ${formatDate(record.createdAt)}`}
              tools={
                <RecordToolbar
                  favourite={draft.favourite}
                  onEdit={() => setEditingTitle(true)}
                  onFavourite={() => setDraft({ ...draft, favourite: !draft.favourite })}
                  onDelete={remove}
                />
              }
            />
          )}

          {isCompare ? (
            <div className="panel">
              <div className="file-box"><SourceGrid sources={record.sources} /></div>
              <div className="feedback-section">
                <div className="page" style={{ gap: 28 }}>
                  <div className="recommendations">
                    <SectionTitle>Director recommendations</SectionTitle>
                    <OutputBox className="auto" status="First read" text={record.output} />
                    <RecommendationCards sources={record.sources} recommendations={record.recommendations} />
                  </div>
                  <div className="meta-grid">{meta.date}{meta.type}</div>
                  {meta.prompt}
                  <div className="meta-grid">{meta.model}{meta.project}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="panel">
              <div className="panel-row">
                <div className="col-left g28">
                  <div className="dropzone static">
                    {record.sources[0] && <img className="source" src={fileUrl(record.sources[0])} alt={record.sources[0].filename} />}
                  </div>
                  {meta.date}
                  {meta.type}
                  {meta.prompt}
                  {meta.model}
                  {meta.project}
                </div>
                <div className="col-right">
                  <OutputBox className="detail" status="Feedback" text={record.output} />
                </div>
              </div>
            </div>
          )}
        </div>

        <AskDirector
          messages={draft.messages}
          setMessages={setMessages}
          context={chatContext}
          model={chatModel}
          onModelChange={setChatModel}
          placeholder={isCompare ? 'Discuss the reasoning why the image was selected...' : 'Lets discuss the photo in more detail.'}
        />
        <div className="save-row" style={{ flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <button type="button" className="btn" style={{ minWidth: 140 }} onClick={update} disabled={saving || !dirty}>
            {justSaved ? 'Updated' : isCompare ? 'Update comparison' : 'Update feedback'}
          </button>
          {error && <span className="form-error">{error}</span>}
        </div>
      </div>
    </main>
  );
}
