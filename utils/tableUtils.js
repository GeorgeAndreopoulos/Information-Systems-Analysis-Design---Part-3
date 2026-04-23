// Table rendering and interaction logic

function getDayName(dayIndex) {
    return DAYS[dayIndex];
}

function renderTableHeaders(times) {
    const teacherHead = document.getElementById('teacherHead');
    const studentHead = document.getElementById('studentHead');
    
    if (teacherHead) {
        let teacherHeaderHtml = '<tr><th>Ώρα</th>';
        DAYS.forEach((day, index) => {
            const satClass = index === 5 ? ' class="sat-col"' : '';
            teacherHeaderHtml += `<th${satClass}>${day}</th>`;
        });
        teacherHeaderHtml += '</tr>';
        teacherHead.innerHTML = teacherHeaderHtml;
    }
    
    if (studentHead) {
        let studentHeaderHtml = '<tr><th>Ώρα</th>';
        DAYS.forEach(day => {
            studentHeaderHtml += `<th>${day}</th>`;
        });
        studentHeaderHtml += '</tr>';
        studentHead.innerHTML = studentHeaderHtml;
    }
}

function renderTableBodies(times) {
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

            if (day < 5 && index < 10) isPermanentlyDisabled = true;
            if (day === 5 && index > 11) isPermanentlyDisabled = true;

            const satClass = (day === 5) ? "sat-col" : "";
            const isSatAndClosed = (day === 5 && index > 11);

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
}

function renderTables(times) {
    renderTableHeaders(times);
    renderTableBodies(times);
    initInteractions();
}

// Teacher interaction with table cells
function initTeacherInteractions() {
    document.querySelectorAll('.teacher-cell').forEach(cell => {
        cell.addEventListener('click', function () {
            if (this.classList.contains('cell-disabled')) return;
            this.classList.toggle('cell-available');
        });
    });
}

// Student interaction with table cells and justification logic
function initStudentInteractions() {
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

function initInteractions() {
    initTeacherInteractions();
    initStudentInteractions();
}

// Validation and synchronization logic for teacher hour limits
function handleSaturdayToggle() {
    document.getElementById('saturdayToggle')?.addEventListener('change', function () {
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
}

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
