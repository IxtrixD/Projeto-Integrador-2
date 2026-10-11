const THEME_STORAGE_KEY = 'unitodonto-theme';

if (localStorage.getItem(THEME_STORAGE_KEY) === 'dark') {
    document.documentElement.classList.add('dark-theme');
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');

    if (!themeToggle) {
        return;
    }

    const updateThemeToggle = (isDark) => {
        const themeIcon = themeToggle.querySelector('.theme-icon');

        themeIcon?.classList.toggle('bx-moon', !isDark);
        themeIcon?.classList.toggle('bx-sun', isDark);
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
        themeToggle.setAttribute('title', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
    };

    updateThemeToggle(document.documentElement.classList.contains('dark-theme'));

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark-theme');
        localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
        updateThemeToggle(isDark);
    });
});
