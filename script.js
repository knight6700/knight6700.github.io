// Theme toggle (initial theme is set inline in <head> to avoid a flash)
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
  themeMeta.setAttribute('content', theme === 'dark' ? '#0F0F15' : '#EEF0F4');
};
applyTheme(root.getAttribute('data-theme'));
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Mobile menu
const menuBtn = document.getElementById('mobileToggle');
const menu = document.getElementById('mobileMenu');
const setMenu = (open) => {
  menu.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Nav border once the page scrolls
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Highlight the nav link for the section in view
const links = new Map(
  [...document.querySelectorAll('.nav__link')].map((a) => [a.getAttribute('href').slice(1), a])
);
const setActive = (id) => {
  links.forEach((a, key) => a.classList.toggle('is-active', key === id));
};
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
}, { rootMargin: '-45% 0px -50% 0px' });
links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
// On tall screens the page bottoms out before Contact reaches the spy band.
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) setActive('contact');
}, { passive: true });

// Experience line fills as you scroll down and empties as you scroll up.
// The fill tip tracks a mark 60% down the viewport; dots fill once the tip passes them.
const roles = document.querySelector('.roles');
if (roles) {
  const items = [...roles.children];
  // ponytail: no rAF throttle; scroll events already fire at most once per frame.
  const paint = () => {
    const mark = window.innerHeight * 0.6;
    const box = roles.getBoundingClientRect();
    const reached = items.map((li) => li.getBoundingClientRect().top + 12 <= mark); // reads before writes
    const progress = Math.min(1, Math.max(0, (mark - box.top) / box.height));
    roles.style.setProperty('--progress', progress.toFixed(4));
    items.forEach((li, i) => li.classList.toggle('is-reached', reached[i]));
  };
  window.addEventListener('scroll', paint, { passive: true });
  window.addEventListener('resize', paint);
  paint();
}

document.getElementById('year').textContent = new Date().getFullYear();
