const roleSelector = document.getElementById('roleSelector');
const studentSections = document.getElementById('studentSections');
const teacherSections = document.getElementById('teacherSections');
const guardiansContainer = document.getElementById('guardiansContainer');
const addGuardianBtn = document.getElementById('addGuardianBtn');
let guardianCounter = 0;

function addGuardian(removable = true) {
    const guardianTag = `<app-guardian guardian-id="${guardianCounter}" removable="${removable}"></app-guardian>`;
    guardiansContainer.insertAdjacentHTML('beforeend', guardianTag);
    guardianCounter += 1;
}

function initializeGuardians() {
    guardiansContainer.innerHTML = '';
    guardianCounter = 0;
    addGuardian(false);
}

if (addGuardianBtn) {
    addGuardianBtn.addEventListener('click', function () {
        addGuardian(true);
    });
}

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
    const isStudent = this.value === 'student';

    studentSections.classList.toggle('d-none', !isStudent);
    teacherSections.classList.toggle('d-none', isStudent);

    studentSections.querySelectorAll('[required]').forEach(field => field.required = isStudent);
    teacherSections.querySelectorAll('[required]').forEach(field => field.required = !isStudent);
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

loadSubjectsData().then(data => {
    if (data) {
        subjectsData = data;
        updateSubjects();
    }
}).catch(error => {
    console.error("Σφάλμα κατά τη φόρτωση μαθημάτων:", error);
});
