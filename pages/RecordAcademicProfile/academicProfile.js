const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const formArea = document.getElementById('evaluationFormArea');
const nameDisplay = document.getElementById('studentNameDisplay');

function performSearch() {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        formArea.classList.remove('d-none');
        nameDisplay.innerText = query;
        searchInput.setAttribute('disabled', 'true');
        searchBtn.setAttribute('disabled', 'true');
    } else {
        alert('Παρακαλώ πληκτρολογήστε όνομα ή επώνυμο.');
    }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

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
