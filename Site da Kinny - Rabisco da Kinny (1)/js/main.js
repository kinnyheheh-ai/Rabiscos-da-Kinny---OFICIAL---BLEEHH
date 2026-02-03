document.addEventListener('DOMContentLoaded', () => {
    // === Language System ===
    const langSwitch = document.getElementById('lang-switch');
    let currentLang = localStorage.getItem('siteLang') || 'pt';

    function updateLanguage(lang) {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Update button text if needed
        if (langSwitch) {
            langSwitch.textContent = lang === 'pt' ? 'EN' : 'PT';
        }

        localStorage.setItem('siteLang', lang);
    }

    if (langSwitch) {
        langSwitch.addEventListener('click', () => {
            currentLang = currentLang === 'pt' ? 'en' : 'pt';
            updateLanguage(currentLang);
        });
    }

    // Initialize Language
    updateLanguage(currentLang);

    // === Mobile Menu ===
    // (Simples toggle se houver um hamburguer menu futuramente, 
    // por enquanto focado na estrutura desktop/responsiva css)

    // Add active class to current nav link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // === Dynamic Contact Info ===
    function updateContactInfo() {
        const settings = JSON.parse(localStorage.getItem('siteSettings'));
        if (!settings || !settings.contact) return; // Use defaults if nothing saved

        const { tiktok, kofi } = settings.contact;

        // Update TikTok Links (Footer & Commissions Page)
        document.querySelectorAll('a[title="TikTok"], a[href*="tiktok.com"]').forEach(link => {
            if (tiktok) {
                link.href = tiktok;
                // Update text if it contains the handle
                if (link.textContent.includes('@')) {
                    // Try to extract handle from URL or just show generic text if complex
                    const handle = tiktok.split('/').pop();
                    link.textContent = `🎵 TikTok: ${handle}`;
                }
            }
        });

        // Update Ko-fi Links
        const kofiAv = settings.availability && settings.availability.kofi ? settings.availability.kofi : { active: true, msg: 'Indisponível' };

        document.querySelectorAll('.kofi-link, a[href*="ko-fi"]').forEach(link => {
            if (kofi) {
                link.href = kofi;
            }

            // Handle Availability
            if (!kofiAv.active) {
                link.classList.add('disabled-link');
                link.style.pointerEvents = 'none';
                link.style.opacity = '0.6';
                link.textContent = kofiAv.msg || "Indisponível";
            } else {
                link.classList.remove('disabled-link');
                link.style.pointerEvents = 'auto';
                link.style.opacity = '1';
                // Restore text? Difficult to know original text (Tea emoji vs "Apoiar").
                // For now, simpler to just assume user won't toggle this rapidly.
                // Or we can rely on page reload.
                // Actually, if we change the text, we lose the original.
                // Let's only change text if it's the specific "Apoiar no Ko-fi" button, or use a data-attribute for original text.
                if (link.classList.contains('btn')) {
                    link.textContent = "☕ Apoiar no Ko-fi";
                } else {
                    link.textContent = "☕";
                }
            }
        });

        // Apply Visuals
        if (settings.visual) {
            // Theme Color
            if (settings.visual.color) {
                document.documentElement.style.setProperty('--primary-color', settings.visual.color);
                // Calculate logic for buttons/hovers if needed, but simple var override works for most
            }

            // Avatar (Home Page)
            const avatarContainer = document.querySelector('.avatar-container');
            if (avatarContainer && settings.visual.avatar) {
                // If url provided, replace placeholder with img
                avatarContainer.innerHTML = `<img src="${settings.visual.avatar}" style="width:100%; height:100%; object-fit:cover;" alt="Avatar">`;
            }
        }
    }

    updateContactInfo();

    // Listen for storage changes to update immediately if admin changes it in another tab
    window.addEventListener('storage', (e) => {
        if (e.key === 'siteSettings') {
            updateContactInfo();
        }
    });
});
