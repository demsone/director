import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

export interface Option {
  value: string;
  label: string;
  group?: string;
}

interface Props {
  value: string | null;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'h40' | 'h46' | 'h52';
  primaryText?: boolean;
  disabled?: boolean;
  action?: { label: string; onSelect: () => void };
  className?: string;
  ariaLabel?: string;
}

export function useOutsideClose(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);
  return ref;
}

export function Select({ value, options, onChange, placeholder = 'Select', size = 'h46', primaryText, disabled, action, className, ariaLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(-1);
  const ref = useOutsideClose(open, () => setOpen(false));
  const selected = options.find((o) => o.value === value);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const i = options.findIndex((o) => o.value === value);
      setFocus(i);
      requestAnimationFrame(() => listRef.current?.querySelector('.selected')?.scrollIntoView({ block: 'nearest' }));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocus((f) => Math.min(options.length - 1, f + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setFocus((f) => Math.max(0, f - 1)); }
    if (e.key === 'Enter' && focus >= 0) { e.preventDefault(); choose(options[focus].value); }
  };

  let lastGroup: string | undefined;
  const items: ReactNode[] = [];
  options.forEach((o, i) => {
    if (o.group && o.group !== lastGroup) {
      items.push(<div key={`g-${o.group}`} className="flyout-group">{o.group}</div>);
      lastGroup = o.group;
    }
    items.push(
      <button
        key={o.value}
        type="button"
        role="option"
        aria-selected={o.value === value}
        className={`flyout-item${o.value === value ? ' selected' : ''}${i === focus ? ' focus' : ''}`}
        onMouseEnter={() => setFocus(i)}
        onClick={() => choose(o.value)}
      >
        {o.label}
      </button>,
    );
  });

  return (
    <div className={`select ${className || ''}`} ref={ref}>
      <button
        type="button"
        className={`select-trigger ${size}${primaryText ? ' primary-text' : ''}`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className={`select-value${selected ? '' : ' placeholder'}`}>{selected ? selected.label : placeholder}</span>
        <span className="chevron"><Icon name="chevron-down" size={13} /></span>
      </button>
      {open && (
        <div className="flyout" role="listbox" ref={listRef}>
          <div className="flyout-list">
            {items}
            {action && (
              <>
                {options.length > 0 && <div className="flyout-sep" />}
                <button type="button" className="flyout-item" onClick={() => { setOpen(false); action.onSelect(); }}>
                  <span className="ico"><Icon name="plus" size={12} /></span>
                  {action.label}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
