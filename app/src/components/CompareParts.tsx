import { fileUrl, type FileRef, type Recommendation } from '../api';

export const recColumns = (n: number) => (n <= 4 ? n : 3);

/** Ranked recommendation cards. One card per submitted source, ordered by the model's ranking. */
export function RecommendationCards({ sources, recommendations }: { sources: FileRef[]; recommendations: Recommendation[] }) {
  const n = recommendations.length;
  return (
    <div className="rec-row" style={{ gridTemplateColumns: `repeat(${recColumns(n)}, minmax(0, 1fr))` }}>
      {recommendations.map((r) => {
        const src = sources[r.source - 1];
        const active = r.rank === 1;
        return (
          <div key={r.rank} className={`rec-card${active ? ' active' : ''}`}>
            {active && <div className="rec-flag trim">Recommended</div>}
            <div className="rec-image">{src && <img src={fileUrl(src)} alt={src.filename} />}</div>
            <div className="rec-caption">
              <div className="rec-title" title={src?.filename}>#{r.rank} · Option {r.source}</div>
              {r.reason && <div className="rec-reason">{r.reason}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SourceGrid({ sources }: { sources: FileRef[] }) {
  const cols = sources.length <= 2 ? sources.length : sources.length === 4 ? 2 : 3;
  return (
    <div className="compare-files" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {sources.map((s, i) => (
        <div key={s.id} className="compare-thumb" title={s.filename}>
          <img src={fileUrl(s)} alt={s.filename} />
          <span className="num">{i + 1}</span>
        </div>
      ))}
    </div>
  );
}
