import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp, emptyFeedback } from '../store';
import { api, fileUrl, formatDate, type RecordItem, type SourceType } from '../api';
import { TopBar, Header } from '../components/Shell';
import { Badge, KindBadge, sourceTypeBadge } from '../components/Common';
import { Icon } from '../components/Icon';
import { QuickView } from '../components/QuickView';

export interface LibraryConfig {
  sourceType: SourceType;
  basePath: string;
  breadcrumb: string;
  title: string;
  subtitle: string;
  noun: string;
}

export const DARKROOM: LibraryConfig = {
  sourceType: 'Photography', basePath: '/darkroom', breadcrumb: 'Director / Darkroom', title: 'Darkroom Feedback',
  subtitle: 'Saved photography feedback and comparisons.', noun: 'photography',
};
export const DESIGN_STUDIO: LibraryConfig = {
  sourceType: 'Design', basePath: '/design-studio', breadcrumb: 'Director / Design Studio', title: 'Design Studio Feedback',
  subtitle: 'Saved design feedback and comparisons.', noun: 'design',
};

export function FileThumb({ record, onClick }: { record: RecordItem; onClick: () => void }) {
  const type = sourceTypeBadge(record.sourceType);
  const cover = record.kind === 'compare'
    ? record.sources[(record.recommendations[0]?.source || 1) - 1] || record.sources[0]
    : record.sources[0];
  return (
    <button type="button" className="file-thumb" onClick={onClick}>
      <div className="file-thumb-image">{cover && <img src={fileUrl(cover)} alt="" loading="lazy" />}</div>
      <div className="file-thumb-title">{record.title}</div>
      <div className="file-thumb-badges">
        <Badge color={type.color}>{type.label}</Badge>
        <KindBadge record={record} fill />
      </div>
      <div className="file-thumb-date">
        <Icon name="icon-time" size={14} />
        <span className="trim">{formatDate(record.createdAt)}</span>
      </div>
    </button>
  );
}

export default function Library({ config }: { config: LibraryConfig }) {
  const navigate = useNavigate();
  const { feedback, setFeedback } = useApp();
  const [records, setRecords] = useState<RecordItem[] | null>(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<RecordItem | null>(null);

  useEffect(() => {
    setRecords(null);
    api.get<RecordItem[]>(`/api/records?sourceType=${config.sourceType}`)
      .then(setRecords)
      .catch((e) => setError(e.message));
  }, [config.sourceType]);

  const addNew = () => {
    // Start a fresh feedback session in this library's domain when nothing is in progress.
    if (!feedback.sources.length && feedback.status !== 'generating') {
      setFeedback(() => ({ ...emptyFeedback(), sourceType: config.sourceType }));
    }
    navigate('/director');
  };

  return (
    <main className="main">
      <div className="page stack-36">
        <TopBar />
        <Header
          breadcrumb={config.breadcrumb}
          title={config.title}
          tools={<button type="button" className="btn w140" style={{ width: 'auto', minWidth: 140 }} onClick={addNew}>Add new feedback</button>}
        />
        <p className="subtitle trim">{config.subtitle}</p>
        {error && <div className="empty"><div className="output-status">Library unavailable</div><p>{error}</p></div>}
        {records && records.length === 0 && (
          <div className="empty">
            <div className="output-status">No feedback yet</div>
            <p>Saved {config.noun} feedback and comparisons appear here. Add new feedback to begin.</p>
          </div>
        )}
        {records && records.length > 0 && (
          <div className="thumb-grid">
            {records.map((r) => <FileThumb key={r.id} record={r} onClick={() => setSelected(r)} />)}
          </div>
        )}
      </div>
      {selected && (
        <QuickView
          record={selected}
          onClose={() => setSelected(null)}
          onOpen={() => navigate(`${config.basePath}/${selected.id}`)}
        />
      )}
    </main>
  );
}
