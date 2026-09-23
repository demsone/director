import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp, emptyCompare, type CompareSession } from '../store';
import { api, type RecordItem } from '../api';
import { TopBar, Header, Tabs } from '../components/Shell';
import { Select } from '../components/Select';
import { MultiDropzone } from '../components/Dropzone';
import { OutputBox, ProjectSelect, SourceTypeSelect, promptOptions } from '../components/Common';
import { AskDirector } from '../components/AskDirector';
import { RecommendationCards } from '../components/CompareParts';

const snapshot = (s: CompareSession) =>
  JSON.stringify([s.title, s.favourite, s.projectId, s.output, s.recommendations, s.messages.map((m) => m.content), s.promptText, s.sourceType, s.sources.map((f) => f.id)]);

export default function DirectorCompare() {
  const { compare: s, setCompare, runCompare, prompts, reloadProjects } = useApp();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const generating = s.status === 'generating';
  const done = s.status === 'done' && !!s.output && s.recommendations.length > 0;
  const dirty = !s.recordId || snapshot(s) !== s.saved;
  const prompt = prompts.find((p) => p.id === s.promptId) || null;
  const options = useMemo(
    () => promptOptions(prompts, { sourceType: s.sourceType || 'Photography', useType: 'Compare', include: s.promptId }),
    [prompts, s.sourceType, s.promptId],
  );
  const set = (patch: Partial<CompareSession>) => setCompare((x) => ({ ...x, ...patch }));
  const canCompare = s.sources.length >= 2 && s.sources.length <= 6 && !generating;

  const clear = () => {
    if ((s.sources.length || s.output) && dirty && !window.confirm('Clear the current comparison inputs?')) return;
    setCompare(() => emptyCompare());
  };

  const save = async () => {
    setSaving(true);
    setSaveError('');
    try {
      let title = s.title;
      if (!title) {
        const existing = await api.get<RecordItem[]>('/api/records?kind=compare');
        title = `${s.sourceType === 'Design' ? 'Design' : 'Image'} Decision ${existing.length + 1}`;
      }
      const body = {
        kind: 'compare',
        title,
        sourceType: s.sourceType || 'Photography',
        promptId: s.promptId,
        promptName: prompt?.name || 'Comparison',
        promptBody: s.promptText,
        model: s.model,
        projectId: s.projectId,
        output: s.output,
        recommendations: s.recommendations,
        favourite: s.favourite,
        sourceIds: s.sources.map((f) => f.id),
        messages: s.messages.filter((m) => !m.error),
      };
      const rec = s.recordId
        ? await api.patch<RecordItem>(`/api/records/${s.recordId}`, body)
        : await api.post<RecordItem>('/api/records', body);
      setCompare((x) => {
        const next = { ...x, title: rec.title, recordId: rec.id };
        return { ...next, saved: snapshot(next) };
      });
      reloadProjects();
    } catch (e) {
      setSaveError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const status = generating
    ? 'Comparing images'
    : s.status === 'error'
      ? 'Comparison unavailable'
      : done ? 'First read' : s.sources.length >= 2 ? 'Ready to compare' : 'Nothing to compare';
  const text = generating
    ? 'Sit back while director makes its final recommendations'
    : done
      ? s.output
      : s.sources.length === 1
        ? 'Add at least one more source to compare.'
        : s.sources.length >= 2 ? `${s.sources.length} sources ready. Choose a prompt, then Compare Sources.` : 'Select 2 images to start comparing.';

  return (
    <main className={`main${done || generating ? ' tight' : ''}`}>
      <div className="page" style={{ gap: 12 }}>
        <div className="page stack-34" style={{ gap: done || generating ? 34 : 44 }}>
          <TopBar />
          <Header
            breadcrumb="Director / Compare"
            title="Compare"
            subtitle="Choose the strongest option from 2–6 photographs or designs."
            tools={done
              ? <button type="button" className="btn w140" onClick={clear}>New comparison</button>
              : <button type="button" className="btn secondary" style={{ padding: '0 30px' }} onClick={clear} disabled={generating}>Clear</button>}
          />
          <div className="page stack-34" style={{ gap: done || generating ? 34 : 46 }}>
            <Tabs
              tabs={[{ id: 'feedback', label: 'Single Feedback' }, { id: 'compare', label: 'Compare' }]}
              value="compare"
              onChange={(t) => t === 'feedback' && navigate('/director')}
            />
            <div className="panel">
              <div className="file-box">
                <MultiDropzone sources={s.sources} onChange={(src) => set({ sources: src })} disabled={generating} />
              </div>
              <div className="feedback-section">
                <div className="meta-row">
                  <div>
                    <span className="form-label trim">Source Type</span>
                    <SourceTypeSelect value={s.sourceType} placeholder="Select" primaryText onChange={(v) => set({ sourceType: v })} disabled={generating} />
                  </div>
                  <div>
                    <span className="form-label trim">Project Link</span>
                    <ProjectSelect value={s.projectId} placeholder="Select project" primaryText onChange={(id) => set({ projectId: id })} disabled={generating} />
                  </div>
                </div>
                <div className="feedback-section" style={{ padding: 0 }}>
                  <span className="form-label regular trim">Prompt</span>
                  <div className="action-bar">
                    <Select
                      value={s.promptId}
                      options={options}
                      placeholder="Select prompt"
                      size="h40"
                      primaryText
                      disabled={generating}
                      ariaLabel="Comparison prompt"
                      onChange={(id) => set({ promptId: id, promptText: prompts.find((p) => p.id === id)?.body || '' })}
                    />
                    {!done && (
                      <button type="button" className="btn secondary sq w140" onClick={() => set({ promptId: null, promptText: '' })} disabled={generating || !s.promptId}>
                        Clear prompt
                      </button>
                    )}
                    <button type="button" className="btn sq w192" onClick={runCompare} disabled={!canCompare}>
                      {done ? 'Update compare' : 'Compare sources'}
                    </button>
                  </div>
                </div>
                <OutputBox
                  className="auto"
                  status={status}
                  text={text}
                  thinking={generating}
                  error={s.status === 'error' ? s.error : undefined}
                />
                {done && (
                  <div className="recommendations">
                    <span className="form-label trim">Director Recommendations</span>
                    <RecommendationCards sources={s.sources} recommendations={s.recommendations} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {done && (
          <>
            <AskDirector
              messages={s.messages}
              setMessages={(fn) => setCompare((x) => ({ ...x, messages: fn(x.messages) }))}
              context={{
                kind: 'compare', sourceIds: s.sources.map((f) => f.id), sourceType: s.sourceType || 'Photography',
                promptText: s.promptText, systemNote: prompt?.systemNote, output: s.output, recommendations: s.recommendations,
              }}
              model={s.chatModel}
              onModelChange={(m) => set({ chatModel: m })}
              placeholder="Discuss the reasoning why the image was selected..."
            />
            <div className="save-row" style={{ flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <button type="button" className="btn" style={{ minWidth: 140 }} onClick={save} disabled={saving || !dirty}>
                {s.recordId && !dirty ? 'Saved' : 'Save comparison'}
              </button>
              {saveError && <span className="form-error">{saveError}</span>}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
