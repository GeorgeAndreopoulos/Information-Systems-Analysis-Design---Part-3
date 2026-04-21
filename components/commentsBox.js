class AppCommentsBox extends HTMLElement {
    connectedCallback() {
        const role = this.getAttribute('role') || 'teacher';

        let textareaId, placeholder, infoText, clearArg, successArg;

        if (role === 'teacher') {
            textareaId = 'teacherComments';
            placeholder = 'π.χ. Θέλω τον μαθητή Κυριακό Λαζαρίδη που θα πάει Γ\' Λυκείου ή να μην έχω κενά ανάμεσα στα μαθήματα...';
            infoText = 'Γράψτε αν προτιμάτε συγκεκριμένο/νους μαθητή/τές';
            clearArg = "'teacher-cell'";
            successArg = "'teacher'";
        } else if (role === 'student') {
            textareaId = 'studentComments';
            placeholder = 'π.χ. Θα ήθελα να κάνω Φυσική με τον κ. Μπούτα ή να μην έχω κενά ανάμεσα στα μαθήματα...';
            infoText = 'Γράψτε αν προτιμάτε κάποιον συγκεκριμένο/νη καθηγητή/τρια.';
            clearArg = "'student-cell'";
            successArg = "'student'";
        }

        this.innerHTML = `
            <div class="card shadow-sm border-0 mb-4">
                <div class="card-header py-2 bg-white fw-bold">
                    <i class="bi bi-chat-quote me-2"></i>Σχόλια / Ειδικές Προτιμήσεις
                </div>
                <div class="card-body">
                    <textarea class="form-control shadow-none" id="${textareaId}" rows="3" placeholder="${placeholder}"></textarea>
                    <div class="small text-muted mt-2">
                        <i class="bi bi-info-circle me-1"></i>${infoText}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('app-comments-box', AppCommentsBox);