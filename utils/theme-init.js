// Runs synchronously in <head> to prevent flash of unstyled content
if (localStorage.getItem('diatrivi_theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}
