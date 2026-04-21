class AppNavbar extends HTMLElement {
    connectedCallback() {
        const backLink = this.getAttribute('back-link') || '../../index.html';

        this.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
                <div class="container">
                    <a class="navbar-brand fw-bold" href="${backLink}">
                        <i class="bi bi-box-arrow-in-left"></i> Επιστροφή στην Αρχική
                    </a>
                </div>
            </nav>
        `;
    }
}

customElements.define('app-navbar', AppNavbar);