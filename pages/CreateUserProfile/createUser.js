const roleSelector = document.getElementById('roleSelector');
const studentSections = document.getElementById('studentSections');
const teacherSections = document.getElementById('teacherSections');
const guardiansContainer = document.getElementById('guardiansContainer');
const addGuardianBtn = document.getElementById('addGuardianBtn');
let guardianCounter = 0;

function getDefaultGuardianRoleByIndex(index) {
    const defaultRoles = ['Μητέρα', 'Πατέρας'];
    return defaultRoles[index] || `Κηδεμόνας ${index + 1}`;
}

function guardianTemplate(guardianId, removable = false) {
    const defaultRole = getDefaultGuardianRoleByIndex(guardianId);

    return `
        <div class="border rounded p-3 mb-3 guardian-block" data-guardian-id="${guardianId}">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="fw-semibold">Στοιχεία Κηδεμόνα</span>
                ${removable ? `<button type="button" class="btn btn-sm btn-outline-danger remove-guardian-btn" data-guardian-id="${guardianId}"><i class="bi bi-trash me-1"></i>Αφαίρεση</button>` : ''}
            </div>
            <div class="row">
                <div class="mb-3">
                    <label class="form-label">Σχέση με μαθητή</label>
                    <select class="form-select guardian-relation-select" name="guardianRelation_${guardianId}">
                        <option value="Μπαμπάς" ${defaultRole === 'Μητέρα' ? 'selected' : ''}>Μητέρα</option>
                        <option value="Μαμά" ${defaultRole === 'Πατέρας' ? 'selected' : ''}>Πατέρας</option>
                        <option value="Παππούς">Παππούς</option>
                        <option value="Γιαγιά">Γιαγιά</option>
                        <option value="Αδελφός">Αδελφός</option>
                        <option value="Αδελφή">Αδελφή</option>
                        <option value="Θείος">Θείος</option>
                        <option value="Θεία">Θεία</option>
                        <option value="Άλλο">Άλλο</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Όνομα <span class="required-asterisk">*</span></label>
                    <input type="text" class="form-control" name="guardianName_${guardianId}" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Επώνυμο <span class="required-asterisk">*</span></label>
                    <input type="text" class="form-control" name="guardianSurname_${guardianId}" required>
                </div>
            </div>
            <div class="mb-3 d-none guardian-custom-relation-wrapper">
                <label class="form-label">Γράψε τη σχέση <span class="required-asterisk">*</span></label>
                <input type="text" class="form-control guardian-custom-relation-input" name="guardianCustomRelation_${guardianId}" placeholder="π.χ. Νονά">
            </div>
            <div class="row mb-3">
                <div class="col-md-6 mb-3 mb-md-0">
                    <label class="form-label">Τηλέφωνο <span class="required-asterisk">*</span></label>
                    <input type="tel" class="form-control" name="guardianPhone_${guardianId}" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Email <span class="required-asterisk">*</span></label>
                    <input type="email" class="form-control" name="guardianEmail_${guardianId}" required>
                </div>
            </div>
    `;
}

function updateGuardianRelationState(guardianBlock) {
    const relationSelect = guardianBlock.querySelector('.guardian-relation-select');
    const customRelationWrapper = guardianBlock.querySelector('.guardian-custom-relation-wrapper');
    const customRelationInput = guardianBlock.querySelector('.guardian-custom-relation-input');

    if (!relationSelect || !customRelationWrapper || !customRelationInput) {
        return;
    }

    const isOtherSelected = relationSelect.value === 'Άλλο';
    customRelationWrapper.classList.toggle('d-none', !isOtherSelected);
    customRelationInput.required = isOtherSelected;

    if (!isOtherSelected) {
        customRelationInput.value = '';
    }
}

function refreshGuardianTitles() {
    const guardianBlocks = guardiansContainer.querySelectorAll('.guardian-block');
    guardianBlocks.forEach((block, index) => {
        const guardianTitle = block.querySelector('.guardian-title');
        const relationSelect = block.querySelector('.guardian-relation-select');
        const customRelationInput = block.querySelector('.guardian-custom-relation-input');
        const selectedRelation = relationSelect ? relationSelect.value.trim() : '';
        const customRelation = customRelationInput ? customRelationInput.value.trim() : '';
        const fallbackTitle = getDefaultGuardianRoleByIndex(index);

        if (guardianTitle) {
            if (selectedRelation === 'Άλλο') {
                guardianTitle.textContent = customRelation || fallbackTitle;
            } else {
                guardianTitle.textContent = selectedRelation || fallbackTitle;
            }
        }
    });
}

function addGuardian(removable = true) {
    guardiansContainer.insertAdjacentHTML('beforeend', guardianTemplate(guardianCounter, removable));
    const insertedGuardian = guardiansContainer.lastElementChild;
    if (insertedGuardian) {
        updateGuardianRelationState(insertedGuardian);
    }
    guardianCounter += 1;
    refreshGuardianTitles();
}

function initializeGuardians() {
    guardiansContainer.innerHTML = '';
    guardianCounter = 0;
    addGuardian(false);
}

addGuardianBtn.addEventListener('click', function () {
    addGuardian(true);
});

guardiansContainer.addEventListener('click', function (event) {
    const removeButton = event.target.closest('.remove-guardian-btn');
    if (!removeButton) {
        return;
    }

    const guardianId = removeButton.getAttribute('data-guardian-id');
    const guardianBlock = guardiansContainer.querySelector(`[data-guardian-id="${guardianId}"]`);
    if (guardianBlock) {
        guardianBlock.remove();
        refreshGuardianTitles();
    }
});

guardiansContainer.addEventListener('change', function (event) {
    if (event.target.classList.contains('guardian-relation-select')) {
        const guardianBlock = event.target.closest('.guardian-block');
        if (guardianBlock) {
            updateGuardianRelationState(guardianBlock);
        }
        refreshGuardianTitles();
    }
});

guardiansContainer.addEventListener('input', function (event) {
    if (event.target.classList.contains('guardian-custom-relation-input')) {
        refreshGuardianTitles();
    }
});

initializeGuardians();

document.querySelectorAll('.role-option').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();

        const text = this.innerText;
        const val = this.getAttribute('data-value');

        document.getElementById('selectedRoleText').innerText = text;

        roleSelector.value = val;
        roleSelector.dispatchEvent(new Event('change'));

        document.querySelectorAll('.role-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
    });
});

roleSelector.addEventListener('change', function () {
    const studentRequiredFields = studentSections.querySelectorAll('[required]');
    const teacherRequiredFields = teacherSections.querySelectorAll('[required]');

    if (this.value === 'student') {
        studentSections.classList.remove('d-none');
        teacherSections.classList.add('d-none');

        studentRequiredFields.forEach(field => field.required = true);
        teacherRequiredFields.forEach(field => field.required = false);
    } else {
        teacherSections.classList.remove('d-none');
        studentSections.classList.add('d-none');

        teacherRequiredFields.forEach(field => field.required = true);
        studentRequiredFields.forEach(field => field.required = false);
    }
});

const specialtySelect = document.getElementById('specialtySelect');
const teacherSubjectsContainer = document.getElementById('dynamicTeacherSubjectsContainer');

function populateSpecialties() {
    if (!specialtySelect || typeof SPECIALTIES === 'undefined') return;

    Object.values(SPECIALTIES).forEach(spec => {
        const option = document.createElement('option');
        option.value = spec.id;
        option.textContent = spec.title;
        specialtySelect.appendChild(option);
    });
}

function updateTeacherSubjects() {
    const selectedSpecialty = specialtySelect.value;

    teacherSubjectsContainer.innerHTML = '';

    if (!selectedSpecialty || typeof SPECIALTIES === 'undefined' || !SPECIALTIES[selectedSpecialty]) {
        teacherSubjectsContainer.innerHTML = '<span class="text-muted small">Επιλέξτε Ειδικότητα για να εμφανιστούν τα μαθήματα.</span>';
        return;
    }

    const subjectsToRender = SPECIALTIES[selectedSpecialty].subjects;

    subjectsToRender.forEach((subject, index) => {
        const checkboxId = `tsub_${selectedSpecialty}_${index}`;
        const html = `
            <div class="form-check form-check-inline mb-2">
                <input class="form-check-input" type="checkbox" id="${checkboxId}" value="${subject}">
                <label class="form-check-label" for="${checkboxId}">${subject}</label>
            </div>
        `;
        teacherSubjectsContainer.insertAdjacentHTML('beforeend', html);
    });
}

populateSpecialties(); 
updateTeacherSubjects(); 

specialtySelect.addEventListener('change', updateTeacherSubjects);

const userForm = document.getElementById('userForm');
const successAlert = document.getElementById('successAlert');
const successMessage = document.getElementById('successMessage');

userForm.addEventListener('submit', function (e) {
    e.preventDefault();
    userForm.classList.add('d-none');
    successAlert.classList.remove('d-none');

    const currentRole = roleSelector.value === 'student' ? 'μαθητή' : 'καθηγητή';
    successMessage.innerText = `Το προφίλ του ${currentRole} καταχωρήθηκε επιτυχώς!`;

    setTimeout(() => {
        userForm.reset();
        initializeGuardians();
        successAlert.classList.add('d-none');
        userForm.classList.remove('d-none');
        window.scrollTo(0, 0);
    }, 3000);
});

const classSelect = document.getElementById('classSelect');
const directionSelect = document.getElementById('directionSelect');
const subjectsContainer = document.getElementById('dynamicSubjectsContainer');

let subjectsData = {};

async function loadSubjectsData() {
    try {
        const response = await fetch('../../data/subjects.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        subjectsData = await response.json();
    } catch (error) {
        console.error('Σφάλμα φόρτωσης subjects.json:', error);
        subjectsData = {};
    }
}

function updateSubjects() {
    const selectedClass = classSelect.value;
    const selectedDirection = directionSelect.value;
    let subjectsToRender = [];

    if (subjectsData && subjectsData[selectedClass]) {
        const classData = subjectsData[selectedClass];
        subjectsToRender = classData[selectedDirection] || classData["default"] || [];
    }

    subjectsContainer.innerHTML = '';

    if (subjectsToRender.length === 0) {
        subjectsContainer.innerHTML = '<span class="text-muted small">Επιλέξτε Τάξη για να εμφανιστούν τα μαθήματα.</span>';
        return;
    }

    subjectsToRender.forEach((subject, index) => {
        const checkboxId = `sub_${index}`;
        const html = `
            <div class="form-check form-check-inline mb-2">
                <input class="form-check-input" type="checkbox" id="${checkboxId}" value="${subject}">
                <label class="form-check-label" for="${checkboxId}">${subject}</label>
            </div>
        `;
        subjectsContainer.insertAdjacentHTML('beforeend', html);
    });
}

classSelect.addEventListener('change', updateSubjects);
directionSelect.addEventListener('change', updateSubjects);

loadSubjectsData();
