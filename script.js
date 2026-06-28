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

  const translations = {
    en: {
      title: 'Akshay — Portfolio',
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.projects': 'Projects',
      'nav.contact': 'Contact',
      'hero.title': "Hi, I'm Akshay",
      'hero.lead': 'I am an International Sales professional with an engineering foundation and a love for simple, user-friendly web design.',
      'hero.learn_more': 'Learn more',
      'hero.location_title': 'Location',
      'hero.location_value': 'Fukuoka, Japan',
      'hero.specialties_title': 'Specialties',
      'hero.specialties_value': 'Sales strategy · B2B communication · Japanese language · Web development',
      'about.title': 'About',
      'about.intro': 'I combine technical training from IIT Gandhinagar with international sales experience in Japan. My work focuses on building trust across cultures, helping businesses grow, and making complex processes easy to understand.',
      'about.background_title': 'Background',
      'about.background_text': "Master's in Materials Science and Engineering from IIT Gandhinagar. Experience in overseas project coordination, technical communication, and customer support.",
      'about.approach_title': 'Approach',
      'about.approach_text': 'I create clear narratives and user-friendly resources, whether I am explaining a product, developing a website, or working with international teams.',
      'experience.title': 'Experience',
      'experience.item1.title': 'International Department',
      'experience.item1.date': 'Apr 2024 – Present · Kuken Kogyo, Fukuoka',
      'experience.item1.text': 'Coordinated global orders and translated technical requirements for overseas cooling tower projects.',
      'experience.item2.title': 'Technical Department',
      'experience.item2.date': 'Apr 2022 – Mar 2024 · Kuken Kogyo, Fukuoka',
      'experience.item2.text': 'Supported component design, production process consistency, and quality control for industrial products.',
      'experience.item3.title': 'Postgraduate Researcher',
      'experience.item3.date': 'Aug 2020 – Apr 2021 · IIT Gandhinagar',
      'experience.item3.text': 'Designed experiments and used data analysis to improve material processing and performance.',
      'skills.title': 'Skills',
      'skills.list.1': 'International sales strategy',
      'skills.list.2': 'Cross-cultural communication',
      'skills.list.3': 'Japanese language proficiency',
      'skills.list.4': 'Web design fundamentals',
      'skills.list.5': 'Technical documentation',
      'projects.title': 'Projects',
      'projects.card1.title': 'Portfolio Refresh',
      'projects.card1.text': 'A clear, responsive personal website to share my story, skills, and contact information.',
      'projects.card2.title': 'Sales Support Toolkit',
      'projects.card2.text': 'Documentation and process templates to streamline communication between Japanese technical teams and overseas customers.',
      'contact.title': 'Contact',
      'contact.line1': 'Reach out to discuss collaborations, website work, or international sales opportunities.',
      'footer.copyright': '© 2026 Akshay',
      'search.placeholder': 'Search the page...',
      'search.button': 'Search'
    },
    ja: {
      title: 'Akshay — ポートフォリオ',
      'nav.home': 'ホーム',
      'nav.about': '自己紹介',
      'nav.projects': 'プロジェクト',
      'nav.contact': '連絡先',
      'hero.title': 'こんにちは、アクシャイです',
      'hero.lead': '私はエンジニアリングの基礎を持つ国際営業のプロフェッショナルで、シンプルで使いやすいウェブデザインを大切にしています。',
      'hero.learn_more': 'もっと見る',
      'hero.location_title': '場所',
      'hero.location_value': '日本・福岡',
      'hero.specialties_title': '得意分野',
      'hero.specialties_value': 'セールス戦略 · B2Bコミュニケーション · 日本語 · Web開発',
      'about.title': '自己紹介',
      'about.intro': 'IITゴンドヒナガルでの技術的訓練と日本での国際営業経験を組み合わせています。私の仕事は、文化を超えた信頼構築、ビジネスの成長支援、複雑なプロセスを分かりやすくすることです。',
      'about.background_title': '背景',
      'about.background_text': 'IITゴンドヒナガルで材料科学・工学の修士号を取得。海外プロジェクト調整、技術コミュニケーション、カスタマーサポートの経験があります。',
      'about.approach_title': 'アプローチ',
      'about.approach_text': '製品の説明、ウェブサイト制作、国際チームとの協働において、分かりやすく使いやすい表現を目指しています。',
      'experience.title': '経歴',
      'experience.item1.title': '国際部',
      'experience.item1.date': 'Apr 2024 – Present · Kuken Kogyo, Fukuoka',
      'experience.item1.text': '海外冷却塔プロジェクトの技術要件を調整し、グローバル受注を管理しました。',
      'experience.item2.title': '技術部',
      'experience.item2.date': 'Apr 2022 – Mar 2024 · Kuken Kogyo, Fukuoka',
      'experience.item2.text': '部品設計、製造プロセスの一貫性、品質管理をサポートしました。',
      'experience.item3.title': '大学院研究員',
      'experience.item3.date': 'Aug 2020 – Apr 2021 · IIT Gandhinagar',
      'experience.item3.text': '実験を設計し、材料処理と性能の改善にデータ分析を活用しました。',
      'skills.title': 'スキル',
      'skills.list.1': '国際営業戦略',
      'skills.list.2': '異文化コミュニケーション',
      'skills.list.3': '日本語力',
      'skills.list.4': 'Webデザイン基礎',
      'skills.list.5': '技術文書作成',
      'projects.title': 'プロジェクト',
      'projects.card1.title': 'ポートフォリオ刷新',
      'projects.card1.text': 'ストーリー、スキル、連絡先を伝える明確でレスポンシブなパーソナルサイト。',
      'projects.card2.title': 'セールス支援ツールキット',
      'projects.card2.text': '日本の技術チームと海外顧客のコミュニケーションを効率化するドキュメントとプロセステンプレート。',
      'contact.title': '連絡',
      'contact.line1': 'コラボ、ウェブ制作、国際営業のご相談はお気軽にどうぞ。',
      'footer.copyright': '© 2026 Akshay',
      'search.placeholder': 'ページ内を検索...',
      'search.button': '検索'
    }
  };

  const languageSelect = document.getElementById('language-select');
  const searchInput = document.getElementById('site-search');

  function translatePage(language) {
    const dictionary = translations[language] || translations.en;
    document.documentElement.lang = language;
    document.title = dictionary.title;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (dictionary[key]) {
        element.textContent = dictionary[key];
      }
    });
    if (searchInput) {
      searchInput.placeholder = dictionary['search.placeholder'];
    }
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
      searchButton.textContent = dictionary['search.button'];
    }
    if (languageSelect) {
      languageSelect.value = language;
    }
  }

  function setLanguage(language) {
    const nextLanguage = translations[language] ? language : 'en';
    localStorage.setItem('site-language', nextLanguage);
    translatePage(nextLanguage);
  }

  const savedLanguage = localStorage.getItem('site-language');
  const defaultLanguage = savedLanguage || (navigator.language.startsWith('ja') ? 'ja' : 'en');
  setLanguage(defaultLanguage);

  if (languageSelect) {
    languageSelect.addEventListener('change', (event) => {
      setLanguage(event.target.value);
    });
  }

  const searchForm = document.getElementById('search-form');
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

    function initSnakeGame() {
      const canvas = document.getElementById('snake-canvas');
      const scoreElement = document.getElementById('snake-score');
      const restartButton = document.getElementById('snake-restart');
      if (!canvas || !canvas.getContext) return;

      const ctx = canvas.getContext('2d');
      const cellSize = 20;
      const cols = 20;
      const rows = 20;
      canvas.width = cols * cellSize;
      canvas.height = rows * cellSize;

      let snake = [];
      let direction = { x: 1, y: 0 };
      let food = { x: 0, y: 0 };
      let score = 0;
      let intervalId = null;
      let isPlaying = false;

      function placeFood() {
        do {
          food = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
          };
        } while (snake.some(cell => cell.x === food.x && cell.y === food.y));
      }

      function resetGame() {
        snake = [
          { x: 9, y: 10 },
          { x: 8, y: 10 },
          { x: 7, y: 10 }
        ];
        direction = { x: 1, y: 0 };
        score = 0;
        isPlaying = true;
        placeFood();
        scoreElement.textContent = score;
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(gameLoop, 100);
      }

      function draw() {
        ctx.fillStyle = '#071029';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0284c7';
        snake.forEach(cell => {
          ctx.fillRect(cell.x * cellSize + 1, cell.y * cellSize + 1, cellSize - 2, cellSize - 2);
        });

        ctx.fillStyle = '#f97316';
        ctx.fillRect(food.x * cellSize + 1, food.y * cellSize + 1, cellSize - 2, cellSize - 2);
      }

      function endGame() {
        isPlaying = false;
        if (intervalId) clearInterval(intervalId);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '600 18px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game over! Press restart to play again.', canvas.width / 2, canvas.height / 2);
      }

      function gameLoop() {
        const nextHead = {
          x: snake[0].x + direction.x,
          y: snake[0].y + direction.y
        };

        const collidedWithWall = nextHead.x < 0 || nextHead.x >= cols || nextHead.y < 0 || nextHead.y >= rows;
        const collidedWithSelf = snake.some(cell => cell.x === nextHead.x && cell.y === nextHead.y);

        if (collidedWithWall || collidedWithSelf) {
          endGame();
          return;
        }

        snake.unshift(nextHead);

        if (nextHead.x === food.x && nextHead.y === food.y) {
          score += 1;
          scoreElement.textContent = score;
          placeFood();
        } else {
          snake.pop();
        }

        draw();
      }

      function handleKeydown(event) {
        if (!isPlaying && event.key === 'r') {
          resetGame();
          return;
        }

        if (!isPlaying) return;

        const nextDirection = { x: direction.x, y: direction.y };
        if (event.key === 'ArrowUp' && direction.y === 0) {
          nextDirection.x = 0;
          nextDirection.y = -1;
        } else if (event.key === 'ArrowDown' && direction.y === 0) {
          nextDirection.x = 0;
          nextDirection.y = 1;
        } else if (event.key === 'ArrowLeft' && direction.x === 0) {
          nextDirection.x = -1;
          nextDirection.y = 0;
        } else if (event.key === 'ArrowRight' && direction.x === 0) {
          nextDirection.x = 1;
          nextDirection.y = 0;
        }

        direction = nextDirection;
      }

      window.addEventListener('keydown', handleKeydown);
      restartButton.addEventListener('click', resetGame);
      resetGame();
    }

    initSnakeGame();
  });
