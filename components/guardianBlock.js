class AppGuardian extends HTMLElement {
    connectedCallback() {
        const guardianId = this.getAttribute('guardian-id') || '0';
        const removable = this.getAttribute('removable') === 'true';

        const defaultRoles = ['Μητέρα', 'Πατέρας'];
        const defaultRole = defaultRoles[guardianId] || `Κηδεμόνας ${parseInt(guardianId) + 1}`;

        this.innerHTML = `
            <div class="border rounded p-3 mb-3 guardian-block">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="fw-semibold">Στοιχεία Κηδεμόνα</span>
                    ${removable ? `<button type="button" class="btn btn-sm btn-outline-danger remove-btn"><i class="bi bi-trash me-1"></i>Αφαίρεση</button>` : ''}
                </div>
                <div class="row">
                    <div class="mb-3">
                        <label class="form-label">Σχέση με μαθητή</label>
                        <select class="form-select relation-select" name="guardianRelation_${guardianId}">
                            <option value="Μητέρα" ${defaultRole === 'Μητέρα' ? 'selected' : ''}>Μητέρα</option>
                            <option value="Πατέρας" ${defaultRole === 'Πατέρας' ? 'selected' : ''}>Πατέρας</option>
                            <option value="Παππούς">Παππούς</option>
                            <option value="Γιαγιά">Γιαγιά</option>
                            <option value="Αδελφός">Αδελφός</option>
                            <option value="Αδελφή">Αδελφή</option>
                            <option value="Θείος">Θείος</option>
                            <option value="Θεία">Θεία</option>
                            <option value="Άλλο">Άλλο</option>
                        </select>
                    </div>
                    <div class="mb-3 d-none custom-relation-wrapper">
                        <label class="form-label">Γράψε τη σχέση <span class="text-danger fw-bold">*</span></label>
                        <input type="text" class="form-control custom-relation-input" name="guardianCustomRelation_${guardianId}" placeholder="π.χ. Νονά">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Όνομα <span class="text-danger fw-bold">*</span></label>
                        <input type="text" class="form-control" name="guardianName_${guardianId}" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Επώνυμο <span class="text-danger fw-bold">*</span></label>
                        <input type="text" class="form-control" name="guardianSurname_${guardianId}" required>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6 mb-3 mb-md-0">
                        <label class="form-label">Τηλέφωνο <span class="text-danger fw-bold">*</span></label>
                        <input type="tel" class="form-control" name="guardianPhone_${guardianId}" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Email <span class="text-danger fw-bold">*</span></label>
                        <input type="email" class="form-control" name="guardianEmail_${guardianId}" required>
                    </div>
                </div>
            </div>
        `;
        
        // Logic for showing/hiding custom relation input
        const relationSelect = this.querySelector('.relation-select');
        const customRelationWrapper = this.querySelector('.custom-relation-wrapper');
        const customRelationInput = this.querySelector('.custom-relation-input');

        relationSelect.addEventListener('change', (e) => {
            const isOther = e.target.value === 'Άλλο';
            customRelationWrapper.classList.toggle('d-none', !isOther);
            customRelationInput.required = isOther;
            if (!isOther) customRelationInput.value = '';
        });

        // Remove button logic
        const removeBtn = this.querySelector('.remove-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.remove();
            });
        }
    }
}

customElements.define('app-guardian', AppGuardian);