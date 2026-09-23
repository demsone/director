import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../store';
import { api, formatBytes, type StorageInfo } from '../api';
import { TopBar, Header } from '../components/Shell';
import { Select, type Option } from '../components/Select';
import { Icon } from '../components/Icon';

const SECTIONS = [
  { id: 'models', label: 'Model' },
  { id: 'personalisation', label: 'Personalisation' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'prompts', label: 'Prompts' },
  { id: 'storage', label: 'Storage' },
  { id: 'keyboard', label: 'Keyboard' },
];

export const ACCENTS = ['#B95A36', '#F077AF', '#7FA0B2', '#6DA1D5', '#28B8A6', '#343434'];

function Row({ title, caption, children, top }: { title: string; caption: string; children: ReactNode; top?: boolean }) {
  return (
    <div className={`settings-row${top ? ' top' : ''}`}>
      <div className="settings-caption">
        <b>{title}</b>
        <span>{caption}</span>
      </div>
      <div className="settings-control">{children}</div>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <div className="settings-box">
      <div className="settings-head">
        <h2 className="h4">{title}</h2>
        {desc && <p className="settings-desc">{desc}</p>}
      </div>
      <div className="settings-list">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { section = 'models' } = useParams();
  const navigate = useNavigate();
  return (
    <main className="main">
      <div className="page" style={{ gap: 20 }}>
        <TopBar />
        <Header breadcrumb="Director / Settings" title="Settings" subtitle="Local model, storage, appearance, shortcuts, and app information." />
        <div className="settings" style={{ marginTop: 20 }}>
          <nav className="subnav">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`subnav-item${s.id === section ? ' active' : ''}`}
                onClick={() => navigate(s.id === 'prompts' ? '/prompts' : `/settings/${s.id}`)}
              >
                {s.label}
              </button>
            ))}
          </nav>
          {section === 'models' && <ModelsSection />}
          {section === 'personalisation' && <PersonalisationSection />}
          {section === 'appearance' && <AppearanceSection />}
          {section === 'storage' && <StorageSection />}
          {section === 'keyboard' && <KeyboardSection />}
        </div>
      </div>
    </main>
  );
}

function ModelsSection() {
  const { settings, updateSettings, refreshStatus } = useApp();
  const [endpoint, setEndpoint] = useState(settings?.endpoint || '');
  const [models, setModels] = useState<string[]>([]);
  const [loadError, setLoadError] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => { if (settings) setEndpoint(settings.endpoint); }, [settings?.endpoint]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!settings) return;
    api.get<{ models: string[] }>(`/api/models?endpoint=${encodeURIComponent(settings.endpoint)}`)
      .then((r) => { setModels(r.models); setLoadError(''); })
      .catch((e) => { setModels([]); setLoadError(e.message); });
  }, [settings?.endpoint]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!settings) return null;

  const options = (current: string): Option[] => {
    const list = models.map((m) => ({ value: m, label: m }));
    if (current && !models.includes(current)) list.unshift({ value: current, label: `${current} (not available)` });
    return [{ value: '', label: 'Automatic (first available model)' }, ...list];
  };

  const commitEndpoint = () => {
    const v = endpoint.trim();
    if (v && v !== settings.endpoint) updateSettings({ endpoint: v });
  };

  const test = async () => {
    setTesting(true);
    setResult(null);
    try {
      const r = await api.post<{ ok: boolean; message: string }>('/api/models/test', {
        endpoint: endpoint.trim() || settings.endpoint,
        models: [settings.feedbackModel, settings.compareModel, settings.visionModel],
      });
      setResult(r);
      refreshStatus();
    } catch (e) {
      setResult({ ok: false, message: (e as Error).message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="settings-box">
      <Section title="Models" desc="Local model, storage, appearance, shortcuts, and app information.">
        <Row title="Default feedback model" caption="Model used for single-source critique.">
          <Select value={settings.feedbackModel} options={options(settings.feedbackModel)} size="h52" primaryText onChange={(v) => updateSettings({ feedbackModel: v })} ariaLabel="Default feedback model" />
        </Row>
        <Row title="Default compare model" caption="Model used for 2–6 source comparisons.">
          <Select value={settings.compareModel} options={options(settings.compareModel)} size="h52" primaryText onChange={(v) => updateSettings({ compareModel: v })} ariaLabel="Default compare model" />
        </Row>
        <Row title="Vision model" caption="Local model that can read images.">
          <Select value={settings.visionModel} options={options(settings.visionModel)} size="h52" primaryText onChange={(v) => updateSettings({ visionModel: v })} ariaLabel="Vision model" />
        </Row>
        <Row title="Local server URL" caption="OpenAI-compatible LM Studio endpoint.">
          <input
            className="input h52"
            value={endpoint}
            spellCheck={false}
            onChange={(e) => { setEndpoint(e.target.value); setResult(null); }}
            onBlur={commitEndpoint}
            onKeyDown={(e) => { if (e.key === 'Enter') commitEndpoint(); }}
            aria-label="Local server URL"
          />
          {loadError && <div className="test-result"><Icon name="status-alert" size={14} />{loadError}</div>}
        </Row>
      </Section>
      <div style={{ marginTop: -8 }}>
        <button type="button" className="btn w140" style={{ width: 'auto', minWidth: 140 }} onClick={test} disabled={testing}>
          {testing ? 'Testing…' : 'Test connection'}
        </button>
        {result && (
          <div className="test-result">
            <Icon name={result.ok ? 'status-active' : 'status-alert'} size={14} />
            <span>{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function PersonalisationSection() {
  const { settings, updateSettings } = useApp();
  const [custom, setCustom] = useState(settings?.customInstructions || '');
  useEffect(() => { if (settings) setCustom(settings.customInstructions); }, [settings?.customInstructions]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!settings) return null;
  const opts = (xs: string[]) => xs.map((x) => ({ value: x, label: x }));
  return (
    <Section title="Personalisation">
      <Row title="Base style and tone" caption="Set the style and tone of how Director responds to you.">
        <Select value={settings.tone} options={opts(['Professional', 'Friendly', 'Candid'])} size="h52" primaryText onChange={(v) => updateSettings({ tone: v })} ariaLabel="Base style and tone" />
      </Row>
      <Row title="Warm" caption="How much warmth Director brings to its responses.">
        <Select value={settings.warmth} options={opts(['Less', 'More', 'Neutral'])} size="h52" primaryText onChange={(v) => updateSettings({ warmth: v })} ariaLabel="Warmth" />
      </Row>
      <Row title="Fast Answers" caption="Director can sometimes use its general knowledge to give fast, in-depth answers.">
        <Select value={settings.fastAnswers} options={opts(['Yes', 'No'])} size="h52" primaryText onChange={(v) => updateSettings({ fastAnswers: v })} ariaLabel="Fast answers" />
      </Row>
      <Row title="Custom instructions" caption="Enter custom instructions for Director here." top>
        <textarea
          className="textarea"
          rows={4}
          value={custom}
          placeholder=""
          onChange={(e) => setCustom(e.target.value)}
          onBlur={() => { if (custom !== settings.customInstructions) updateSettings({ customInstructions: custom }); }}
          aria-label="Custom instructions"
        />
      </Row>
    </Section>
  );
}

function AppearanceSection() {
  const { settings, updateSettings } = useApp();
  if (!settings) return null;
  return (
    <Section title="Appearance" desc="Choose the look you want">
      <Row title="Theme" caption="The approved Director theme.">
        <Select value={settings.theme} options={[{ value: 'Dark', label: 'Dark' }]} size="h52" primaryText onChange={(v) => updateSettings({ theme: v })} ariaLabel="Theme" />
      </Row>
      <Row title="Accent" caption="Choose a colour">
        <div className="swatches" role="radiogroup" aria-label="Accent colour">
          {ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={settings.accent.toUpperCase() === c}
              aria-label={c}
              className={`swatch${settings.accent.toUpperCase() === c ? ' on' : ''}`}
              style={{ background: c }}
              onClick={() => updateSettings({ accent: c })}
            />
          ))}
        </div>
      </Row>
    </Section>
  );
}

function StorageSection() {
  const [info, setInfo] = useState<StorageInfo | null>(null);
  useEffect(() => { api.get<StorageInfo>('/api/storage').then(setInfo); }, []);
  const Box = ({ children }: { children: ReactNode }) => (
    <div className="input h52" style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{children}</div>
  );
  return (
    <Section title="Storage" desc="Director stores everything locally on this computer.">
      {info && (
        <>
          <Row title="Data folder" caption="Database and source copies live here."><Box><span title={info.dataDir}>{info.dataDir}</span></Box></Row>
          <Row title="Library" caption="Saved records and projects."><Box>{info.feedback} feedback · {info.comparisons} comparisons · {info.projects} projects</Box></Row>
          <Row title="Prompts" caption="Prompts in the Prompt Library."><Box>{info.prompts} prompts</Box></Row>
          <Row title="Sources" caption="Local source copies of uploaded images."><Box>{info.files} files · {formatBytes(info.filesBytes)}</Box></Row>
          <Row title="Database" caption="Size of the Director database."><Box>{formatBytes(info.dbBytes)}</Box></Row>
        </>
      )}
    </Section>
  );
}

function KeyboardSection() {
  const shortcuts = [
    ['Send message to Director', 'Enter'],
    ['New line in a message', 'Shift + Enter'],
    ['Get feedback from the prompt field', '⌘ + Enter'],
    ['Close a drawer, menu or dialog', 'Esc'],
  ];
  return (
    <Section title="Keyboard" desc="Shortcuts available in Director.">
      {shortcuts.map(([label, keys]) => (
        <div key={label} className="settings-row">
          <div className="settings-caption" style={{ width: 'auto', flex: 1 }}><b>{label}</b></div>
          <span className="kbd">{keys}</span>
        </div>
      ))}
    </Section>
  );
}
