import { useEffect, useRef, useState } from 'react';
import { useApp, sendChat, type ChatContext } from '../store';
import { uid, type ChatMessage } from '../api';
import { Icon } from './Icon';
import { useOutsideClose } from './Select';

interface Props {
  messages: ChatMessage[];
  setMessages: (fn: (m: ChatMessage[]) => ChatMessage[]) => void;
  context: ChatContext | null;
  model: string;
  onModelChange: (m: string) => void;
  placeholder?: string;
}

export function AskDirector({ messages, setMessages, context, model, onModelChange, placeholder }: Props) {
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(200, ta.scrollHeight) + 'px';
  }, [draft]);

  const run = async (history: ChatMessage[]) => {
    if (!context) return;
    setBusy(true);
    try {
      await sendChat(context, history, model, setMessages);
    } finally {
      setBusy(false);
    }
  };

  const send = () => {
    const text = draft.trim();
    if (!text || busy || !context) return;
    let base = messages;
    if (editingId) {
      const idx = messages.findIndex((m) => m.id === editingId);
      if (idx >= 0) base = messages.slice(0, idx);
      setEditingId(null);
    }
    const history = [...base, { id: uid(), role: 'user' as const, content: text, createdAt: new Date().toISOString() }];
    setDraft('');
    run(history);
  };

  const regenerate = (msg: ChatMessage) => {
    if (busy) return;
    const idx = messages.findIndex((m) => m.id === msg.id);
    if (idx < 0) return;
    // For a reply, regenerate from the question before it; for a question, resend it.
    const cut = msg.role === 'assistant' ? idx : idx + 1;
    const history = messages.slice(0, cut);
    if (!history.length || history[history.length - 1].role !== 'user') return;
    run(history);
  };

  const edit = (msg: ChatMessage) => {
    setDraft(msg.content);
    if (msg.role === 'user') setEditingId(msg.id);
    taRef.current?.focus();
  };

  const copy = async (msg: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopied(msg.id);
      setTimeout(() => setCopied(null), 1200);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <section className="ask" aria-label="Ask Director">
      <div className="ask-bar">Ask Director</div>
      {messages.length > 0 && (
        <div className="thread">
          {messages.map((m) => (
            <div key={m.id} className={`msg ${m.role}`}>
              <div className="msg-label">{m.role === 'user' ? 'You' : 'Director'}</div>
              <div className={`msg-body${m.error ? ' error' : ''}`}>
                {m.content || (busy ? <span className="thinking-dots">{Array.from({ length: 6 }, (_, i) => <span key={i}>.</span>)}</span> : '')}
              </div>
              <div className="msg-tools">
                <button type="button" className="msg-tool" title={copied === m.id ? 'Copied' : 'Copy'} onClick={() => copy(m)} disabled={!m.content}>
                  <Icon name={copied === m.id ? 'tiny-dot' : 'copy'} size={12} />
                </button>
                <button type="button" className="msg-tool" title="Edit" onClick={() => edit(m)} disabled={busy || !m.content}>
                  <Icon name="pencil" size={12} />
                </button>
                <button type="button" className="msg-tool" title="Regenerate" onClick={() => regenerate(m)} disabled={busy}>
                  <Icon name="refresh" size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Composer
        value={draft}
        onChange={setDraft}
        onSend={send}
        busy={busy}
        disabled={!context}
        placeholder={editingId ? 'Edit your message…' : placeholder || 'Ask a follow-up question…'}
        model={model}
        onModelChange={onModelChange}
        taRef={taRef}
        onClear={() => { if (!busy) { setMessages(() => []); setEditingId(null); } }}
        onEditLast={() => {
          const last = [...messages].reverse().find((m) => m.role === 'user');
          if (last) edit(last);
        }}
        hasMessages={messages.length > 0}
      />
    </section>
  );
}

interface ComposerProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  busy: boolean;
  disabled: boolean;
  placeholder: string;
  model: string;
  onModelChange: (m: string) => void;
  taRef: React.RefObject<HTMLTextAreaElement | null>;
  onClear: () => void;
  onEditLast: () => void;
  hasMessages: boolean;
}

function Composer({ value, onChange, onSend, busy, disabled, placeholder, model, onModelChange, taRef, onClear, onEditLast, hasMessages }: ComposerProps) {
  const { prompts } = useApp();
  const [menu, setMenu] = useState<'none' | 'add' | 'prompts'>('none');
  const addRef = useOutsideClose(menu !== 'none', () => setMenu('none'));

  const insertPrompt = (body: string) => {
    onChange(value ? `${value}\n\n${body}` : body);
    setMenu('none');
    taRef.current?.focus();
  };

  return (
    <div className="composer">
      <textarea
        ref={taRef}
        rows={1}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            onSend();
          }
        }}
        aria-label="Message Director"
      />
      <div className="composer-bar">
        <div ref={addRef} style={{ position: 'relative' }}>
          <button type="button" className="composer-add" title="More" onClick={() => setMenu((m) => (m === 'none' ? 'add' : 'none'))} disabled={disabled}>
            <Icon name="plus" size={16} />
          </button>
          {menu === 'add' && (
            <div className="flyout add-menu">
              <div className="flyout-list" style={{ gap: 8 }}>
                <button type="button" className="flyout-item" onClick={() => setMenu('prompts')}>
                  <span className="ico"><Icon name="plus" size={12} /></span>Insert saved prompt
                </button>
                <button type="button" className="flyout-item" onClick={() => { setMenu('none'); onEditLast(); }} disabled={!hasMessages}>
                  <span className="ico"><Icon name="pencil" size={13} /></span>Edit last message
                </button>
                <button type="button" className="flyout-item" onClick={() => { setMenu('none'); onClear(); }} disabled={!hasMessages || busy}>
                  <span className="ico"><Icon name="bin" size={13} /></span>Clear conversation
                </button>
              </div>
            </div>
          )}
          {menu === 'prompts' && (
            <div className="flyout add-menu" style={{ width: 320 }}>
              <div className="flyout-list">
                {prompts.filter((p) => !p.archived).map((p) => (
                  <button key={p.id} type="button" className="flyout-item" onClick={() => insertPrompt(p.body)}>{p.name}</button>
                ))}
              </div>
            </div>
          )}
        </div>
        <ModelSelector value={model} onChange={onModelChange} />
        <button type="button" className="enter-btn" onClick={onSend} disabled={busy || disabled || !value.trim()} aria-label="Send">
          <Icon name="arrow-up" size={13} />
        </button>
      </div>
    </div>
  );
}

export function ModelSelector({ value, onChange }: { value: string; onChange: (m: string) => void }) {
  const { status, settings } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));
  const models = status?.models || [];
  const current = value || settings?.feedbackModel || status?.model || '';
  return (
    <div className="model-select" ref={ref}>
      <button type="button" className="model-select-btn" onClick={() => setOpen((o) => !o)} title={current || 'Model'}>
        <span>{current || (status?.online === false ? 'Offline' : 'Model')}</span>
        <span className="chevron"><Icon name="chevron-down" size={13} /></span>
      </button>
      {open && (
        <div className="flyout model-menu">
          <div className="flyout-list" style={{ gap: 4 }}>
            {models.length === 0 && <div className="flyout-item" style={{ cursor: 'default' }}>No models available</div>}
            {models.map((m) => (
              <button key={m} type="button" className={`flyout-item${m === current ? ' selected' : ''}`} onClick={() => { onChange(m); setOpen(false); }}>
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
