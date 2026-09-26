# Akshay's Portfolio

A personal portfolio website showcasing my professional background, skills, and projects.

- **Project site (live now):** https://akshay01123.github.io/Portfolio-akshay01123.github.io/
- **User site (root):** https://akshay01123.github.io/  (see "Deploying to user Pages" below)

---

## About

I am a bilingual international sales professional with an IIT postgraduate background and 4+ years of experience in manufacturing, engineering, and international business operations in Japan. Fluent in Japanese (JLPT N2), English, and Hindi.

---

## Features

- **Glassmorphism design** — modern frosted-glass UI with soft blue gradient backgrounds
- **Typewriter animation** — animated role titles in the hero section
- **Skill cards** — categorised cards for current and in-progress skills
- **Experience timeline** — structured work history with bullet points
- **Projects section** — showcase of personal and professional projects
- **Connect section** — direct links to LinkedIn, Instagram, GitHub, and email
- **GitHub stats** — live contribution graph and repository stats
- **Multi-language support** — English, Japanese (日本語), and Hindi (हिन्दी)
- **Visitor counter** — lightweight local visit tracking
- **AI chat widget** — built-in chat assistant for site visitors
- **Fully responsive** — works on desktop, tablet, and mobile

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, glassmorphism, CSS Grid, Flexbox) |
| Scripting | Vanilla JavaScript (ES6+) |
| Fonts | Inter (Google Fonts) |
| Hosting | GitHub Pages |

---

## Project Structure

```
index.html   — Page structure and content
style.css    — All styling and layout
script.js    — Interactivity (menu, typewriter, GitHub stats, i18n, chat)
```

---

## Connect

- LinkedIn: [linkedin.com/in/akshay543](https://linkedin.com/in/akshay543/)
- Instagram: [@japaneasy101](https://instagram.com/japaneasy101)
- GitHub: [github.com/akshay01123](https://github.com/akshay01123)

---

## Deploying to user Pages (publish to https://akshay01123.github.io)

Two easy options to make the site available at the root domain:

- Using GitHub CLI (`gh`) — creates the required repository and pushes your current folder:

```bash
# authenticate first
gh auth login
# from the project folder, create the user-pages repo and push
gh repo create akshay01123/akshay01123.github.io --public --source=. --push --remote=upstream --confirm
```

- Manual via GitHub website — create a repository named `akshay01123.github.io`, then run locally:

```bash
# add remote (replace URL if using SSH)
git remote add userpages https://github.com/akshay01123/akshay01123.github.io.git
# ensure main branch
git branch -M main
# push to the new repo
git push -u userpages main
```

After pushing, GitHub Pages will publish the user site at https://akshay01123.github.io (may take a few minutes).
