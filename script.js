const projects = [
  {
    title: 'Monkey Game',
    year: '2026',
    summary: 'An interactive browser-based game built with HTML, CSS, and JavaScript, focused on smooth gameplay and dynamic UI updates.',
    tags: ['JavaScript', 'Game Logic', 'Responsive UI'],
    href: 'https://github.com/kartik-009-k/Monkey',
    live: 'https://kartik-009-k.github.io/Monkey/'
  },
  {
    title: 'Shirwal Circle',
    year: '2026',
    summary: 'A responsive local business directory for Shirwal with search, category filtering, business cards, direct contact actions, and easy JSON-based data updates.',
    tags: ['HTML', 'CSS', 'Directory UX'],
    href: 'https://github.com/kartik-009-k/Shirwal'
  },
  {
    title: 'SiteMango',
    year: '2026',
    summary: 'A modern startup website concept positioned around fast, clean, conversion-driven websites for growing businesses.',
    tags: ['Landing Page', 'Branding', 'Frontend'],
    href: 'https://github.com/kartik-009-k/SiteMango'
  },
  {
    title: 'Voice-Driven Calculator',
    year: 'Early build',
    summary: 'A voice-enabled calculator made with MIT App Inventor, designed with both voice input and spoken output while supporting high-precision calculations.',
    tags: ['MIT App Inventor', 'Voice UX', 'Utility App']
  }
];

const copyEl = document.getElementById('project-copy');
const previewEl = document.getElementById('project-preview');
const prevButton = document.getElementById('prev-project');
const nextButton = document.getElementById('next-project');
let activeIndex = 0;

function renderProjects() {
  const project = projects[activeIndex];
  copyEl.innerHTML = `
    <span class="project-year">${project.year}</span>
    <h3>${project.title}</h3>
    <p>${project.summary}</p>
    <div class="tag-row">${project.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
    <div class="action-row">
      ${project.href ? `<a href="${project.href}" target="_blank" rel="noreferrer">Source ↗</a>` : ''}
      ${project.live ? `<a href="${project.live}" target="_blank" rel="noreferrer">Live demo ↗</a>` : ''}
    </div>
  `;

  previewEl.innerHTML = projects
    .map(
      (item, index) => `
        <button type="button" class="preview-card ${index === activeIndex ? 'preview-card--active' : ''}" data-index="${index}">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <strong>${item.title}</strong>
          <small>${item.tags[0]}</small>
        </button>
      `
    )
    .join('');

  previewEl.querySelectorAll('[data-index]').forEach((button) => {
    button.addEventListener('click', () => {
      activeIndex = Number(button.dataset.index);
      renderProjects();
    });
  });
}

prevButton.addEventListener('click', () => {
  activeIndex = (activeIndex - 1 + projects.length) % projects.length;
  renderProjects();
});

nextButton.addEventListener('click', () => {
  activeIndex = (activeIndex + 1) % projects.length;
  renderProjects();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll('.reveal-on-scroll').forEach((element) => observer.observe(element));
renderProjects();
