import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

export function EditableTitle({ value, editing, onDone }: { value: string; editing: boolean; onDone: (v: string | null) => void }) {
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editing) {
      setDraft(value);
      requestAnimationFrame(() => { ref.current?.focus(); ref.current?.select(); });
    }
  }, [editing, value]);
  if (!editing) return <h1 className="h2 trim">{value}</h1>;
  return (
    <input
      ref={ref}
      className="h2-input"
      value={draft}
      aria-label="Title"
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => onDone(draft.trim() || null)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onDone(draft.trim() || null);
        if (e.key === 'Escape') onDone(null);
      }}
    />
  );
}

export function RecordToolbar({ favourite, onEdit, onFavourite, onDelete, disabled }: {
  favourite: boolean; onEdit: () => void; onFavourite: () => void; onDelete: () => void; disabled?: boolean;
}) {
  return (
    <div className="toolbar-actions">
      <button type="button" className="tool-btn" title="Edit title" onClick={onEdit} disabled={disabled}>
        <Icon name="pencil" size={13} />
      </button>
      <button type="button" className={`tool-btn${favourite ? ' on' : ''}`} title={favourite ? 'Remove favourite' : 'Favourite'} aria-pressed={favourite} onClick={onFavourite} disabled={disabled}>
        <Icon name="Star" size={15} filled={favourite} />
      </button>
      <button type="button" className="tool-btn" title="Delete" onClick={onDelete} disabled={disabled}>
        <Icon name="bin" size={13} />
      </button>
    </div>
  );
}
