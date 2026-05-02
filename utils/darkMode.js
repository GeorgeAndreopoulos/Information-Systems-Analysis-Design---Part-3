/**
 * Dark Mode Toggle Utility
 * Reads/writes preference to localStorage key 'diatrivi_theme'.
 * Call initDarkMode() once on page load.
 */

function initDarkMode() {
    const saved = localStorage.getItem('diatrivi_theme');

    // Apply saved preference (or default to light)
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleDarkMode() {
    // Add smooth transition class
    document.documentElement.classList.add('theme-transition');

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('diatrivi_theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('diatrivi_theme', 'dark');
    }

    // Update toggle button icon
    updateToggleIcon();

    // Remove transition class after animation completes
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
    }, 400);
}

function updateToggleIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.dark-mode-toggle .toggle-icon').forEach(icon => {
        icon.className = isDark
            ? 'bi bi-sun-fill toggle-icon'
            : 'bi bi-moon-fill toggle-icon';
    });
    document.querySelectorAll('.dark-mode-toggle .toggle-label').forEach(label => {
        label.textContent = isDark ? 'Φωτεινό' : 'Σκοτεινό';
    });
}

/**
 * Creates and returns a dark mode toggle button element.
 * Can be called in any page to get a ready-to-use button.
 */
function createDarkModeToggle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const btn = document.createElement('button');
    btn.className = 'dark-mode-toggle';
    btn.setAttribute('aria-label', 'Εναλλαγή Σκοτεινής/Φωτεινής Λειτουργίας');
    btn.setAttribute('title', 'Εναλλαγή θέματος');
    btn.innerHTML = `
        <i class="bi ${isDark ? 'bi-sun-fill' : 'bi-moon-fill'} toggle-icon"></i>
        <span class="toggle-label d-none d-sm-inline" style="font-size:0.82rem; font-weight:500;">${isDark ? 'Φωτεινό' : 'Σκοτεινό'}</span>
    `;
    btn.addEventListener('click', toggleDarkMode);
    return btn;
}

// Initialize theme immediately so there is no flash
initDarkMode();
