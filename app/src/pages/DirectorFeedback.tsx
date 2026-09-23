import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp, emptyFeedback, type FeedbackSession } from '../store';
import { api, type RecordItem } from '../api';
import { TopBar, Header, Tabs } from '../components/Shell';
import { Select } from '../components/Select';
import { SingleDropzone } from '../components/Dropzone';
import { OutputBox, ProjectSelect, SourceTypeSelect, promptOptions } from '../components/Common';
import { AskDirector } from '../components/AskDirector';
import { EditableTitle, RecordToolbar } from '../components/RecordParts';

export function snapshotFeedback(s: Pick<FeedbackSession, 'title' | 'favourite' | 'projectId' | 'output' | 'messages' | 'promptText' | 'sourceType' | 'sources'>) {
  return JSON.stringify([s.title, s.favourite, s.projectId, s.output, s.messages.map((m) => m.content), s.promptText, s.sourceType, s.sources.map((f) => f.id)]);
}

export default function DirectorFeedback() {
  const { feedback: s, setFeedback, runFeedback, prompts, reloadProjects } = useApp();
  const navigate = useNavigate();
  const [editingTitle, setEditingTitle] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const generating = s.status === 'generating';
  const done = s.status === 'done' && !!s.output;
  const dirty = !s.recordId || snapshotFeedback(s) !== s.saved;
  const prompt = prompts.find((p) => p.id === s.promptId) || null;
  const options = useMemo(() => promptOptions(prompts, { sourceType: s.sourceType, useType: 'Feedback', include: s.promptId }), [prompts, s.sourceType, s.promptId]);

  const set = (patch: Partial<FeedbackSession>) => setFeedback((x) => ({ ...x, ...patch }));

  const reset = () => setFeedback(() => emptyFeedback());

  const startNew = () => {
    if (done && dirty && !window.confirm('Discard this unsaved feedback and start new feedback?')) return;
    reset();
  };

  const remove = async () => {
    if (s.recordId) {
      if (!window.confirm('Delete this feedback? This cannot be undone.')) return;
      await api.del(`/api/records/${s.recordId}`);
      reloadProjects();
    } else if (!window.confirm('Discard this feedback?')) {
      return;
    }
    reset();
  };

  const save = async () => {
    if (!s.sources.length || !s.output) return;
    setSaving(true);
    setSaveError('');
    try {
      const body = {
        kind: 'feedback',
        title: s.title,
        sourceType: s.sourceType,
        promptId: s.promptId,
        promptName: prompt?.name || 'Custom prompt',
        promptBody: s.promptText,
        model: s.model,
        projectId: s.projectId,
        output: s.output,
        favourite: s.favourite,
        sourceIds: s.sources.map((f) => f.id),
        messages: s.messages.filter((m) => !m.error),
      };
      const rec = s.recordId
        ? await api.patch<RecordItem>(`/api/records/${s.recordId}`, body)
        : await api.post<RecordItem>('/api/records', body);
      setFeedback((x) => ({ ...x, recordId: rec.id, saved: snapshotFeedback(x) }));
      reloadProjects();
    } catch (e) {
      setSaveError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const status = generating
    ? 'Writing feedback'
    : s.status === 'error'
      ? 'Feedback unavailable'
      : done
        ? 'First read'
        : s.sources.length ? 'Ready for feedback' : 'Nothing to feedback';

  const statusText = generating
    ? s.output
    : done
      ? s.output
      : s.sources.length ? 'Choose a prompt or write your own, then Get Feedback.' : 'Select an image to start feedback.';

  const panel = (
    <div className="panel">
      <div className="panel-row">
        <div className="col-left">
          <SingleDropzone source={s.sources[0] || null} onSource={(f) => set({ sources: [f] })} disabled={generating} />
          <label className="form-label trim">Source Type</label>
          <SourceTypeSelect value={s.sourceType} onChange={(v) => set({ sourceType: v })} disabled={generating} />
          <label className="form-label trim">Prompt</label>
          <Select
            value={s.promptId}
            options={options}
            placeholder="Select prompt"
            disabled={generating}
            ariaLabel="Prompt"
            onChange={(id) => {
              const p = prompts.find((x) => x.id === id);
              set({ promptId: id, promptText: p?.body || '' });
            }}
          />
          <textarea
            className="textarea secondary"
            style={{ height: 163 }}
            value={s.promptText}
            disabled={generating}
            placeholder="Select a preset prompt OR enter your own.."
            onChange={(e) => set({ promptText: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); runFeedback(); } }}
            aria-label="Prompt text"
          />
          <p className="help trim">
            Director references this file when a Finder path is available. Browser uploads are<br />
            stored as a local source copy so they can still be feedbacked.
          </p>
          <label className="form-label trim">Project Link</label>
          <ProjectSelect value={s.projectId} onChange={(id) => set({ projectId: id })} disabled={generating} />
          <button type="button" className="btn sq full" onClick={runFeedback} disabled={!s.sources.length || generating}>
            {done ? 'Update feedback' : 'Get feedback'}
          </button>
        </div>
        <div className="col-right">
          <OutputBox
            className="fixed"
            status={status}
            text={statusText}
            thinking={generating}
            error={s.status === 'error' ? s.error : undefined}
          />
        </div>
      </div>
    </div>
  );

  if (!done) {
    const started = generating || (s.status === 'error' && !!s.title);
    return (
      <main className={`main${started ? ' tight' : ''}`}>
        <div className={`page ${started ? 'stack-34' : 'stack-44'}`}>
          <TopBar />
          <Header
            breadcrumb="Director / Feedback"
            title={started ? s.title : 'New Feedback'}
            subtitle="Review one photograph, design, screen, layout, poster, or visual direction."
          />
          <div className="page stack-34" style={{ gap: started ? 34 : 46 }}>
            <Tabs
              tabs={[{ id: 'feedback', label: 'Feedback' }, { id: 'compare', label: 'Compare' }]}
              value="feedback"
              onChange={(t) => t === 'compare' && navigate('/director/compare')}
            />
            {panel}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main tight">
      <div className="page" style={{ gap: 12 }}>
        <div className="page stack-34">
          <TopBar />
          <Header
            breadcrumb="Director / Feedback"
            title={<EditableTitle value={s.title} editing={editingTitle} onDone={(t) => { setEditingTitle(false); if (t) set({ title: t }); }} />}
            toolsWide
            tools={
              <>
                <RecordToolbar
                  favourite={s.favourite}
                  onEdit={() => setEditingTitle(true)}
                  onFavourite={() => set({ favourite: !s.favourite })}
                  onDelete={remove}
                />
                <button type="button" className="btn w140" onClick={startNew}>New feedback</button>
              </>
            }
          />
          {panel}
        </div>
        <AskDirector
          messages={s.messages}
          setMessages={(fn) => setFeedback((x) => ({ ...x, messages: fn(x.messages) }))}
          context={{ kind: 'feedback', sourceIds: s.sources.map((f) => f.id), sourceType: s.sourceType, promptText: s.promptText, systemNote: prompt?.systemNote, output: s.output }}
          model={s.chatModel}
          onModelChange={(m) => set({ chatModel: m })}
          placeholder="Lets discuss the photo in more detail."
        />
        <div className="save-row" style={{ flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <button type="button" className="btn w140" onClick={save} disabled={saving || !dirty}>
            {s.recordId && !dirty ? 'Saved' : 'Save feedback'}
          </button>
          {saveError && <span className="form-error">{saveError}</span>}
        </div>
      </div>
    </main>
  );
}
