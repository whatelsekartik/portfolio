const loader = document.querySelector('.loader');
const cursorGlow = document.querySelector('.cursor-glow');
const reveals = document.querySelectorAll('.reveal');

window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('is-hidden'), 1700);
});

window.addEventListener('mousemove', (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
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

reveals.forEach((item) => observer.observe(item));
