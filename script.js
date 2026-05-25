
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
        instagram: null, // e.g. 1234. Use null to show placeholder
        linkedin: null
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
