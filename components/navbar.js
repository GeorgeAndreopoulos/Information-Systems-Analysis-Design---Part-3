class AppNavbar extends HTMLElement {
    connectedCallback() {
        const backLink = this.getAttribute('back-link') || '../../index.html';

        this.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
                <div class="container d-flex justify-content-between">
                    <a class="navbar-brand fw-bold" href="${backLink}">
                        <i class="bi bi-box-arrow-in-left"></i> ╬ò╧Ç╬╣╧â╧ä╧ü╬┐╧å╬« ╧â╧ä╬╖╬╜ ╬æ╧ü╧ç╬╣╬║╬«
                    </a>
                    <span class="navbar-dark-slot"></span>
                </div>
            </nav>
        `;

        // Inject dark mode toggle if the utility is loaded
        const slot = this.querySelector('.navbar-dark-slot');
        if (slot && typeof createDarkModeToggle === 'function') {
            slot.appendChild(createDarkModeToggle());
        }
    }
}

customElements.define('app-navbar', AppNavbar);
