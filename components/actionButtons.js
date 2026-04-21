class AppActionButtons extends HTMLElement {
    connectedCallback() {
        const role = this.getAttribute('role') || 'student';

        let secondaryText, secondaryAction;
        let primaryText, primaryAction, primaryIcon;

        if (role === 'admin') {
            secondaryText = 'Ακύρωση Αλλαγών';
            secondaryAction = "location.reload()";
            primaryText = 'Αποθήκευση';
            primaryAction = "showSuccess('admin')";
            primaryIcon = 'bi-save';
        } else if (role === 'teacher') {
            secondaryText = 'Καθαρισμός';
            secondaryAction = "clearTable('teacher-cell')";
            primaryText = 'Οριστική Υποβολή';
            primaryAction = "showSuccess('teacher')";
            primaryIcon = 'bi-check2-circle';
        } else if (role === 'student') {
            secondaryText = 'Καθαρισμός';
            secondaryAction = "clearTable('student-cell')";
            primaryText = 'Οριστική Υποβολή';
            primaryAction = "showSuccess('student')";
            primaryIcon = 'bi-check2-circle';
        }

        this.innerHTML = `
            <div class="d-flex justify-content-end gap-2 border-top pt-4 mt-4">
                <button type="button" class="btn btn-light border px-4" onclick="${secondaryAction}">${secondaryText}</button>
                <button type="button" class="btn btn-brand px-4 shadow-sm" onclick="${primaryAction}">
                    <i class="bi ${primaryIcon} me-2"></i>${primaryText}
                </button>
            </div>
        `;
    }
}

customElements.define('app-action-buttons', AppActionButtons);