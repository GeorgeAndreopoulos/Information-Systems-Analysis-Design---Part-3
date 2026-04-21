class AppRequiredNote extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <small class="text-muted" style="font-size: 0.75rem;">
                Τα πεδία με <span class="text-danger fw-bold">*</span> είναι υποχρεωτικά
            </small>
        `;
    }
}

customElements.define('app-required-note', AppRequiredNote);