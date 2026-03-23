'use client';

import { useMemo, useState } from 'react';

export default function ProjectCarousel({ projects }) {
  const [active, setActive] = useState(0);
  const currentProject = useMemo(() => projects[active], [projects, active]);

  const go = (direction) => {
    setActive((current) => (current + direction + projects.length) % projects.length);
  };

  return (
    <div className="carousel-shell">
      <div className="carousel-header">
        <div>
          <p className="eyebrow">Featured work</p>
          <h2>Project carousel</h2>
        </div>
        <div className="carousel-controls">
          <button type="button" onClick={() => go(-1)} aria-label="Previous project">
            ←
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next project">
            →
          </button>
        </div>
      </div>

      <div className="carousel-stage">
        <div className="carousel-copy">
          <span className="project-year">{currentProject.year}</span>
          <h3>{currentProject.title}</h3>
          <p>{currentProject.summary}</p>
          <div className="tag-row">
            {currentProject.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="action-row">
            {currentProject.href ? (
              <a href={currentProject.href} target="_blank" rel="noreferrer">
                Source ↗
              </a>
            ) : null}
            {currentProject.live ? (
              <a href={currentProject.live} target="_blank" rel="noreferrer" className="ghost-link">
                Live demo ↗
              </a>
            ) : null}
          </div>
        </div>

        <div className="carousel-preview" aria-live="polite">
          {projects.map((project, index) => (
            <button
              type="button"
              key={project.title}
              className={`preview-card ${index === active ? 'preview-card--active' : ''}`}
              onClick={() => setActive(index)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{project.title}</strong>
              <small>{project.tags[0]}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
