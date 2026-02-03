document.addEventListener('DOMContentLoaded', () => {
    // === AUTHENTICATION ===
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('admin-dashboard');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    // Secret Password
    const ADMIN_PASS = "02012015Eloah9anos";

    // Check if already logged in
    // logic moved to bottom


    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = passwordInput.value;

            if (pass === ADMIN_PASS) {
                localStorage.setItem('adminLoggedIn', 'true');
                showDashboard();
                passwordInput.value = '';
                loginError.style.display = 'none';
            } else {
                loginError.style.display = 'block';
                // Animation reset
                loginError.style.animation = 'none';
                loginError.offsetHeight; /* reflow */
                loginError.style.animation = 'shake 0.3s ease';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminLoggedIn');
            location.reload();
        });
    }

    function showDashboard() {
        if (loginScreen) loginScreen.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';
        loadSettings();
    }

    // === SETTINGS MANAGEMENT ===

    // Default Values (if nothing in localStorage)
    const defaults = {
        prices: {
            icon: 3.50,
            bust: 5.00,
            fullbody: 7.50
        },
        addons: {
            lineart: 2.00,
            flat: 3.00,
            full: 4.00,
            char: 1.00
        },
        status: 'open',
        contact: {
            tiktok: 'https://www.tiktok.com/@guaxinim_kinny_ofc',
            kofi: 'https://ko-fi.com/kinnyheheh'
        },
        visual: {
            color: '#ff6b81', // Approximate pink from screenshot
            avatar: ''
        },
        messages: {
            open: 'Comissões Abertas! Faça seus pedidos :)',
            closed: 'Desculpe mais as comissões estão fechadas no momento... :('
        },
        availability: {
            icon: { active: true, msg: 'Ops, esta opção não estão disponiveis! Desculpe...' },
            bust: { active: true, msg: 'Ops, esta opção não estão disponiveis! Desculpe...' },
            fullbody: { active: true, msg: 'Ops, esta opção não estão disponiveis! Desculpe...' },
            kofi: { active: false, msg: 'Ops, esta opção não estão disponiveis! Desculpe...' }
        }
    };

    // Inputs
    const inputs = {
        icon: document.getElementById('price-icon'),
        bust: document.getElementById('price-bust'),
        fullbody: document.getElementById('price-fullbody'),
        lineart: document.getElementById('addon-lineart'),
        flat: document.getElementById('addon-flat'),
        full: document.getElementById('addon-full'),
        char: document.getElementById('addon-char'),
        status: document.getElementById('commissions-status-select'),
        tiktok: document.getElementById('contact-tiktok'),
        kofi: document.getElementById('contact-kofi'),
        color: document.getElementById('theme-color'),
        avatar: document.getElementById('site-avatar'),
        msgOpen: document.getElementById('msg-open'),
        msgClosed: document.getElementById('msg-closed'),
        // Availability
        statusIcon: document.getElementById('status-icon'),
        msgIcon: document.getElementById('msg-icon'),
        statusBust: document.getElementById('status-bust'),
        msgBust: document.getElementById('msg-bust'),
        statusFullbody: document.getElementById('status-fullbody'),
        msgFullbody: document.getElementById('msg-fullbody'),
        statusKofi: document.getElementById('status-kofi'),
        msgKofi: document.getElementById('msg-kofi')
    };

    const saveBtn = document.getElementById('save-settings-btn');
    const toast = document.getElementById('toast');

    function loadSettings() {
        const storedSettings = JSON.parse(localStorage.getItem('siteSettings')) || defaults;

        // Fill inputs
        if (inputs.icon) inputs.icon.value = storedSettings.prices.icon;
        if (inputs.bust) inputs.bust.value = storedSettings.prices.bust;
        if (inputs.fullbody) inputs.fullbody.value = storedSettings.prices.fullbody;

        if (inputs.lineart) inputs.lineart.value = storedSettings.addons.lineart;
        if (inputs.flat) inputs.flat.value = storedSettings.addons.flat;
        if (inputs.full) inputs.full.value = storedSettings.addons.full;
        if (inputs.char) inputs.char.value = storedSettings.addons.char !== undefined ? storedSettings.addons.char : 1.00;

        if (inputs.status) inputs.status.value = storedSettings.status;

        if (inputs.tiktok) inputs.tiktok.value = storedSettings.contact ? storedSettings.contact.tiktok : defaults.contact.tiktok;
        if (inputs.kofi) inputs.kofi.value = storedSettings.contact && storedSettings.contact.kofi ? storedSettings.contact.kofi : defaults.contact.kofi;

        // Visuals
        if (inputs.color) inputs.color.value = storedSettings.visual ? storedSettings.visual.color : defaults.visual.color;
        if (inputs.avatar) inputs.avatar.value = storedSettings.visual ? storedSettings.visual.avatar : defaults.visual.avatar;

        // Messages
        if (inputs.msgOpen) inputs.msgOpen.value = storedSettings.messages ? storedSettings.messages.open : defaults.messages.open;
        if (inputs.msgClosed) inputs.msgClosed.value = storedSettings.messages ? storedSettings.messages.closed : defaults.messages.closed;

        // Availability (Safe check for old data)
        const av = storedSettings.availability || defaults.availability;
        if (inputs.statusIcon) inputs.statusIcon.checked = av.icon.active;
        if (inputs.msgIcon) inputs.msgIcon.value = av.icon.msg;
        if (inputs.statusBust) inputs.statusBust.checked = av.bust.active;
        if (inputs.msgBust) inputs.msgBust.value = av.bust.msg;
        if (inputs.statusFullbody) inputs.statusFullbody.checked = av.fullbody.active;
        if (inputs.msgFullbody) inputs.msgFullbody.value = av.fullbody.msg;
        if (inputs.statusKofi) inputs.statusKofi.checked = av.kofi ? av.kofi.active : defaults.availability.kofi.active;
        if (inputs.msgKofi) inputs.msgKofi.value = av.kofi ? av.kofi.msg : defaults.availability.kofi.msg;
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const newSettings = {
                prices: {
                    icon: parseFloat(inputs.icon.value) || 0,
                    bust: parseFloat(inputs.bust.value) || 0,
                    fullbody: parseFloat(inputs.fullbody.value) || 0
                },
                addons: {
                    lineart: parseFloat(inputs.lineart.value) || 0,
                    flat: parseFloat(inputs.flat.value) || 0,
                    full: parseFloat(inputs.full.value) || 0,
                    char: parseFloat(inputs.char.value) || 0
                },
                status: inputs.status.value,
                contact: {
                    tiktok: inputs.tiktok.value,
                    kofi: inputs.kofi.value
                },
                visual: {
                    color: inputs.color.value,
                    avatar: inputs.avatar.value
                },
                messages: {
                    open: inputs.msgOpen.value,
                    closed: inputs.msgClosed.value
                },
                availability: {
                    icon: { active: inputs.statusIcon.checked, msg: inputs.msgIcon.value },
                    bust: { active: inputs.statusBust.checked, msg: inputs.msgBust.value },
                    fullbody: { active: inputs.statusFullbody.checked, msg: inputs.msgFullbody.value },
                    kofi: { active: inputs.statusKofi.checked, msg: inputs.msgKofi.value }
                }
            };

            localStorage.setItem('siteSettings', JSON.stringify(newSettings));

            // Show toast
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        });
    }

    // Check if already logged in (Run after everything is initialized)
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }
});
