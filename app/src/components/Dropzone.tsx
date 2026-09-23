import { useRef, useState, type ReactNode } from 'react';
import { uploadSource, fileUrl, type FileRef } from '../api';
import { Icon } from './Icon';

export function useUploader(onFiles: (refs: FileRef[]) => void, max = 1) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const upload = async (files: File[]) => {
    const list = files.slice(0, max);
    if (!list.length) return;
    setBusy(true);
    setError('');
    try {
      const refs: FileRef[] = [];
      for (const f of list) refs.push(await uploadSource(f));
      onFiles(refs);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, setError, upload };
}

interface DropTargetProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  children: (drag: boolean) => ReactNode;
  label?: string;
}

/** A click/drop surface that accepts image files. */
export function DropTarget({ onFiles, multiple, disabled, className, children, label }: DropTargetProps) {
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div
      className={className}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled}
      onClick={() => !disabled && input.current?.click()}
      onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); input.current?.click(); } }}
      onDragOver={(e) => { if (disabled) return; e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (disabled) return;
        onFiles(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/')));
      }}
    >
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden-input"
        onChange={(e) => {
          onFiles(Array.from(e.target.files || []));
          e.target.value = '';
        }}
      />
      {children(drag)}
    </div>
  );
}

export function SingleDropzone({ source, onSource, disabled }: { source: FileRef | null; onSource: (f: FileRef) => void; disabled?: boolean }) {
  const { busy, error, upload } = useUploader((refs) => onSource(refs[0]), 1);
  return (
    <DropTarget
      onFiles={upload}
      disabled={disabled || busy}
      label={source ? 'Replace source' : 'Drop a file here'}
      className={`dropzone${disabled ? ' static' : ''}`}
    >
      {(drag) => (
        <>
          {drag && <div style={{ position: 'absolute', inset: 0, border: '1px solid var(--accent)', pointerEvents: 'none' }} />}
          {busy ? (
            <span className="busy">Reading source…</span>
          ) : source ? (
            <img className="source" src={fileUrl(source)} alt={source.filename} />
          ) : (
            <>
              <span className="dropzone-label">Ask for feedback</span>
              <span className="dropzone-title">Drop a file here</span>
            </>
          )}
          {error && <span className="dropzone-error">{error}</span>}
        </>
      )}
    </DropTarget>
  );
}

export function MultiDropzone({ sources, onChange, disabled, max = 6 }: { sources: FileRef[]; onChange: (s: FileRef[]) => void; disabled?: boolean; max?: number }) {
  const { busy, error, setError, upload } = useUploader((refs) => onChange([...sources, ...refs].slice(0, max)), max - sources.length);
  const handle = (files: File[]) => {
    if (sources.length + files.length > max) setError('Maximum six sources.');
    upload(files);
  };
  if (!sources.length) {
    return (
      <DropTarget onFiles={handle} multiple disabled={disabled || busy} className="dropzone" label="Drop files here">
        {(drag) => (
          <>
            {drag && <div style={{ position: 'absolute', inset: 0, border: '1px solid var(--accent)', pointerEvents: 'none' }} />}
            {busy ? <span className="busy">Reading sources…</span> : (
              <>
                <span className="dropzone-label">Ask for feedback</span>
                <span className="dropzone-title">Drop a file here</span>
              </>
            )}
            {error && <span className="dropzone-error">{error}</span>}
          </>
        )}
      </DropTarget>
    );
  }
  const cols = Math.min(4, sources.length + (sources.length < max && !disabled ? 1 : 0));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="compare-files" style={{ gridTemplateColumns: `repeat(${Math.max(cols, 1)}, minmax(0, 1fr))` }}>
        {sources.map((s, i) => (
          <div key={s.id} className="compare-thumb" title={s.filename}>
            <img src={fileUrl(s)} alt={s.filename} />
            <span className="num">{i + 1}</span>
            {!disabled && (
              <button type="button" className="remove" aria-label={`Remove ${s.filename}`} onClick={() => onChange(sources.filter((x) => x.id !== s.id))}>
                <Icon name="button-close" size={9} />
              </button>
            )}
          </div>
        ))}
        {sources.length < max && !disabled && (
          <DropTarget onFiles={handle} multiple disabled={busy} className="compare-add" label="Add sources">
            {(drag) => (
              <span className={drag ? 'drag' : ''} style={{ display: 'contents' }}>
                <Icon name="plus" size={14} />
                <span>{busy ? 'Reading…' : sources.length < 2 ? 'Add at least one more source' : 'Add source'}</span>
              </span>
            )}
          </DropTarget>
        )}
      </div>
      {error && <p className="help" style={{ color: 'var(--accent)' }}>{error}</p>}
    </div>
  );
}
