import { NavLink, Outlet, useNavigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';
import { useApp } from '../store';
import { Icon } from './Icon';
import { ProjectModal } from './ProjectModal';

const NAV = [
  { to: '/director', label: 'Director', match: ['/director'] },
  { to: '/design-studio', label: 'Design Studio', match: ['/design-studio'] },
  { to: '/darkroom', label: 'Darkroom', match: ['/darkroom'] },
  { to: '/compare', label: 'Compare', match: ['/compare'] },
  { to: '/projects', label: 'Projects', match: ['/projects'] },
  { to: '/prompts', label: 'Prompts', match: ['/prompts'] },
  { to: '/settings', label: 'Settings', match: ['/settings'] },
];

export function Shell() {
  const { pathname } = useLocation();
  const { projectModal } = useApp();
  return (
    <div className="app">
      <aside className="sidebar">
        <nav className="nav">
          {NAV.map((n) => {
            const active = n.match.some((m) => pathname === m || pathname.startsWith(m + '/'));
            return (
              <NavLink key={n.to} to={n.to} className={`nav-item${active ? ' active' : ''}`}>
                {n.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <Outlet />
      {projectModal && <ProjectModal />}
    </div>
  );
}

export function ModelBar() {
  const { status, settings } = useApp();
  const navigate = useNavigate();
  const online = status?.online;
  const provider = status?.provider || 'Local Server';
  const model = settings?.feedbackModel || status?.model || '';
  const label = status == null
    ? 'CHECKING · ' + provider
    : online
      ? ['ONLINE', provider, model].filter(Boolean).join(' · ')
      : ['OFFLINE', provider].join(' · ');
  return (
    <button
      type="button"
      className="model-bar"
      title={online ? `${status?.endpoint} · ${model}` : status?.error || 'Model server status'}
      onClick={() => navigate('/settings/models')}
    >
      <Icon name={status == null ? 'status-idle' : online ? 'status-active' : 'status-alert'} className="status-dot" size={18} />
      <span className="model-bar-label trim">{label}</span>
    </button>
  );
}

export function TopBar({ back }: { back?: { label: string; onClick: () => void } }) {
  return (
    <div className={`topbar${back ? ' split' : ''}`}>
      {back && (
        <button type="button" className="back-btn" onClick={back.onClick}>
          <Icon name="arrow-left" size={16} />
          <span className="trim">{back.label}</span>
        </button>
      )}
      <ModelBar />
    </div>
  );
}

interface HeaderProps {
  breadcrumb: string;
  title: ReactNode;
  subtitle?: ReactNode;
  tools?: ReactNode;
  toolsWide?: boolean;
  top?: boolean;
}

export function Header({ breadcrumb, title, subtitle, tools, toolsWide, top }: HeaderProps) {
  return (
    <div className={`header${top || subtitle ? ' top' : ''}`}>
      <div className="header-title">
        <div className="breadcrumb trim">{breadcrumb}</div>
        {subtitle ? (
          <div className="header-body">
            {typeof title === 'string' ? <h1 className="h2 trim">{title}</h1> : title}
            <p className="subtitle trim">{subtitle}</p>
          </div>
        ) : typeof title === 'string' ? <h1 className="h2 trim">{title}</h1> : title}
      </div>
      {tools && <div className={`header-tools${toolsWide ? ' wide' : ''}`}>{tools}</div>}
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} type="button" role="tab" aria-selected={t.id === value} className={`tab${t.id === value ? ' active' : ''}`} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
