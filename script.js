// Minimal site script: menu toggle, smooth scroll
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const isDarkMode = localStorage.getItem('theme') === 'dark' || 
                       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      });
    }
  }
  
  initTheme();

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

  function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;

    const lines = [
      'International Sales Engineer',
      'Mechanical Engineer',
      'AI Engineer (Learning)',
      'Japanese Speaker'
    ];

    let currentLine = 0;
    let currentChar = 0;
    let deleting = false;

    function type() {
      const text = lines[currentLine];
      typewriterElement.textContent = text.slice(0, currentChar);

      if (!deleting && currentChar < text.length) {
        currentChar += 1;
        setTimeout(type, 90);
      } else if (!deleting) {
        deleting = true;
        setTimeout(type, 1400);
      } else if (deleting && currentChar > 0) {
        currentChar -= 1;
        setTimeout(type, 45);
      } else {
        deleting = false;
        currentLine = (currentLine + 1) % lines.length;
        setTimeout(type, 250);
      }
    }

    type();
  }

  initTypewriter();

  // Initialize visitor counter
  function initVisitorCounter() {
    const visitorCount = document.getElementById('visitor-count');
    if (!visitorCount) return;

    let count = parseInt(localStorage.getItem('visitorCount') || '0');
    count += 1;
    localStorage.setItem('visitorCount', count);
    visitorCount.textContent = count.toLocaleString();
  }

  initVisitorCounter();

  const githubUsername = 'akshay01123';

  function formatUtcDate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function calculateStreaks(contributions) {
    const oneDayMs = 24 * 60 * 60 * 1000;
    const activeDates = contributions
      .filter(item => Number(item.count) > 0 && item.date)
      .map(item => item.date)
      .sort((first, second) => first.localeCompare(second));

    if (activeDates.length === 0) {
      return { current: 0, longest: 0 };
    }

    const activeDateSet = new Set(activeDates);

    let longest = 0;
    let running = 0;
    let previousDate = null;

    activeDates.forEach(dateString => {
      const currentDate = new Date(`${dateString}T00:00:00Z`);
      if (!previousDate) {
        running = 1;
      } else {
        const diff = currentDate.getTime() - previousDate.getTime();
        running = diff === oneDayMs ? running + 1 : 1;
      }
      if (running > longest) longest = running;
      previousDate = currentDate;
    });

    let current = 0;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    let cursor = new Date(today);

    if (!activeDateSet.has(formatUtcDate(cursor))) {
      cursor = new Date(cursor.getTime() - oneDayMs);
    }

    while (activeDateSet.has(formatUtcDate(cursor))) {
      current += 1;
      cursor = new Date(cursor.getTime() - oneDayMs);
    }

    return { current, longest };
  }

  async function fetchGitHubContributionStats() {
    const streakLine = document.getElementById('github-streak-line');
    const container = document.getElementById('github-contrib-grid');
    if (!streakLine || !container) return;

    try {
      const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=last`);
      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const contributions = Array.isArray(data.contributions) ? data.contributions : [];
      const { current, longest } = calculateStreaks(contributions);

      // Render contribution grid
      renderContribGrid(contributions);

        // Build a set of active dates (UTC YYYY-MM-DD strings)
        const activeDatesSet = new Set(contributions.filter(item => Number(item.count) > 0 && item.date).map(item => item.date));
        const todayUtc = new Date();
        todayUtc.setUTCHours(0,0,0,0);

        function countActiveDays(daysBack) {
          const start = new Date(todayUtc);
          start.setUTCDate(start.getUTCDate() - (daysBack - 1)); // inclusive range
          let count = 0;
          for (let d = new Date(start); d <= todayUtc; d.setUTCDate(d.getUTCDate() + 1)) {
            if (activeDatesSet.has(formatUtcDate(d))) count++;
          }
          return count;
        }

        const active7 = countActiveDays(7);
        const active30 = countActiveDays(30);
        const active3mo = countActiveDays(92);
        const active6mo = countActiveDays(183);

        // Merge streak info into the main stats line so all GitHub stats appear on one line
        const statsLine = document.getElementById('github-stats-line');
        const streakText = `Streak: ${current} day${current === 1 ? '' : 's'} (longest ${longest} day${longest === 1 ? '' : 's'})`;
        if (statsLine) {
          const base = statsLine.textContent && statsLine.textContent.trim() ? statsLine.textContent.trim() + ' · ' : '';
          statsLine.textContent = base + streakText;
        }
        // hide the old separate streak line if present
        if (streakLine) {
          streakLine.style.display = 'none';
        }

        const activityGrid = document.getElementById('github-activity-grid');
        if (activityGrid) {
          activityGrid.innerHTML = '';
          const ranges = [
            { key: '7d', count: active7, total: 7 },
            { key: '30d', count: active30, total: 30 },
            { key: '3mo', count: active3mo, total: 92 },
            { key: '6m', count: active6mo, total: 183 }
          ];

          // Compose a single-line summary for the activity ranges and place it in the main stats line
          try {
            const rangesSummary = ranges.map(r => {
              const pct = r.total > 0 ? Math.round((r.count / r.total) * 100) : 0;
              // shorten keys for display: 30d -> 1m, 3mo -> 3m
              const label = r.key === '3mo' ? '3m' : (r.key === '30d' ? '1m' : r.key);
              return `${label}: ${r.count}/${r.total} (${pct}%)`;
            }).join(' · ');

            // Put the ranges summary on the dedicated activity line (keep stats/streak separate)
            const activityLineEl = document.getElementById('github-activity-line');
            if (activityLineEl) {
              activityLineEl.textContent = rangesSummary;
            }
            // Also populate the hero sidebar card (same format as other hero cards)
            const heroActEl = document.getElementById('github-activity-hero-text');
            if (heroActEl) {
              heroActEl.innerHTML = rangesSummary.split(' · ').join('<br>');
            }
          } catch (err) {
            console.warn('Failed to render single-line activity summary', err);
          }

          function renderRangeCards(visibleKey) {
            activityGrid.innerHTML = '';
            const toRender = visibleKey ? ranges.filter(r => r.key === visibleKey) : ranges;
            toRender.forEach(r => {
              const pct = r.total > 0 ? Math.round((r.count / r.total) * 100) : 0;
              const card = document.createElement('div');
              card.className = 'activity-card';
              if (visibleKey && r.key === visibleKey) card.classList.add('selected');

              const label = document.createElement('div');
              label.className = 'activity-label';
              // display shorter labels for readability
              const displayLabel = r.key === '3mo' ? '3m' : (r.key === '30d' ? '1m' : r.key);
              label.textContent = displayLabel;
              card.appendChild(label);

              const value = document.createElement('div');
              value.className = 'activity-value';
              value.textContent = `${r.count}/${r.total} · ${pct}%`;
              card.appendChild(value);

              const sub = document.createElement('div');
              sub.className = 'activity-sub';
              sub.textContent = 'Active days';
              card.appendChild(sub);

              const bar = document.createElement('div');
              bar.className = 'activity-bar';
              const fill = document.createElement('div');
              fill.className = 'activity-fill';
              // set a small visible baseline then animate to percent
              const minVisible = 4; // percent
              const targetPct = Math.min(100, Math.max(0, pct));
              fill.style.width = Math.max(minVisible, targetPct) + '%';
              fill.style.minWidth = '6px';
              bar.appendChild(fill);
              card.appendChild(bar);

              activityGrid.appendChild(card);

              // ensure grid is visible
              if (activityGrid.style.display === 'none') activityGrid.style.display = '';

              // animate fill slightly from baseline to exact value for effect
              requestAnimationFrame(() => {
                fill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
              });
            });
          }

          // initial render: show all ranges
          renderRangeCards();

          // wire range buttons (if present)
          const rangeButtons = document.querySelectorAll('.github-range-controls .range-btn');
          if (rangeButtons && rangeButtons.length) {
            rangeButtons.forEach(btn => {
              btn.addEventListener('click', () => {
                const key = btn.dataset.range;
                // toggle active classes and aria-pressed
                rangeButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
                btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
                // when clicked, render only the selected range card
                renderRangeCards(key);
              });
            });
          }
        }
    } catch (error) {
      console.error('GitHub stats fetch failed:', error);
      if (streakLine) {
        streakLine.textContent = 'Streak stats unavailable';
      }
    }
  }

  async function fetchGitHubCounts() {
    const statsLine = document.getElementById('github-stats-line');

    try {
      const userResponse = await fetch(`https://api.github.com/users/${githubUsername}`);
      if (!userResponse.ok) throw new Error('GitHub user request failed');
      const userData = await userResponse.json();

      // Populate hero profile avatar if present
      try {
        const avatarEl = document.getElementById('profile-avatar');
        if (avatarEl && userData && userData.avatar_url) {
          avatarEl.src = userData.avatar_url;
          avatarEl.alt = userData.name || githubUsername;
          avatarEl.loading = 'lazy';
          avatarEl.style.visibility = 'visible';
        }
      } catch (err) {
        console.warn('Setting profile avatar failed', err);
      }

      const reposResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`);
      if (!reposResponse.ok) throw new Error('GitHub repos request failed');
      const reposData = await reposResponse.json();

      const totalStars = reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

      let commits = '--';
      let commitsThisMonth = '--';
      try {
        const commitResponse = await fetch(`https://api.github.com/search/commits?q=author:${githubUsername}`, {
          headers: { Accept: 'application/vnd.github.cloak-preview' }
        });
        if (commitResponse.ok) {
          const commitData = await commitResponse.json();
          commits = commitData.total_count || 0;
        }

        // Calculate commits for the current month
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const monthStart = `${year}-${month}-01`;
        const today = `${year}-${month}-${day}`;

        const monthQuery = `author:${githubUsername} committer-date:${monthStart}..${today}`;
        const monthResponse = await fetch(`https://api.github.com/search/commits?q=${encodeURIComponent(monthQuery)}`, {
          headers: { Accept: 'application/vnd.github.cloak-preview' }
        });
        if (monthResponse.ok) {
          const monthData = await monthResponse.json();
          commitsThisMonth = monthData.total_count || 0;
        }
      } catch (commitError) {
        commits = commits === '--' ? '--' : commits;
        commitsThisMonth = commitsThisMonth === '--' ? '--' : commitsThisMonth;
      }

      const repos = userData.public_repos || reposData.length || '--';
      const followers = userData.followers || '--';
      const stars = totalStars || '--';
      const commitMonthText = (commits !== '--' && commitsThisMonth !== '--') ? `${commits} (+${commitsThisMonth} this month)` : commits;
      let lineText = `Repos: ${repos} · Commits: ${commitMonthText} · Followers: ${followers} · Stars: ${stars}`;

      // Attempt to fetch LOC stats generated by GitHub Action at /stats/loc.json
      try {
        const locResp = await fetch('/stats/loc.json');
        if (locResp.ok) {
          const locData = await locResp.json();
          if (locData && locData.SUM && typeof locData.SUM.code === 'number') {
            lineText += ` · LOC: ${locData.SUM.code.toLocaleString()}`;
          }
        }
      } catch (locErr) {
        // silently ignore; stats remain without LOC
      }

      if (statsLine) statsLine.textContent = lineText;

      // Fetch languages and latest repo
      await fetchGitHubLanguagesAndLatestRepo(reposData);
    } catch (error) {
      console.error('GitHub stats fetch failed:', error);
      if (statsLine) statsLine.textContent = 'GitHub stats unavailable';
    }
  }

  async function fetchGitHubLanguagesAndLatestRepo(reposData) {
    const languagesContainer = document.getElementById('github-languages');
    const latestRepoContainer = document.getElementById('github-latest-repo');

    if (!languagesContainer || !latestRepoContainer) return;

    try {
      const languageMap = {};
      let latestRepo = null;
      let latestDate = null;

      for (const repo of reposData) {
        if (repo.language) {
          languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
        }

        const pushedAt = new Date(repo.pushed_at || 0);
        if (!latestDate || pushedAt > latestDate) {
          latestDate = pushedAt;
          latestRepo = repo;
        }
      }

      // Display languages
      if (Object.keys(languageMap).length > 0) {
        const sortedLanguages = Object.entries(languageMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8);

        languagesContainer.innerHTML = sortedLanguages
          .map(([lang]) => `<span class="github-language-badge">${lang}</span>`)
          .join('');
      } else {
        languagesContainer.textContent = 'No languages detected.';
      }

      // Display latest repo
      if (latestRepo) {
        const description = latestRepo.description ? `<p>${latestRepo.description}</p>` : '';
        latestRepoContainer.innerHTML = `
          <a href="${latestRepo.html_url}" target="_blank" rel="noopener noreferrer">${latestRepo.name}</a>
          ${description}
        `;
      } else {
        latestRepoContainer.textContent = 'No repositories found.';
      }
    } catch (error) {
      console.error('GitHub languages/latest repo fetch failed:', error);
      languagesContainer.textContent = 'Languages unavailable';
      latestRepoContainer.textContent = 'Latest repo unavailable';
    }
  }

  fetchGitHubCounts();
  
  // Render contribution grid with per-day hover tooltips
  function renderContribGrid(contributions) {
    const container = document.getElementById('github-contrib-grid');
    const tooltip = document.getElementById('contrib-tooltip');
    if (!container) return;
    
    if (!Array.isArray(contributions) || contributions.length === 0) {
      return;
    }

    container.innerHTML = '';
    container.setAttribute('aria-hidden', 'false');


    const wrapper = container.parentElement || document.body;

    function positionTooltipFromEvent(ev) {
      if (!tooltip) return;
      const wrapRect = wrapper.getBoundingClientRect();
      const left = ev.clientX - wrapRect.left;
      const top = ev.clientY - wrapRect.top;
      tooltip.style.left = (left) + 'px';
      tooltip.style.top = (top - 14) + 'px';
    }

    contributions.forEach(item => {
      const count = Number(item.count) || 0;
      const date = item.date || '';
      const day = document.createElement('div');
      day.className = 'contrib-day';
      day.dataset.count = String(count);
      day.dataset.date = date;
      day.tabIndex = 0;
      day.setAttribute('role', 'button');
      day.setAttribute('aria-label', `${count} commit${count === 1 ? '' : 's'} on ${date}`);

      const level = count === 0 ? 0 : (count >= 8 ? 4 : (count >= 5 ? 3 : (count >= 3 ? 2 : 1)));
      day.style.background = `var(--contrib-${level})`;

      day.addEventListener('mouseenter', (e) => {
        if (!tooltip) return;
        tooltip.textContent = `${count} commit${count === 1 ? '' : 's'} on ${date}`;
        tooltip.style.display = 'block';
        tooltip.setAttribute('aria-hidden', 'false');
        positionTooltipFromEvent(e);
      });
      day.addEventListener('mousemove', (e) => positionTooltipFromEvent(e));
      day.addEventListener('mouseleave', () => {
        if (!tooltip) return;
        tooltip.style.display = 'none';
        tooltip.setAttribute('aria-hidden', 'true');
      });

      day.addEventListener('focus', (e) => {
        if (!tooltip) return;
        tooltip.textContent = `${count} commit${count === 1 ? '' : 's'} on ${date}`;
        tooltip.style.display = 'block';
        tooltip.setAttribute('aria-hidden', 'false');
        // position tooltip above the focused element
        const rect = day.getBoundingClientRect();
        const wrapRect = wrapper.getBoundingClientRect();
        tooltip.style.left = (rect.left - wrapRect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - wrapRect.top - 10) + 'px';
      });
      day.addEventListener('blur', () => {
        if (!tooltip) return;
        tooltip.style.display = 'none';
        tooltip.setAttribute('aria-hidden', 'true');
      });

      container.appendChild(day);
    });
  }

  // Initialize project thumbnails: lazy-load images and add hover overlay
  function initProjectThumbnails() {
    const thumbs = document.querySelectorAll('.bento-thumb');
    if (!thumbs || thumbs.length === 0) return;

    thumbs.forEach(thumb => {
      const card = thumb.closest('.bento-card');
      const src = card?.dataset?.thumb || '';
      // create overlay from card techs + link
      const overlay = document.createElement('div');
      overlay.className = 'bento-thumb-overlay';

      const techsWrap = document.createElement('div');
      techsWrap.className = 'thumb-techs';
      card.querySelectorAll('.bento-tech').forEach(t => {
        const clone = t.cloneNode(true);
        clone.className = 'thumb-tech';
        techsWrap.appendChild(clone);
      });
      overlay.appendChild(techsWrap);

      const link = card.querySelector('.bento-link');
      if (link) {
        const cta = link.cloneNode(true);
        cta.className = 'thumb-cta';
        overlay.appendChild(cta);
      }

      thumb.appendChild(overlay);

      if (!src) {
        thumb.classList.add('empty');
        const title = card.querySelector('.bento-card-header h3')?.innerText || '';
        thumb.textContent = title.split(' ').slice(0,2).join(' ');
        return;
      }
    });

    // lazy-load using IntersectionObserver
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const card = el.closest('.bento-card');
        const src = card?.dataset?.thumb;
        if (src) {
          // Prefetch image and validate its shape/size to avoid using small square avatars
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = function() {
            const w = img.naturalWidth || 0;
            const h = img.naturalHeight || 1;
            const ratio = w / h;
            // Treat likely avatar images as unwanted if too small or near-square
            // stricter checks to avoid using small square avatars as thumbnails
            const isSmall = w < 400; // require reasonable resolution
            const isLandscape = ratio >= 1.25; // prefer wider images (OG images are typically landscape)
            if (!isSmall && isLandscape) {
              el.style.backgroundImage = `url('${src}')`;
              el.classList.add('loaded');
              card.classList.add('thumb-loaded');
            } else {
              // mark as empty to show fallback
              el.classList.add('empty');
            }
            obs.unobserve(el);
          };
          img.onerror = function() {
            el.classList.add('empty');
            obs.unobserve(el);
          };
          img.src = src;
        } else {
          el.classList.add('empty');
          obs.unobserve(el);
        }
      });
    }, { rootMargin: '200px 0px' });

    document.querySelectorAll('.bento-thumb:not(.empty)').forEach(t => io.observe(t));
  }

  initProjectThumbnails();
  fetchGitHubContributionStats();
  initProjectFilters();

  function initProjectFilters() {
    const buttons = document.querySelectorAll('.project-filter-btn');
    const cards = document.querySelectorAll('.projects-bento-grid article.bento-card');
    if (!buttons.length || !cards.length) return;

    function applyFilter(filter) {
      cards.forEach(card => {
        const cats = (card.dataset.category || '').split(/\s+/).filter(Boolean);
        if (filter === 'all' || cats.includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.filter || 'all');
      });
    });
    // initialize
    applyFilter(document.querySelector('.project-filter-btn.active')?.dataset.filter || 'all');
  }

  // Load course progress from stats/course_progress.json (fallback to 31%)
  (function loadCourseProgress(){
    const bar = document.getElementById('course-progress-bar');
    const text = document.getElementById('course-progress-text');
    if(!bar || !text) return;
    fetch('/stats/course_progress.json').then(r=>{
      if(!r.ok) throw new Error('no progress file');
      return r.json();
    }).then(data=>{
      const pct = Number(data.completed) || 0;
      bar.style.width = Math.max(0, Math.min(100, pct)) + '%';
      text.textContent = Math.round(pct) + '%';
      // update linear progress and text
    }).catch(()=>{
      bar.style.width = '31%';
      text.textContent = '31%';
      // fallback: set linear bar and text
    });
  })();

  // Load GitHub activity progress from stats/course_progress.json
  (function loadGitHubActivityProgress(){
    const barEl = document.getElementById('github-progress-fill');
    const labelEl = document.getElementById('github-progress-label');
    if(!barEl || !labelEl) return;
    fetch('/stats/course_progress.json').then(r=>{
      if(!r.ok) throw new Error('no progress file');
      return r.json();
    }).then(data=>{
      const pct = Number(data.completed) || 0;
      const percentage = Math.max(0, Math.min(100, pct));
      barEl.style.width = percentage + '%';
      labelEl.textContent = 'Completion: ' + Math.round(percentage) + '%';
    }).catch(()=>{
      barEl.style.width = '31%';
      labelEl.textContent = 'Completion: 31%';
      // fallback: Prime AI course progress
    });
  })();

  // Project modal logic
  (function initProjectModal(){
    const modal = document.getElementById('project-modal');
    if(!modal) return;
    const panel = modal.querySelector('.modal-panel');
    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-desc');
    const techsEl = document.getElementById('modal-techs');
    const githubEl = document.getElementById('modal-github');
    const demoEl = document.getElementById('modal-demo');

    function openModal(card){
      const title = card.querySelector('.bento-card-header h3')?.innerText || '';
      const desc = card.querySelector('.bento-card-description')?.innerText || '';
      const techNodes = Array.from(card.querySelectorAll('.bento-tech'));
      const linkNode = card.querySelector('.bento-link');
      const href = linkNode?.href || '#';
      titleEl.textContent = title;
      descEl.textContent = desc;
      techsEl.innerHTML = '';
      techNodes.forEach(t=>{
        const s = document.createElement('span');
        s.className = 'bento-tech';
        s.textContent = t.innerText;
        techsEl.appendChild(s);
      });
      githubEl.href = href;
      // If demo link is encoded as data-demo on card, use it
      const demoHref = card.dataset.demo || '';
      if(demoHref){ demoEl.href = demoHref; demoEl.style.display = ''; } else { demoEl.style.display = 'none'; }
      modal.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
      panel.focus && panel.focus();
    }

    function closeModal(){
      modal.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    }

    modal.addEventListener('click', (e)=>{
      if(e.target.dataset.action === 'close' || e.target.classList.contains('modal-overlay')) closeModal();
    });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

    // attach click listeners to project cards
    const projectCards = document.querySelectorAll('.projects-bento-grid .bento-card');
    projectCards.forEach(card=>{
      card.addEventListener('click', (e)=>{
        // ignore clicks on links inside the card
        if(e.target.closest('a')) return;
        // prefer opening the card's primary link (e.g., GitHub) if present
        const linkNode = card.querySelector('.bento-link');
        const href = linkNode ? (linkNode.href || linkNode.getAttribute('data-href')) : '';
        if (href && href.startsWith('http')) {
          // open in new tab
          window.open(href, '_blank', 'noopener');
          // analytics
          const title = card.querySelector('.bento-card-header h3')?.innerText || 'unknown';
          if(window.plausible) window.plausible('Project Click', { props: { project: title } });
          return;
        }
        // fallback: open modal if no external link present
        openModal(card);
        // analytics for modal open
        const title = card.querySelector('.bento-card-header h3')?.innerText || 'unknown';
        if(window.plausible) window.plausible('Project Click', { props: { project: title } });
      });
    });
  })();

  // Analytics: conditional Plausible loader + click tracking
  (function initAnalytics(){
    try{
      const cfg = window.analyticsConfig || {};
      if(!cfg.provider || cfg.provider !== 'plausible' || !cfg.domain) return;

      // inject Plausible script
      if(!document.querySelector('script[data-plausible]')){
        const s = document.createElement('script');
        s.setAttribute('async',''); s.setAttribute('defer','');
        s.setAttribute('data-plausible','');
        s.setAttribute('data-domain', cfg.domain);
        s.src = 'https://plausible.io/js/plausible.js';
        document.head.appendChild(s);
      }

      function plausibleEvent(name, props){
        if(window.plausible) window.plausible(name, { props: props || {} });
      }

      // Track project card clicks (use title)
      document.querySelectorAll('.projects-bento-grid .bento-card').forEach(card=>{
        card.addEventListener('click', (e)=>{
          if(e.target.closest('a')) return; // ignore link clicks
          const title = card.querySelector('.bento-card-header h3')?.innerText || 'unknown';
          plausibleEvent('project_click', { project: title });
        });
      });

      // Track CTAs in hero and project links
      document.querySelectorAll('.hero-actions .btn, .bento-link, .bento-button-secondary').forEach(el=>{
        el.addEventListener('click', (e)=>{
          const label = el.innerText.trim().slice(0,40) || el.getAttribute('aria-label') || 'cta';
          plausibleEvent('cta_click', { label: label });
        });
      });

    }catch(err){ console.warn('Analytics init failed', err); }
  })();

  const translations = {
    en: {
      title: 'Akshay — Portfolio',
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.projects': 'Projects',
      'nav.skills': 'Skills',
      'nav.github': 'GitHub',
      'nav.contact': 'Contact',
      'hero.title': "Hi, I'm Akshay",
      'hero.lead': 'Bilingual global professional with an IIT postgraduate background and 4+ years of experience across manufacturing, engineering, and international business operations in Japan.',
      'hero.learn_more': 'Learn more',
      'hero.location_title': 'Location',
      'hero.location_value': 'Fukuoka, Japan',
      'hero.specialties_title': 'Specialties',
      'hero.specialties_value': 'Project Coordination · Data Analysis · Japanese (JLPT N2) · International Business',
      'about.title': 'About',
      'about.intro': 'Bilingual global professional with an IIT postgraduate background and 4+ years of experience across manufacturing, engineering, and international business operations in Japan. Experienced in coordinating cross-functional teams, managing overseas projects, and supporting data-driven decisions with focus on quality, cost, and delivery.',
      'about.background_title': 'Education',
      'about.background_text': 'M.Tech in Materials Science and Engineering from IIT Gandhinagar (CPI 8.38/10, 2018-20). B.Tech in Production Engineering from Uttarakhand Technical University (76.45%, 2014-18). Strong foundation in data-driven experimentation and technical analysis.',
      'about.approach_title': 'Focus Areas',
      'about.approach_text': 'Bridging technical and business functions through effective cross-cultural communication. Skilled in process improvement, project coordination, and data-driven decision support. Fluent in Japanese (JLPT N2), English, and Hindi with experience working in multicultural teams.',
      'experience.title': 'Experience',
      'experience.item1.title': 'International Sales Engineer',
      'experience.item1.date': 'Kuken Industries, Fukuoka · 2024 – Present',
      'experience.item1.text': 'Manages overseas projects, coordinating between customers, engineering, and production teams across global markets',
      'experience.item2.title': 'Production Engineer',
      'experience.item2.date': 'Kuken Industries, Miyawaka · 2022 – 2024',
      'experience.item2.text': 'Supported component design and production processes, ensuring quality and consistency across manufacturing operations',
      'experience.item3.title': 'Postgraduate Researcher',
      'experience.item3.date': 'IIT Gandhinagar · 2020 – 2021',
      'experience.item3.text': 'Conducted data-driven experiments and applied statistical analysis for performance evaluation in materials science',
      'skills.title': 'Skills',
      'skills.list.1': 'Project Coordination & Stakeholder Alignment',
      'skills.list.2': 'Data Analysis & Excel (Advanced)',
      'skills.list.3': 'Japanese (JLPT N2) · English · Hindi',
      'skills.list.4': 'Python, AutoCAD, SolidWorks',
      'skills.list.5': 'Process Improvement & Quality Management',
      'projects.title': 'Projects',
      'projects.card1.title': 'Portfolio Refresh',
      'projects.card1.text': 'A clear, responsive personal website to share my story, skills, and contact information.',
      'projects.card2.title': 'Sales Support Toolkit',
      'projects.card2.text': 'Documentation and process templates to streamline communication between Japanese technical teams and overseas customers.',
      'contact.title': 'Contact',
      'contact.line1': 'Reach out to discuss collaborations, website work, or international sales opportunities.',
      'footer.copyright': '© 2026 Akshay'
    },
    ja: {
      title: 'Akshay — ポートフォリオ',
      'nav.home': 'ホーム',
      'nav.about': '自己紹介',
      'nav.projects': 'プロジェクト',
      'nav.skills': 'スキル',
      'nav.github': 'GitHub',
      'nav.contact': '連絡先',
      'hero.title': 'こんにちは、アクシャイです',
      'hero.lead': 'IIT大学院の背景と、日本での製造・エンジニアリング・国際ビジネス分野における4年以上の経験を持つバイリンガル・グローバル・プロフェッショナル。',
      'hero.learn_more': 'もっと見る',
      'hero.location_title': '場所',
      'hero.location_value': '日本・福岡',
      'hero.specialties_title': '得意分野',
      'hero.specialties_value': 'プロジェクト調整 · データ分析 · 日本語（JLPT N2） · 国際ビジネス',
      'about.title': '自己紹介',
      'about.intro': 'IIT Gandhinagarの大学院背景と、日本での製造・エンジニアリング・国際ビジネス分野における4年以上の経験を有するバイリンガル・グローバル・プロフェッショナル。クロスファンクショナルチームの調整、海外プロジェクト管理、品質・コスト・納期（QCD）に焦点を当てたデータ駆動型の意思決定支援に精通。',
      'about.background_title': '学歴',
      'about.background_text': 'IIT Gandhinagar材料科学・工学修士（CPI 8.38/10、2018-20年）。Uttarakhand Technical University生産エンジニアリング学士（76.45%、2014-18年）。データ駆動型実験と技術分析の強固な基礎を持つ。',
      'about.approach_title': '重点分野',
      'about.approach_text': '効果的な異文化コミュニケーションを通じた技術とビジネス機能のブリッジング。プロセス改善、プロジェクト調整、データ駆動型意思決定支援に精通。JLPT N2の日本語、英語、ヒンディー語に精通し、多文化チームでの豊富な経験を有する。',
      'experience.title': '経歴',
      'experience.item1.title': '国際営業エンジニア',
      'experience.item1.date': 'Kuken Industries, 福岡 · 2024 – 現在',
      'experience.item1.text': 'グローバル市場の顧客、エンジニアリング、製造チーム間の海外プロジェクト管理を調整',
      'experience.item2.title': '製造エンジニア',
      'experience.item2.date': 'Kuken Industries, 宮若 · 2022 – 2024',
      'experience.item2.text': '部品設計と製造プロセスのサポート、品質と一貫性の確保',
      'experience.item3.title': '大学院研究員',
      'experience.item3.date': 'IIT Gandhinagar · 2020 – 2021',
      'experience.item3.text': 'データ駆動型実験の実施と材料科学における性能評価の統計分析を適用',
      'skills.title': 'スキル',
      'skills.list.1': 'プロジェクト調整・ステークホルダー調整',
      'skills.list.2': 'データ分析・Excel（上級）',
      'skills.list.3': '日本語（JLPT N2）・英語・ヒンディー語',
      'skills.list.4': 'Python, AutoCAD, SolidWorks',
      'skills.list.5': 'プロセス改善・品質管理',
      'projects.title': 'プロジェクト',
      'projects.card1.title': 'ポートフォリオ刷新',
      'projects.card1.text': 'ストーリー、スキル、連絡先を伝える明確でレスポンシブなパーソナルサイト。',
      'projects.card2.title': 'セールス支援ツールキット',
      'projects.card2.text': '日本の技術チームと海外顧客のコミュニケーションを効率化するドキュメントとプロセステンプレート。',
      'contact.title': '連絡',
      'contact.line1': 'コラボ、ウェブ制作、国際営業のご相談はお気軽にどうぞ。',
      'footer.copyright': '© 2026 Akshay'
    },
    hi: {
      title: 'अक्षय — पोर्टफोलियो',
      'nav.home': 'होम',
      'nav.about': 'मेरे बारे में',
      'nav.projects': 'प्रोजेक्ट्स',
      'nav.skills': 'कौशल',
      'nav.github': 'GitHub',
      'nav.contact': 'संपर्क',
      'hero.title': 'नमस्ते, मैं अक्षय हूँ',
      'hero.lead': 'IIT स्नातकोत्तर पृष्ठभूमि और जापान में विनिर्माण, इंजीनियरिंग, और अंतरराष्ट्रीय व्यवसाय में 4+ वर्षों के अनुभव के साथ द्विभाषी वैश्विक पेशेवर।',
      'hero.learn_more': 'और जानें',
      'hero.location_title': 'स्थान',
      'hero.location_value': 'फुकुओका, जापान',
      'hero.specialties_title': 'विशेषताएँ',
      'hero.specialties_value': 'प्रोजेक्ट समन्वय · डेटा विश्लेषण · जापानी (JLPT N2) · अंतरराष्ट्रीय व्यवसाय',
      'about.title': 'मेरे बारे में',
      'about.intro': 'IIT गांधीनगर की स्नातकोत्तर पृष्ठभूमि और जापान में विनिर्माण, इंजीनियरिंग, और अंतरराष्ट्रीय व्यवसाय क्षेत्रों में 4+ वर्षों के अनुभव के साथ द्विभाषी वैश्विक पेशेवर। मैं क्रॉस-फ़ंक्शनल टीमों का समन्वय करने, विदेशी परियोजनाओं का प्रबंधन करने, और गुणवत्ता, लागत, और समय पर ध्यान केंद्रित करते हुए डेटा-आधारित निर्णयों का समर्थन करने में सक्षम हूँ।',
      'about.background_title': 'शिक्षा',
      'about.background_text': 'IIT Gandhinagar से मैटीरियल्स साइंस और इंजीनियरिंग में M.Tech (CPI 8.38/10, 2018-20)। Uttarakhand Technical University से प्रोडक्शन इंजीनियरिंग में B.Tech (76.45%, 2014-18)। डेटा-संचालित प्रयोग और तकनीकी विश्लेषण में मजबूत आधार।',
      'about.approach_title': 'मुख्य क्षेत्र',
      'about.approach_text': 'प्रभावी अंतर-सांस्कृतिक संचार के माध्यम से तकनीकी और व्यवसाय कार्यों को जोड़ना। प्रक्रिया सुधार, परियोजना समन्वय, और डेटा-संचालित निर्णय समर्थन में कुशल। JLPT N2 जापानी, अंग्रेज़ी, और हिंदी में दक्ष, और बहुसांस्कृतिक टीमों के साथ काम करने का अनुभव।',
      'experience.title': 'अनुभव',
      'experience.item1.title': 'अंतरराष्ट्रीय सेल्स इंजीनियर',
      'experience.item1.date': 'Kuken Industries, फुकुओका · 2024 – वर्तमान',
      'experience.item1.text': 'ग्राहकों, इंजीनियरिंग, और उत्पादन टीमों के बीच वैश्विक बाजारों में विदेशी परियोजनाओं का समन्वय करता है',
      'experience.item2.title': 'प्रोडक्शन इंजीनियर',
      'experience.item2.date': 'Kuken Industries, मियावाका · 2022 – 2024',
      'experience.item2.text': 'उत्पादन प्रक्रियाओं और घटक डिज़ाइन का समर्थन किया, विनिर्माण संचालन में गुणवत्ता और निरंतरता सुनिश्चित की',
      'experience.item3.title': 'स्नातकोत्तर शोधकर्ता',
      'experience.item3.date': 'IIT Gandhinagar · 2020 – 2021',
      'experience.item3.text': 'डेटा-संचालित प्रयोग किए और सामग्री विज्ञान में प्रदर्शन मूल्यांकन के लिए सांख्यिकीय विश्लेषण लागू किया',
      'skills.title': 'कौशल',
      'skills.list.1': 'प्रोजेक्ट समन्वय और स्टेकहोल्डर संरेखण',
      'skills.list.2': 'डेटा विश्लेषण और Excel (उन्नत)',
      'skills.list.3': 'जापानी (JLPT N2) · अंग्रेज़ी · हिंदी',
      'skills.list.4': 'Python, AutoCAD, SolidWorks',
      'skills.list.5': 'प्रक्रिया सुधार और गुणवत्ता प्रबंधन',
      'projects.title': 'प्रोजेक्ट्स',
      'projects.card1.title': 'पोर्टफोलियो रिफ़्रेश',
      'projects.card1.text': 'मेरी कहानी, कौशल और संपर्क जानकारी साझा करने के लिए एक स्पष्ट, रिस्पॉन्सिव व्यक्तिगत वेबसाइट।',
      'projects.card2.title': 'सेल्स सपोर्ट टूलकिट',
      'projects.card2.text': 'जापानी तकनीकी टीमों और विदेशी ग्राहकों के बीच संचार को सुव्यवस्थित करने के लिए दस्तावेज़ीकरण और प्रक्रिया टेम्पलेट।',
      'contact.title': 'संपर्क',
      'contact.line1': 'सहयोग, वेबसाइट कार्य, या अंतरराष्ट्रीय बिक्री अवसरों पर चर्चा करने के लिए संपर्क करें।',
      'footer.copyright': '© 2026 अक्षय'
    }
  };

  const languageSelect = document.getElementById('dock-language-select');

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
  const browserLanguage = navigator.language.toLowerCase();
  const defaultLanguage = savedLanguage || (browserLanguage.startsWith('ja') ? 'ja' : browserLanguage.startsWith('hi') ? 'hi' : 'en');
  setLanguage(defaultLanguage);

  if (languageSelect) {
    languageSelect.addEventListener('change', (event) => {
      setLanguage(event.target.value);
    });
  }

  const scrollTargets = [
    ...document.querySelectorAll('.hero, .section-section, .hero-card, .project-card, .experience-list > li, .skills-list li, .connect-card')
  ];

  scrollTargets.forEach((target, index) => {
    target.classList.add('reveal-item');

    if (target.matches('.project-card, .experience-list > li, .connect-card')) {
      target.classList.add('reveal-left');
    }

    if (target.matches('.experience-list > li')) {
      const itemIndex = Array.from(target.parentElement.children).indexOf(target);
      target.style.setProperty('--delay', `${itemIndex * 0.08}s`);
    } else if (target.matches('.project-card, .connect-card, .hero-card, .skills-list li')) {
      const itemIndex = Array.from(target.parentElement.children).indexOf(target);
      target.style.setProperty('--delay', `${itemIndex * 0.06}s`);
    }
  });

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  scrollTargets.forEach(target => scrollObserver.observe(target));

  function initMouseEffects() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    if (reduceMotion || !supportsHover) return;

    const cards = document.querySelectorAll('.hero-card, .skill-card, .project-card, .connect-card, .experience-list > li, .github-card');
    if (cards.length === 0) return;

    cards.forEach((card) => {
      card.classList.add('mouse-card');

      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const localX = event.clientX - rect.left;
        const localY = event.clientY - rect.top;

        const percentX = (localX / rect.width) * 100;
        const percentY = (localY / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${percentX}%`);
        card.style.setProperty('--mouse-y', `${percentY}%`);

        const rotateY = ((localX / rect.width) - 0.5) * 8;
        const rotateX = (0.5 - (localY / rect.height)) * 8;

        card.classList.add('is-tilting');
        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });

      card.addEventListener('pointerdown', (event) => {
        const rect = card.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'card-ripple';
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        card.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });

    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    const bgReact = document.createElement('div');
    bgReact.className = 'bg-cursor-react';
    document.body.insertBefore(bgReact, document.body.firstChild);

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursorGlow.classList.add('active');
      cursorGlow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      bgReact.style.setProperty('--cursor-x', `${mouseX}px`);
      bgReact.style.setProperty('--cursor-y', `${mouseY}px`);
      bgReact.style.setProperty('--cursor-x-percent', `${(mouseX / window.innerWidth) * 100}%`);
      bgReact.style.setProperty('--cursor-y-percent', `${(mouseY / window.innerHeight) * 100}%`);

      bgReact.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    window.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
    });
  }

  initMouseEffects();

  function initNeuralNetwork() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'neural-network-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.08;
    `;

    const nodes = [
      [8, 12], [28, 35], [52, 18], [72, 42],
      [15, 68], [65, 72], [42, 88], [88, 62]
    ];

    nodes.forEach(([x, y]) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '1.2');
      circle.setAttribute('fill', 'rgba(99, 102, 241, 0.8)');
      svg.appendChild(circle);
    });

    const lines = [
      [[8, 12], [28, 35]],
      [[28, 35], [52, 18]],
      [[52, 18], [72, 42]],
      [[72, 42], [88, 62]],
      [[15, 68], [42, 88]],
      [[28, 35], [65, 72]],
      [[52, 18], [42, 88]],
      [[8, 12], [15, 68]]
    ];

    lines.forEach(([[x1, y1], [x2, y2]]) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', 'rgba(79, 70, 229, 0.6)');
      line.setAttribute('stroke-width', '0.5');
      line.setAttribute('stroke-dasharray', '2,1');
      line.setAttribute('opacity', '0.06');
      svg.appendChild(line);
    });

    document.body.appendChild(svg);
  }

  initNeuralNetwork();
  const chatToggle = document.getElementById('chat-toggle');
  const chatPanel = document.getElementById('chat-panel');
  const chatClose = document.getElementById('chat-close');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  const chatSections = Array.from(document.querySelectorAll('main section')).map(section => {
    const title = section.querySelector('h2')?.textContent?.trim() || section.id;
    const text = Array.from(section.querySelectorAll('h2, h3, p, li')).map(el => el.textContent.trim()).join(' ');
    return { id: section.id, title, text };
  });

  function appendChatMessage(text, sender = 'bot') {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-message ${sender}`;
    const message = document.createElement('div');
    message.className = 'chat-message-text';
    message.textContent = text;
    wrapper.appendChild(message);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function summarizeSection(section) {
    const short = section.text.replace(/\s+/g, ' ').trim();
    return short.length > 320 ? `${short.slice(0, 320).trim()}...` : short;
  }

  function getBestReply(query) {
    const normalized = query.toLowerCase();
    if (/(about me|tell me about|who are you|yourself|your background|your story|what do you do|what are you|about akshay|who is akshay)/.test(normalized)) {
      const section = chatSections.find(item => item.id === 'about');
      return section ? summarizeSection(section) : null;
    }
    if (/about|background|profile|story|approach/.test(normalized)) {
      const section = chatSections.find(item => item.id === 'about');
      return section ? summarizeSection(section) : null;
    }
    if (/experience|work|job|department|research|role/.test(normalized)) {
      const section = chatSections.find(item => item.id === 'experience');
      return section ? summarizeSection(section) : null;
    }
    if (/skill|skills|ability|strength/.test(normalized)) {
      const section = chatSections.find(item => item.id === 'skills');
      return section ? summarizeSection(section) : null;
    }
    if (/project|portfolio|toolkit/.test(normalized)) {
      const section = chatSections.find(item => item.id === 'projects');
      return section ? summarizeSection(section) : null;
    }
    if (/contact|email|reach|collaboration|opportunity/.test(normalized)) {
      const section = chatSections.find(item => item.id === 'contact');
      return section ? summarizeSection(section) : null;
    }
    if (/location|where|based/.test(normalized)) {
      const hero = chatSections.find(item => item.id === 'hero');
      return hero ? summarizeSection(hero) : null;
    }

    const matches = chatSections.filter(item => item.text.toLowerCase().includes(normalized));
    if (matches.length > 0) {
      return summarizeSection(matches[0]);
    }
    return null;
  }

  function handleChatSubmit(event) {
    event.preventDefault();
    const userText = chatInput.value.trim();
    if (!userText) return;
    appendChatMessage(userText, 'user');
    chatInput.value = '';

    const reply = getBestReply(userText) || 'I could not find a clear answer in the page details. Try asking about Akshay’s background, experience, skills, or contact information.';
    setTimeout(() => appendChatMessage(reply, 'bot'), 250);
  }

  if (chatToggle && chatPanel && chatClose && chatForm && chatInput && chatMessages) {
    chatToggle.addEventListener('click', () => {
      chatPanel.classList.toggle('open');
      if (chatPanel.classList.contains('open')) {
        chatInput.focus();
      }
    });

    chatClose.addEventListener('click', () => {
      chatPanel.classList.remove('open');
    });

    chatForm.addEventListener('submit', handleChatSubmit);
  }
});
