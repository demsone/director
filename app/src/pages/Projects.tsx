import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../store';
import { api, type Project } from '../api';
import { TopBar, Header } from '../components/Shell';
import { Icon } from '../components/Icon';
import { useOutsideClose } from '../components/Select';

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  const { openProjectModal, reloadProjects } = useApp();
  const [menu, setMenu] = useState(false);
  const ref = useOutsideClose(menu, () => setMenu(false));

  const remove = async () => {
    setMenu(false);
    if (!window.confirm(`Delete the project “${project.title}”? Linked feedback and comparisons stay in their libraries.`)) return;
    await api.del(`/api/projects/${project.id}`);
    reloadProjects();
  };

  return (
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">{project.title}</h3>
        <div ref={ref} style={{ position: 'relative' }}>
          <button type="button" className="more-btn" aria-label="Project actions" onClick={() => setMenu((m) => !m)}>
            <Icon name="three-dots" size={13} />
          </button>
          {menu && (
            <div className="flyout" style={{ right: 0, top: 28 }}>
              <div className="flyout-list" style={{ gap: 8 }}>
                <button type="button" className="flyout-item" onClick={() => { setMenu(false); navigate(`/projects/${project.id}`); }}>
                  <span className="ico"><Icon name="view" size={14} /></span>View project
                </button>
                <button type="button" className="flyout-item" onClick={() => { setMenu(false); openProjectModal(project); }}>
                  <span className="ico"><Icon name="pencil" size={13} /></span>Edit project
                </button>
                <button type="button" className="flyout-item" onClick={remove}>
                  <span className="ico"><Icon name="bin" size={13} /></span>Delete project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="card-desc l4">{project.description || `${project.type} project · ${project.feedbackCount} feedback · ${project.compareCount} comparisons`}</p>
      <div>
        <button type="button" className="btn small" style={{ width: 121, padding: 0 }} onClick={() => navigate(`/projects/${project.id}`)}>View project</button>
      </div>
    </div>
  );
}

export default function Projects() {
  const navigate = useNavigate();
  const { projects, openProjectModal } = useApp();
  return (
    <main className="main">
      <div className="page stack-36">
        <TopBar back={{ label: 'Back to previous', onClick: () => navigate(-1) }} />
        <Header
          breadcrumb="Director / Projects"
          title="Projects"
          tools={<button type="button" className="btn" style={{ minWidth: 140 }} onClick={() => openProjectModal(null, (p) => navigate(`/projects/${p.id}`))}>Add new project</button>}
        />
        {projects.length === 0 ? (
          <div className="empty">
            <div className="output-status">No projects yet</div>
            <p>Create a project to organise related work.</p>
          </div>
        ) : (
          <div className="card-grid">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </main>
  );
}
