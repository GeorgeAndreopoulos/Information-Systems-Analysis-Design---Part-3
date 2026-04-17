const times = [
    "09:30-10:30", "10:30-11:30", "11:30-12:30", "12:30-13:30",
    "13:30-14:30", "14:30-15:30", "15:30-16:30", "16:30-17:30",
    "17:30-18:30", "18:30-19:30", "19:30-20:30", "20:30-21:30", "21:30-22:30"
];

function validateTeacherHourLimits() {
    const minInput = document.getElementById('teacherMinHours');
    const maxInput = document.getElementById('teacherMaxHours');
    const errorBox = document.getElementById('teacherHoursError');

    if (!minInput || !maxInput || !errorBox) {
        return true;
    }

    const minValue = Number(minInput.value);
    const maxValue = Number(maxInput.value);
    const isHalfStep = (value) => Math.abs(value * 2 - Math.round(value * 2)) < 1e-9;
    const isValid = Number.isFinite(minValue)
        && Number.isFinite(maxValue)
        && isHalfStep(minValue)
        && isHalfStep(maxValue)
        && minValue <= maxValue;

    minInput.classList.toggle('is-invalid', !isValid);
    maxInput.classList.toggle('is-invalid', !isValid);
    errorBox.classList.toggle('d-none', isValid);
    return isValid;
}

function renderTables() {
    const tBody = document.getElementById('teacherBody');
    const sBody = document.getElementById('studentBody');
    if (!tBody || !sBody) return;

    tBody.innerHTML = "";
    sBody.innerHTML = "";

    times.forEach((time, index) => {
        let tRow = `<tr><td class="time-cell">${time}</td>`;
        let sRow = `<tr><td class="time-cell">${time}</td>`;

        for (let day = 0; day < 6; day++) {
            let isPermanentlyDisabled = false;

            if (day < 5 && index < 5) isPermanentlyDisabled = true;
            if (day === 5 && index > 5) isPermanentlyDisabled = true;

            const satClass = (day === 5) ? "sat-col" : "";
            const isSatAndClosed = (day === 5 && index > 5);

            const cellClass = isPermanentlyDisabled ? "cell-disabled" : "clickable-cell";
            const satLimitClass = isSatAndClosed ? "sat-limited" : "";

            const interactionClass = isPermanentlyDisabled ? "" : "teacher-cell";
            const studentInteractionClass = isPermanentlyDisabled ? "" : "student-cell";

            tRow += `<td class="${cellClass} ${satClass} ${satLimitClass} ${interactionClass}"></td>`;
            sRow += `<td class="${cellClass} ${satClass} ${satLimitClass} ${studentInteractionClass}" data-info="${getDayName(day)} ${time}"></td>`;
        }
        tBody.innerHTML += tRow + `</tr>`;
        sBody.innerHTML += sRow + `</tr>`;
    });

    initInteractions();
}

function getDayName(i) {
    return ["Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"][i];
}

function initInteractions() {
    document.querySelectorAll('.teacher-cell').forEach(cell => {
        cell.addEventListener('click', function () {
            if (this.classList.contains('cell-disabled')) return;
            this.classList.toggle('cell-available');
        });
    });

    const jCard = document.getElementById('justificationCard');
    const jList = document.getElementById('justificationList');

    document.querySelectorAll('.student-cell').forEach(cell => {
        cell.addEventListener('click', function () {
            if (this.classList.contains('cell-disabled')) return;

            this.classList.toggle('cell-unavailable');
            const info = this.getAttribute('data-info');
            const safeId = "j-" + info.replace(/[:\s-]/g, "");

            if (this.classList.contains('cell-unavailable')) {
                const div = document.createElement('div');
                div.id = safeId;
                div.className = "row mb-2 align-items-center animate-fadeIn";
                div.innerHTML = `
                            <div class="col-5 small fw-bold text-danger" style="font-size:0.85rem;">
                                <i class="bi bi-exclamation-circle me-1"></i>${info}
                            </div>
                            <div class="col-7">
                                <select class="form-select select-justification" style="font-size:0.75rem;" data-target-info="${info}">
                                    <option value="" disabled selected>Επιλέξτε λόγο...</option>
                                    <option value="Σχολείο">Σχολικό Ωράριο </option>
                                    <option value="Σχέδιο">Γραμμικό & Ελεύθερο Σχέδιο </option>
                                    <option value="Ξένες Γλώσσες">Φροντιστήριο Ξένων Γλωσσών </option>
                                    <option value="Αθλητισμός">Αθλητικές Δραστηριότητες </option>
                                    <option value="Τέχνες">Ωδείο / Τέχνες </option>
                                    <option value="Άλλο">Άλλη Δραστηριότητα</option>
                                </select>
                            </div>`;
                jList.appendChild(div);

                const select = div.querySelector('select');
                select.addEventListener('change', function () {
                    cell.innerText = this.value;
                    cell.style.color = "white";
                    cell.style.fontWeight = "bold";
                    cell.style.fontSize = "0.9rem";
                    cell.style.textAlign = "center";
                });

            } else {
                const el = document.getElementById(safeId);
                if (el) el.remove();
                cell.innerText = "";
            }

            if (jCard) jCard.classList.toggle('d-none', jList.children.length === 0);
        });
    });
}

document.getElementById('saturdayToggle').addEventListener('change', function () {
    const isEnabled = this.checked;
    const satCells = document.querySelectorAll('td.sat-col');

    satCells.forEach(cell => {
        if (!isEnabled) {
            cell.classList.add('cell-disabled');
            cell.classList.remove('cell-available', 'clickable-cell', 'teacher-cell');
        } else {
            if (!cell.classList.contains('sat-limited')) {
                cell.classList.remove('cell-disabled');
                cell.classList.add('clickable-cell', 'teacher-cell');
            }
        }
    });
});

function showSuccess(role) {
    if (role === 'teacher' && !validateTeacherHourLimits()) {
        return;
    }

    const mainContainer = document.getElementById('mainAppContainer');
    const successView = document.getElementById('finalSuccessView');
    const title = document.getElementById('finalMessageTitle');
    const sub = document.getElementById('finalMessageSub');

    if (role === 'admin') {
        title.innerText = "Επιτυχής Καταχώρηση Ρυθμίσεων!";
        sub.innerText = "Οι λειτουργικοί περιορισμοί του φροντιστηρίου ενημερώθηκαν επιτυχώς.";
    } else if (role === 'teacher') {
        title.innerText = "Επιτυχής Καταχώρηση Διαθεσιμότητας!";
        sub.innerText = "Το εβδομαδιαίο πρόγραμμα διαθεσιμότητάς σας υποβλήθηκε επιτυχώς.";
    } else if (role === 'student') {
        title.innerText = "Επιτυχής Καταχώρηση Περιορισμών!";
        sub.innerText = "Οι προσωπικοί σας περιορισμοί υποβλήθηκαν επιτυχώς.";
    }

    mainContainer.classList.add('d-none');
    successView.classList.remove('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.showSuccess = showSuccess;

function clearTable(cls) {
    document.querySelectorAll('.' + cls).forEach(c => {
        c.classList.remove('cell-available', 'cell-unavailable');
        c.innerText = "";
    });
    if (cls === 'student-cell') {
        document.getElementById('justificationList').innerHTML = "";
        document.getElementById('justificationCard').classList.add('d-none');
        document.getElementById('studentComments').value = "";
    }
}

window.clearTable = clearTable;

const teacherMinHoursInput = document.getElementById('teacherMinHours');
const teacherMaxHoursInput = document.getElementById('teacherMaxHours');

if (teacherMinHoursInput && teacherMaxHoursInput) {
    const syncTeacherHourValidation = () => {
        teacherMaxHoursInput.min = teacherMinHoursInput.value || "0";
        validateTeacherHourLimits();
    };

    teacherMinHoursInput.addEventListener('input', syncTeacherHourValidation);
    teacherMaxHoursInput.addEventListener('input', validateTeacherHourLimits);
    syncTeacherHourValidation();
}

renderTables();
