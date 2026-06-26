// Minimal site script: menu toggle, smooth scroll, theme toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const navList = document.getElementById('nav-list');
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  if (menuBtn && navList) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('open');
    });

    // close menu when a link is clicked
    navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navList.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Theme toggle (light/dark) persisted in localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') root.setAttribute('data-theme', 'dark');

  function updateThemeButton() {
    if (!themeToggle) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      updateThemeButton();
    });
    updateThemeButton();
  }

  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('site-search');
  const pageSections = Array.from(document.querySelectorAll('main section'));

  function clearSearchMatches() {
    pageSections.forEach(section => section.classList.remove('search-match'));
  }

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearSearchMatches();
      const query = searchInput.value.trim().toLowerCase();
      if (!query) return;

      const matches = pageSections.filter(section => section.textContent.toLowerCase().includes(query));
      if (matches.length > 0) {
        matches.forEach(section => section.classList.add('search-match'));
        matches[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    searchInput.addEventListener('input', () => {
      if (!searchInput.value.trim()) {
        clearSearchMatches();
      }
    });
  }
});
