const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const suggestionsArea = document.getElementById('suggestionsArea');
const formArea = document.getElementById('evaluationFormArea');
const nameDisplay = document.getElementById('studentNameDisplay');
const gradeBadge = document.getElementById('studentGradeBadge');
const directionBadge = document.getElementById('studentDirectionBadge');
const schoolGradesContainer = document.getElementById('schoolGradesContainer');

let studentList = [];
let selectedStudent = null;

const subjectsByDirection = {
    "Κατεύθυνση Θετικών Σπουδών": ["Έκθεση", "Μαθηματικά", "Φυσική", "Χημεία"],
    "Κατεύθυνση Σπουδών Υγείας": ["Έκθεση", "Φυσική", "Χημεία", "Βιολογία"],
    "Κατεύθυνση Οικονομίας & Πληροφορικής": ["Έκθεση", "Μαθηματικά", "Πληροφορική (ΑΕΠΠ)", "Οικονομία (ΑΟΘ)"],
    "Γενική Παιδεία": ["Έκθεση", "Άλγεβρα", "Φυσική", "Χημεία", "Ιστορία"]
};

function getSubjectsForStudent(student) {
    if (!student) {
        return subjectsByDirection["Γενική Παιδεία"];
    }
    const subjects = subjectsByDirection[student.direction] || subjectsByDirection["Γενική Παιδεία"];

    if (student.direction === "Κατεύθυνση Οικονομίας & Πληροφορικής") {
        return subjects.filter(subject => subject !== "Οικονομία (ΑΟΘ)");
    }

    return subjects;
}

function renderSchoolGrades(student) {
    if (!schoolGradesContainer) return;

    const subjects = getSubjectsForStudent(student);
    schoolGradesContainer.innerHTML = subjects.map((subject, index) => `
        <div class="col-md-6 col-xl-4">
            <label class="form-label">${subject} <span class="required-asterisk">*</span></label>
            <div class="input-group">
                <input
                    type="number"
                    class="form-control"
                    name="schoolSubjectGrade_${index}"
                    min="0"
                    max="20"
                    step="0.5"
                    placeholder="0-20"
                    required
                >
                <span class="input-group-text">/20</span>
            </div>
        </div>
    `).join('');
}

function findStudentByQuery(query) {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return null;

    return studentList.find(student => student.name.toLowerCase() === normalizedQuery)
        || studentList.find(student => student.name.toLowerCase().includes(normalizedQuery))
        || null;
}

async function loadStudentData() {
    if (!suggestionsArea) return;

    suggestionsArea.innerHTML = `
        <div class="alert alert-info py-2 shadow-sm mb-0" role="alert">
            Φόρτωση προτεινόμενων μαθητών...
        </div>
    `;

    try {
        const response = await fetch('./students.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
            studentList = data;
        } else {
            studentList = [];
            console.warn('students.json δεν περιέχει λίστα μαθητών.');
        }
    } catch (error) {
        console.error('Σφάλμα φόρτωσης students.json:', error);
        studentList = [];
        suggestionsArea.innerHTML = `
            <div class="alert alert-warning py-2 shadow-sm mb-0" role="alert">
                Δεν μπόρεσαν να φορτωθούν οι προτεινόμενοι μαθητές.
            </div>
        `;
        return;
    }

    filterSuggestions();
}

function renderSuggestions(results) {
    if (!suggestionsArea) return;

    if (results.length === 0) {
        suggestionsArea.innerHTML = `
            <div class="alert alert-light py-2 shadow-sm mb-0" role="alert">
                Δεν βρέθηκαν μαθητές που να ταιριάζουν. Δοκιμάστε διαφορετικό όνομα.
            </div>
        `;
        return;
    }

    suggestionsArea.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="fw-bold">Προτεινόμενοι μαθητές</div>
            <div class="text-muted small">Πατήστε για να ανοίξετε την αξιολόγηση.</div>
        </div>
        <div class="suggestions-list">
            <div class="row g-3">
                ${results.map(student => `
                    <div class="col-12 col-md-6 col-xl-4">
                        <button type="button" class="card text-start h-100 shadow-sm border-0 text-dark p-3 w-100 text-start suggestion-card" data-name="${student.name}">
                            <div class="card-body p-0">
                                <h6 class="card-title mb-1 fw-bold">${student.name}</h6>
                                <p class="card-text mb-1"><span class="badge bg-secondary">${student.grade}</span></p>
                                <p class="card-text text-muted small mb-0">${student.direction}</p>
                            </div>
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', function () {
            const selectedName = this.dataset.name;
            searchInput.value = selectedName;
            performSearch();
        });
    });
}

function filterSuggestions() {
    const query = searchInput.value.trim().toLowerCase();
    if (query.length === 0) {
        renderSuggestions(studentList);
        return;
    }

    const matches = studentList.filter(student => {
        return student.name.toLowerCase().includes(query);
    });

    renderSuggestions(matches);
}

function performSearch() {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        selectedStudent = findStudentByQuery(query);
        formArea.classList.remove('d-none');
        nameDisplay.innerText = selectedStudent ? selectedStudent.name : query;
        if (selectedStudent) {
            gradeBadge.innerText = selectedStudent.grade;
            directionBadge.innerText = selectedStudent.direction;
        } else {
            gradeBadge.innerText = 'Τάξη μη διαθέσιμη';
            directionBadge.innerText = 'Κατεύθυνση μη διαθέσιμη';
        }
        renderSchoolGrades(selectedStudent);
        searchInput.setAttribute('disabled', 'true');
        searchBtn.setAttribute('disabled', 'true');
        if (suggestionsArea) {
            suggestionsArea.classList.add('d-none');
        }
    } else {
        alert('Παρακαλώ πληκτρολογήστε όνομα ή επώνυμο.');
    }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('input', filterSuggestions);
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

loadStudentData();
renderSchoolGrades(null);

const sliderValueIds = ['valPace', 'valExtro', 'valStress', 'valTeam', 'valFocus', 'valMethod'];
document.querySelectorAll('#evaluationForm .custom-range').forEach((range, i) => {
    const id = sliderValueIds[i];
    if (!id) return;
    const badge = document.getElementById(id);
    if (badge) {
        range.addEventListener('input', function () {
            badge.textContent = this.value;
        });
    }
});

const evalForm = document.getElementById('evaluationForm');
const successAlert = document.getElementById('successAlert');

evalForm.addEventListener('submit', function (e) {
    e.preventDefault();

    evalForm.classList.add('d-none');
    successAlert.classList.remove('d-none');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
        location.reload();
    }, 3000);
});
