import { useEffect, type ReactNode } from 'react';
import type { RecordItem } from '../api';
import { Icon } from './Icon';
import { Badge, KindBadge, Markdown, sourceTypeBadge } from './Common';

export function Drawer({ onClose, children, labelledBy }: { onClose: () => void; children: ReactNode; labelledBy?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        {children}
      </aside>
    </>
  );
}

/** Shared Quick View drawer for a saved feedback or comparison record. */
export function QuickView({ record, onClose, onOpen }: { record: RecordItem; onClose: () => void; onOpen: () => void }) {
  const type = sourceTypeBadge(record.sourceType);
  const excerpt = record.output.length > 2400 ? record.output.slice(0, 2400).trimEnd() + '…' : record.output;
  return (
    <Drawer onClose={onClose} labelledBy="qv-title">
      <button type="button" className="drawer-close" onClick={onClose} aria-label="Close">
        <Icon name="button-close" size={19} />
      </button>
      <div className="drawer-head">
        <h2 id="qv-title" className="drawer-title">{record.title}</h2>
        <div className="row gap-8">
          <Badge color={type.color}>{type.label}</Badge>
          <KindBadge record={record} />
        </div>
      </div>
      <div className="drawer-body">
        <div className="field-label-lg">Prompt Used</div>
        <div className="output-box auto">
          <div className="output-text">{record.promptBody || 'No prompt text was used.'}</div>
        </div>
        <div>
          <button type="button" className="btn small" onClick={onOpen}>
            {record.kind === 'compare' ? 'View full comparison' : 'View full feedback'}
          </button>
        </div>
        <div className="output-box auto">
          <div className="output-status">First read</div>
          <div className="output-text"><Markdown text={excerpt} /></div>
        </div>
      </div>
    </Drawer>
  );
}
