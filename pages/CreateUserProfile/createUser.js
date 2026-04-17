const roleSelector = document.getElementById('roleSelector');
const studentSections = document.getElementById('studentSections');
const teacherSections = document.getElementById('teacherSections');

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

const teacherSubjectsMap = {
    "filologos": ["Έκθεση Γ' Γυμνασίου", "Έκθεση Α' Λυκείου", "Έκθεση Β' Λυκείου", "Έκθεση Γ' Λυκείου"],
    "mathimatikos": ["Μαθηματικά Γ' Γυμνασίου", "Άλγεβρα Α' Λυκείου", "Άλγεβρα Β' Λυκείου", "Μαθηματικά Κατεύθυνσης Β' Λυκείου", "Μαθηματικά Γ' Λυκείου"],
    "ximikos": ["Χημεία Α' Λυκείου", "Χημεία Β' Λυκείου", "Χημεία Γ' Λυκείου"],
    "fysikos": ["Φυσική Γ' Γυμνασίου", "Φυσική Α' Λυκείου", "Φυσική Β' Λυκείου", "Φυσική Γ' Λυκείου"],
    "pliroforikos": ["ΑΕΠΠ Β' Λυκείου", "ΑΕΠΠ Γ' Λυκείου"],
    "oikonomologos": ["ΑΟΘ Β' Λυκείου", "ΑΟΘ Γ' Λυκείου"],
    "viologos": ["Βιολογία Β' Λυκείου", "Βιολογία Γ' Λυκείου"]
};

function updateTeacherSubjects() {
    const selectedSpecialty = specialtySelect.value;
    const subjectsToRender = teacherSubjectsMap[selectedSpecialty];

    teacherSubjectsContainer.innerHTML = '';

    if (!subjectsToRender) {
        teacherSubjectsContainer.innerHTML = '<span class="text-muted small">Επιλέξτε Ειδικότητα για να εμφανιστούν τα μαθήματα.</span>';
        return;
    }

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

specialtySelect.addEventListener('change', updateTeacherSubjects);
updateTeacherSubjects();

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
        successAlert.classList.add('d-none');
        userForm.classList.remove('d-none');
        window.scrollTo(0, 0);
    }, 3000);
});

const classSelect = document.getElementById('classSelect');
const directionSelect = document.getElementById('directionSelect');
const subjectsContainer = document.getElementById('dynamicSubjectsContainer');

function updateSubjects() {
    const selectedClass = classSelect.value;
    const selectedDirection = directionSelect.value;
    let subjectsToRender = [];

    if (selectedClass === "gymnasio") {
        subjectsToRender = ["Έκθεση", "Μαθηματικά", "Φυσική"];

    } else if (selectedClass === "alyk") {
        if (selectedDirection === "oikonomia") {
            subjectsToRender = ["Έκθεση", "Άλγεβρα"];
        } else {
            subjectsToRender = ["Έκθεση", "Άλγεβρα", "Φυσική", "Χημεία"];
        }

    } else if (selectedClass === "blyk") {
        if (selectedDirection === "oikonomia") {
            subjectsToRender = ["Έκθεση", "Άλγεβρα", "Μαθηματικά Κατεύθυνσης", "Πληροφορική (ΑΕΠΠ)", "Οικονομία (ΑΟΘ)"];
        } else if (selectedDirection === "thetiki") {
            subjectsToRender = ["Έκθεση", "Άλγεβρα", "Μαθηματικά Κατεύθυνσης", "Φυσική", "Χημεία"];
        } else {
            subjectsToRender = ["Έκθεση", "Άλγεβρα", "Φυσική", "Χημεία", "Βιολογία"];
        }

    } else if (selectedClass === "glyk") {
        if (selectedDirection === "thetiki") {
            subjectsToRender = ["Έκθεση", "Μαθηματικά", "Φυσική", "Χημεία"];
        } else if (selectedDirection === "oikonomia") {
            subjectsToRender = ["Έκθεση", "Μαθηματικά", "Πληροφορική (ΑΕΠΠ)", "Οικονομία (ΑΟΘ)"];
        } else {
            subjectsToRender = ["Έκθεση", "Φυσική", "Χημεία", "Βιολογία"];
        }
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

updateSubjects();
