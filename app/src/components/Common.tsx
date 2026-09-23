import { Fragment, type ReactNode } from 'react';
import { useApp } from '../store';
import { Select, type Option } from './Select';
import { Icon } from './Icon';
import { formatDate, type Prompt, type RecordItem, type SourceType } from '../api';

export type BadgeColor = 'salmon' | 'orange' | 'green' | 'blue' | 'pink' | 'slate';

export function Badge({ color, children, h32, fill }: { color: BadgeColor; children: ReactNode; h32?: boolean; fill?: boolean }) {
  return <span className={`badge ${color}${h32 ? ' h32' : ''}${fill ? ' fill' : ''}`}><span className="trim">{children}</span></span>;
}

export const sourceTypeBadge = (t: SourceType | string): { color: BadgeColor; label: string } =>
  t === 'Design' ? { color: 'orange', label: 'DESIGN' } : { color: 'salmon', label: 'FOTO' };

export const categoryBadge = (c: string): BadgeColor =>
  ({ Photography: 'salmon', 'Design Studio': 'orange', Compare: 'blue', General: 'slate' } as Record<string, BadgeColor>)[c] || 'slate';

export const useTypeBadge = (u: string): BadgeColor => (u === 'Compare' ? 'green' : 'pink');

export function KindBadge({ record, fill }: { record: RecordItem; fill?: boolean }) {
  return <Badge color="slate" fill={fill}>{record.kind === 'compare' ? 'COMPARE' : 'FEEDBACK'}</Badge>;
}

/** Minimal inline markdown: **bold**, *italic*, and leading #-headings, rendered in the output typeface. */
export function Markdown({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => {
        const heading = line.match(/^\s{0,3}#{1,6}\s+(.*)$/);
        const content = heading ? heading[1] : line;
        return (
          <Fragment key={i}>
            {heading ? <strong>{inline(content)}</strong> : inline(content)}
            {i < lines.length - 1 ? '\n' : null}
          </Fragment>
        );
      })}
    </>
  );
}

function inline(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**') || tok.startsWith('__')) out.push(<strong key={k++}>{tok.slice(2, -2)}</strong>);
    else out.push(<em key={k++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

export function ThinkingDots() {
  return <span className="thinking-dots" aria-label="Working">{Array.from({ length: 6 }, (_, i) => <span key={i}>.</span>)}</span>;
}

interface OutputProps {
  status: string;
  text?: string;
  thinking?: boolean;
  error?: string;
  className?: string;
}

export function OutputBox({ status, text, thinking, error, className }: OutputProps) {
  return (
    <div className={`output-box ${className || ''}`} aria-live="polite">
      <div className="output-status">{status}</div>
      {error ? (
        <div className="output-text output-error">{error}</div>
      ) : (
        <div className="output-text">
          {text ? <Markdown text={text} /> : null}
          {thinking && (text ? ' ' : null)}
          {thinking && <ThinkingDots />}
        </div>
      )}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="section-title">
      <div className="section-title-text trim">{children}</div>
      <div className="divider" />
    </div>
  );
}

export function DateRow({ iso }: { iso?: string | null }) {
  return (
    <div className="date-row">
      <Icon name="icon-time" size={14} />
      <span className="trim">{formatDate(iso)}</span>
    </div>
  );
}

export function ProjectSelect({ value, onChange, size, primaryText, placeholder = 'Select Project', disabled }: {
  value: string | null; onChange: (id: string | null) => void; size?: 'h40' | 'h46' | 'h52'; primaryText?: boolean; placeholder?: string; disabled?: boolean;
}) {
  const { projects, openProjectModal } = useApp();
  const options: Option[] = [{ value: '', label: 'No project' }, ...projects.map((p) => ({ value: p.id, label: p.title }))];
  return (
    <Select
      value={value}
      options={options}
      placeholder={placeholder}
      onChange={(v) => onChange(v || null)}
      size={size}
      primaryText={primaryText}
      disabled={disabled}
      ariaLabel="Project link"
      action={{ label: 'New project', onSelect: () => openProjectModal(null, (p) => onChange(p.id)) }}
    />
  );
}

/** Prompt selector options backed by the Prompt Library; prompts matching the task are grouped first. */
export function promptOptions(prompts: Prompt[], opts: { sourceType?: SourceType; useType?: 'Feedback' | 'Compare'; include?: string | null }): Option[] {
  const active = prompts.filter((p) => !p.archived || p.id === opts.include);
  const category = opts.sourceType === 'Design' ? 'Design Studio' : 'Photography';
  const groupOf = (p: Prompt) => {
    if (opts.useType === 'Compare' && (p.useType === 'Compare' || p.category === 'Compare')) return 'Compare';
    if (p.category === category) return category;
    if (p.category === 'General') return 'General';
    return 'Other';
  };
  const order = opts.useType === 'Compare' ? ['Compare', category, 'General', 'Other'] : [category, 'General', 'Other'];
  return order.flatMap((g) => active.filter((p) => groupOf(p) === g).map((p) => ({ value: p.id, label: p.name, group: g })));
}

export function SourceTypeSelect({ value, onChange, placeholder, primaryText, disabled }: {
  value: SourceType | null; onChange: (v: SourceType) => void; placeholder?: string; primaryText?: boolean; disabled?: boolean;
}) {
  return (
    <Select
      value={value}
      placeholder={placeholder}
      options={[{ value: 'Photography', label: 'Photography' }, { value: 'Design', label: 'Design' }]}
      onChange={(v) => onChange(v as SourceType)}
      primaryText={primaryText}
      disabled={disabled}
      ariaLabel="Source type"
    />
  );
}
