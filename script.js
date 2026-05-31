// --- Jisho floating button and panel logic ---
document.addEventListener("DOMContentLoaded", () => {
    const jishoFab = document.getElementById('jisho-fab');
    const jishoPanel = document.getElementById('jisho-sidepanel');
    const jishoClose = document.getElementById('jisho-close');
    const jishoForm = document.getElementById('jisho-form');
    const jishoInput = document.getElementById('jisho-input');
    const jishoResults = document.getElementById('jisho-results');

    if (jishoFab && jishoPanel) {
        jishoFab.addEventListener('click', () => {
            jishoPanel.classList.remove('jisho-sidepanel-hidden');
            setTimeout(() => {
                if (jishoInput) jishoInput.focus();
            }, 200);
        });
    }
    if (jishoClose && jishoPanel) {
        jishoClose.addEventListener('click', () => {
            jishoPanel.classList.add('jisho-sidepanel-hidden');
        });
    }
    document.addEventListener('mousedown', (e) => {
        if (jishoPanel && !jishoPanel.classList.contains('jisho-sidepanel-hidden')) {
            if (!jishoPanel.contains(e.target) && e.target !== jishoFab) {
                jishoPanel.classList.add('jisho-sidepanel-hidden');
            }
        }
    });

    if (jishoForm && jishoInput && jishoResults) {
        jishoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = jishoInput.value.trim();
            if (!query) return;
            jishoResults.innerHTML = '<div>Searching...</div>';
            fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(query)}`)
                .then(r => r.json())
                .then(data => {
                    if (!data.data || data.data.length === 0) {
                        jishoResults.innerHTML = '<div>No results found.</div>';
                        return;
                    }
                    jishoResults.innerHTML = data.data.slice(0, 5).map(entry => {
                        const word = entry.japanese[0]?.word || entry.japanese[0]?.reading || '';
                        const reading = entry.japanese[0]?.reading ? `<span class="jisho-reading">${entry.japanese[0].reading}</span>` : '';
                        const meanings = entry.senses[0]?.english_definitions?.join(', ') || '';
                        return `<div class="jisho-entry"><span class="jisho-word">${word}</span> ${reading}<div class="jisho-meaning">${meanings}</div></div>`;
                    }).join('');
                })
                .catch(() => {
                    jishoResults.innerHTML = '<div>Error fetching results.</div>';
                });
        });
    }
});
// --- Chatbot logic ---
document.addEventListener("DOMContentLoaded", () => {
        // --- Chatbot floating button and panel logic ---
        const chatbotFab = document.getElementById('chatbot-fab');
        const chatbotPanel = document.getElementById('chatbot-sidepanel');
        const chatbotClose = document.getElementById('chatbot-close');

        if (chatbotFab && chatbotPanel) {
            chatbotFab.addEventListener('click', () => {
                chatbotPanel.classList.remove('chatbot-sidepanel-hidden');
                setTimeout(() => {
                    const input = document.getElementById('chatbot-input');
                    if (input) input.focus();
                }, 200);
            });
        }
        if (chatbotClose && chatbotPanel) {
            chatbotClose.addEventListener('click', () => {
                chatbotPanel.classList.add('chatbot-sidepanel-hidden');
            });
        }
        // Optional: close on outside click
        document.addEventListener('mousedown', (e) => {
            if (chatbotPanel && !chatbotPanel.classList.contains('chatbot-sidepanel-hidden')) {
                if (!chatbotPanel.contains(e.target) && e.target !== chatbotFab) {
                    chatbotPanel.classList.add('chatbot-sidepanel-hidden');
                }
            }
        });
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Profile knowledge base
    const profileData = {
        name: "Akshay Srivastava",
        location: "Fukuoka, Japan",
        education: [
            "M.Tech, Materials Science and Engineering, IIT Gandhinagar (2018-2020)",
            "B.Tech, Production Engineering, Govind Ballabh Pant Engineering College (2014-2018)",
            "Summer School, Advanced Functional Materials, Shanghai Jiao Tong University (2020)"
        ],
        languages: ["English (Full Professional)", "Japanese (Full Professional)", "Hindi (Native)"] ,
        skills: ["Statistics", "Machine Learning", "SQL", "International Sales", "Cross-Cultural Communication", "Japanese Language Proficiency", "Business Development", "Web Development (HTML, CSS, JavaScript)", "Data Analysis"],
        experience: [
            { role: "International Department", company: "KUKEN KOGYO CO., LTD.", location: "Fukuoka, Japan", dates: "Apr 2024 – Present", desc: "Analyzed technical and operational data for overseas cooling tower projects. Acted as bridge between customers and production teams." },
            { role: "Technical Department", company: "KUKEN KOGYO CO., LTD.", location: "Fukuoka, Japan", dates: "Apr 2022 – Mar 2024", desc: "Component design and production processes, ensuring accuracy and consistency." },
            { role: "Technical Analyst (Remote)", company: "", location: "Ahmedabad, India", dates: "May 2021 – Mar 2022", desc: "Structured data analysis and market research for engineering and business decisions." },
            { role: "Postgraduate Researcher", company: "IIT Gandhinagar", location: "Gandhinagar, India", dates: "Aug 2020 – Apr 2021", desc: "Data-driven experiments and statistical analysis for materials research." }
        ]
    };

    function botReply(msg) {
        const div = document.createElement('div');
        div.className = 'msg bot';
        div.textContent = msg;
        chatbotMessages.appendChild(div);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    function userMsg(msg) {
        const div = document.createElement('div');
        div.className = 'msg user';
        div.textContent = msg;
        chatbotMessages.appendChild(div);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function answerQuestion(q) {
        const text = q.toLowerCase();
        // Simple keyword-based answers
        if (text.includes('name')) return `My name is ${profileData.name}.`;
        if (text.includes('location') || text.includes('based')) return `I'm based in ${profileData.location}.`;
        if (text.includes('education') || text.includes('study') || text.includes('degree')) return `My education: ${profileData.education.join('; ')}`;
        if (text.includes('language')) return `I speak: ${profileData.languages.join(', ')}`;
        if (text.includes('skill') || text.includes('expertise')) return `My skills include: ${profileData.skills.join(', ')}`;
        if (text.includes('experience') || text.includes('work') || text.includes('job') || text.includes('career')) {
            return 'Here is a summary of my recent work experience:\n' + profileData.experience.map(e => `${e.role} at ${e.company ? e.company + ', ' : ''}${e.location} (${e.dates}): ${e.desc}`).join('\n');
        }
        if (text.includes('current') && text.includes('role')) return `I'm currently working in the International Department at KUKEN KOGYO CO., LTD. in Fukuoka, Japan (since Apr 2024).`;
        if (text.includes('japan')) return `Yes, I have worked and studied in Japan. My current role is in Fukuoka, Japan.`;
        if (text.includes('contact')) return `You can contact me at akshay.srivastava543@gmail.com or via LinkedIn.`;
        if (text.includes('linkedin')) return `Here's my LinkedIn: https://www.linkedin.com/in/akshay543/`;
        if (text.includes('instagram')) return `My Instagram handle is @akshay0112.`;
        // Default
        return "I'm a simple profile bot! Try asking about my experience, education, skills, or contact info.";
    }

    if (chatbotForm && chatbotInput && chatbotMessages) {
        chatbotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const msg = chatbotInput.value.trim();
            if (!msg) return;
            userMsg(msg);
            setTimeout(() => botReply(answerQuestion(msg)), 400);
            chatbotInput.value = '';
        });
    }
});

const translations = {
    en: {
        heroTitle: "Hi, I'm Akshay 👋",
        heroSubtitle: "International Sales Professional at a manufactuirng company | IIT Gandhinagar | Language Enthusiast",
        journeyButton: "My Journey",
        journeyTitle: "My Journey",
        journeyParagraph1: "My journey began with a strong curiosity for learning and growth. I pursued my Masters from IIT Gandhinagar, where I developed analytical thinking and problem-solving skills.",
        journeyParagraph2: "Today, I work in International Sales, where I combine strategy, communication, and cultural understanding to build global relationships and drive business growth.",
        journeyParagraph3: "Being fluent in Hindi, English, and Japanese allows me to connect across markets and bridge opportunities between people and ideas.",
        skillsTitle: "Core Skills",
        skill1: "International Sales Strategy",
        skill2: "Cross-Cultural Communication",
        skill3: "Japanese Language Proficiency",
        skill4: "Business Development",
        skill5: "Web Development (HTML, CSS, JavaScript)",
        footerText: "© 2026 Akshay | Built with passion 🚀"
    },
    ja: {
        heroTitle: "こんにちは、私はアクシャイです 👋",
        heroSubtitle: "製造会社の国際営業プロフェッショナル | IITガンディーグラム | 語学愛好家",
        journeyButton: "私の旅",
        journeyTitle: "私の旅",
        journeyParagraph1: "私の旅は学びと成長への強い好奇心から始まりました。IITガンディーグラムで修士号を取得し、分析力と思考力を磨きました。",
        journeyParagraph2: "現在は国際営業に従事し、戦略、コミュニケーション、文化理解を組み合わせて、グローバルな関係を築き、ビジネス成長を促進しています。",
        journeyParagraph3: "ヒンディー語、英語、日本語に堪能であることは、市場を越えて人々をつなぎ、アイデアの橋渡しをすることを可能にします。",
        skillsTitle: "主なスキル",
        skill1: "国際営業戦略",
        skill2: "異文化コミュニケーション",
        skill3: "日本語能力",
        skill4: "ビジネス開発",
        skill5: "ウェブ開発（HTML、CSS、JavaScript）",
        footerText: "© 2026 Akshay | 情熱を込めて作成 🚀"
    }
};

function setLanguage(lang = "en") {
    const selectedLang = translations[lang] ? lang : "en";
    const t = translations[selectedLang];
    document.documentElement.lang = selectedLang;
    const languageSelect = document.getElementById("language-select");
    if (languageSelect) {
        languageSelect.value = selectedLang;
    }
    document.getElementById("hero-title").textContent = t.heroTitle;
    document.getElementById("hero-subtitle").textContent = t.heroSubtitle;
    document.getElementById("journey-button").textContent = t.journeyButton;
    document.getElementById("journey-title").textContent = t.journeyTitle;
    document.getElementById("journey-paragraph-1").textContent = t.journeyParagraph1;
    document.getElementById("journey-paragraph-2").textContent = t.journeyParagraph2;
    document.getElementById("journey-paragraph-3").textContent = t.journeyParagraph3;
    document.getElementById("skills-title").textContent = t.skillsTitle;
    document.getElementById("skill-1").textContent = t.skill1;
    document.getElementById("skill-2").textContent = t.skill2;
    document.getElementById("skill-3").textContent = t.skill3;
    document.getElementById("skill-4").textContent = t.skill4;
    document.getElementById("skill-5").textContent = t.skill5;
    document.getElementById("footer-text").textContent = t.footerText;
}

function scrollToSection() {
    document.getElementById("journey").scrollIntoView({
        behavior: "smooth"
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const languageSelect = document.getElementById("language-select");
    if (languageSelect) {
        languageSelect.addEventListener("change", (event) => {
            setLanguage(event.target.value);
        });
        setLanguage(languageSelect.value || "en");
    } else {
        setLanguage("en");
    }

    // --- Social follower counts (editable values) ---
    // NOTE: Direct API access to Instagram/LinkedIn follower counts requires auth and API access.
    // To keep this simple and offline-friendly, set the follower numbers here. Update values as needed.
    const SOCIAL_COUNTS = {
        instagram: 1234, // Example: set your real Instagram followers here
        linkedin: 2345   // Example: set your real LinkedIn followers here
    };

    function formatNumber(n) {
        if (n === null || n === undefined) return '—';
        if (n < 1000) return String(n);
        if (n < 1000000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
        return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M';
    }

    const igCountEl = document.getElementById('instagram-count');
    const liCountEl = document.getElementById('linkedin-count');
    if (igCountEl) igCountEl.textContent = formatNumber(SOCIAL_COUNTS.instagram);
    if (liCountEl) liCountEl.textContent = formatNumber(SOCIAL_COUNTS.linkedin);

    // Ensure Instagram link shows the handle (in case it's changed later)
    const igLink = document.getElementById('instagram-link');
    if (igLink) igLink.textContent = '@akshay0112';
    // LinkedIn link label left as 'LinkedIn' — could be adjusted to a name if desired.
});
