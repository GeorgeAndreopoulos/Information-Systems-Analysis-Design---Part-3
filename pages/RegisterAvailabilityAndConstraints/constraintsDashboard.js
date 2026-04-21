function buildHalfHourSlots(startHour, startMinute, endHour, endMinute) {
    const slots = [];
    let currentMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    while (currentMinutes < endMinutes) {
        const nextMinutes = currentMinutes + 30;
        const fromH = String(Math.floor(currentMinutes / 60)).padStart(2, '0');
        const fromM = String(currentMinutes % 60).padStart(2, '0');
        const toH = String(Math.floor(nextMinutes / 60)).padStart(2, '0');
        const toM = String(nextMinutes % 60).padStart(2, '0');
        slots.push(`${fromH}:${fromM}-${toH}:${toM}`);
        currentMinutes = nextMinutes;
    }

    return slots;
}

const times = buildHalfHourSlots(9, 30, 22, 30);

let roomFloors = [];
let rooms = [];

const dayConfigs = [
    { name: 'Δευτέρα', key: 'mon', open: true, start: '14:30', end: '22:30' },
    { name: 'Τρίτη', key: 'tue', open: true, start: '14:30', end: '22:30' },
    { name: 'Τετάρτη', key: 'wed', open: true, start: '14:30', end: '22:30' },
    { name: 'Πέμπτη', key: 'thu', open: true, start: '14:30', end: '22:30' },
    { name: 'Παρασκευή', key: 'fri', open: true, start: '14:30', end: '22:30' },
    { name: 'Σάββατο', key: 'sat', open: true, start: '09:30', end: '15:30' },
    { name: 'Κυριακή', key: 'sun', open: false, start: '', end: '' }
];

function renderHours() {
    const container = document.getElementById('hoursContainer');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'row g-2';

    dayConfigs.forEach(day => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-4 col-lg';

        const card = document.createElement('div');
        card.className = 'p-2 bg-white border rounded shadow-sm h-100 text-center';

        const title = document.createElement('div');
        title.className = 'fw-bold mb-2';
        title.textContent = day.name;
        if (day.key === 'sun') title.classList.add('text-danger');

        const switchContainer = document.createElement('div');
        switchContainer.className = 'd-flex justify-content-center mb-3';

        const formCheck = document.createElement('div');
        formCheck.className = 'form-check form-switch text-start';

        const toggle = document.createElement('input');
        toggle.className = 'form-check-input day-toggle';
        toggle.type = 'checkbox';
        toggle.checked = day.open;
        toggle.setAttribute('data-day', day.key);

        const label = document.createElement('label');
        label.className = 'form-check-label small fw-bold';
        label.textContent = day.open ? 'Ανοιχτό' : 'Κλειστό';
        if (day.key === 'sun') label.classList.add('text-danger');

        formCheck.appendChild(toggle);
        formCheck.appendChild(label);
        switchContainer.appendChild(formCheck);

        const startGroup = document.createElement('div');
        startGroup.className = 'input-group input-group-sm mb-2';

        const startLabel = document.createElement('span');
        startLabel.className = 'input-group-text bg-light text-muted w-25 justify-content-center';
        startLabel.textContent = 'Από';

        const startInput = document.createElement('input');
        startInput.type = 'time';
        startInput.className = `form-control time-input-${day.key} text-center`;
        startInput.value = day.start;
        if (!day.open) startInput.disabled = true;

        startGroup.appendChild(startLabel);
        startGroup.appendChild(startInput);

        const endGroup = document.createElement('div');
        endGroup.className = 'input-group input-group-sm';

        const endLabel = document.createElement('span');
        endLabel.className = 'input-group-text bg-light text-muted w-25 justify-content-center';
        endLabel.textContent = 'Έως';

        const endInput = document.createElement('input');
        endInput.type = 'time';
        endInput.className = `form-control time-input-${day.key} text-center`;
        endInput.value = day.end;
        if (!day.open) endInput.disabled = true;

        endGroup.appendChild(endLabel);
        endGroup.appendChild(endInput);

        card.appendChild(title);
        card.appendChild(switchContainer);
        card.appendChild(startGroup);
        card.appendChild(endGroup);
        col.appendChild(card);
        row.appendChild(col);
    });

    container.appendChild(row);
}

async function loadRoomsFromJson() {
    try {
        const response = await fetch('../../data/rooms.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            rooms = data.map(room => ({
                name: String(room.name || 'Νέα Αίθουσα'),
                floor: room.floor || 'Άγνωστο',
                capacity: Number(room.capacity) || 1
            }));
            // Extract unique floors
            roomFloors = [...new Set(rooms.map(room => room.floor))].sort();
        } else {
            console.warn('Το rooms.json δεν περιέχει έγκυρη λίστα αιθουσών. Ο πίνακας θα παραμείνει κενός.');
            rooms = [];
            roomFloors = [];
        }
    } catch (error) {
        console.warn('Σφάλμα φόρτωσης rooms.json:', error);
        rooms = [];
        roomFloors = [];
    }
}

const roomsContainer = document.getElementById('roomsContainer');
const addRoomBtn = document.getElementById('addRoomBtn');
const roomCountBadge = document.getElementById('roomCountBadge');

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function createRoomMarkup(room, index) {
    return `
        <div class="col-md-6 col-xl-4 room-row">
            <div class="d-flex gap-1 bg-white p-2 border rounded shadow-sm">
                <input type="text" class="form-control form-control-sm room-name" value="${escapeHtml(room.name)}" placeholder="Όνομα...">
                <select class="form-select form-select-sm room-floor" style="width: 150px;">
                    ${roomFloors.map(floor => `
                        <option value="${escapeHtml(floor)}"${floor === room.floor ? ' selected' : ''}>${escapeHtml(floor)}</option>
                    `).join('')}
                </select>
                <input type="number" class="form-control form-control-sm text-center room-capacity" value="${room.capacity}" style="width: 40px;" title="Χωρητικότητα" min="1">
                <button type="button" class="btn btn-outline-danger btn-sm delete-room" data-index="${index}"><i class="bi bi-trash"></i></button>
            </div>
        </div>
    `;
}

function updateRoomCount() {
    if (roomCountBadge) {
        roomCountBadge.innerText = `Σύνολο: ${rooms.length} Αίθουσες`;
    }
}

function renderRooms() {
    if (!roomsContainer) return;

    if (rooms.length === 0) {
        roomsContainer.innerHTML = `
            <div class="col-12">
                <div class="p-4 bg-white border rounded shadow-sm text-center text-muted">
                    Δεν βρέθηκαν αίθουσες. Βεβαιώσου ότι το αρχείο <code>rooms.json</code> υπάρχει και φορτώνεται σωστά.
                </div>
            </div>`;
    } else {
        roomsContainer.innerHTML = rooms.map(createRoomMarkup).join('');
    }

    updateRoomCount();
}

function deleteRoom(index) {
    if (index >= 0 && index < rooms.length) {
        rooms.splice(index, 1);
        renderRooms();
    }
}

function addRoom() {
    const defaultFloor = roomFloors.length > 0 ? roomFloors[0] : 'Άγνωστο';
    rooms.push({ name: 'Νέα Αίθουσα', floor: defaultFloor, capacity: 5 });
    renderRooms();
}

function bindRoomEvents() {
    if (!roomsContainer) return;

    roomsContainer.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-room');
        if (!deleteButton) return;
        const index = Number(deleteButton.dataset.index);
        deleteRoom(index);
    });

    roomsContainer.addEventListener('input', (event) => {
        const input = event.target;
        const row = input.closest('.room-row');
        if (!row) return;
        const rowIndex = Array.from(roomsContainer.children).indexOf(row);
        if (rowIndex < 0) return;

        const nameInput = row.querySelector('.room-name');
        const floorSelect = row.querySelector('.room-floor');
        const capacityInput = row.querySelector('.room-capacity');

        rooms[rowIndex] = {
            name: nameInput.value,
            floor: floorSelect.value,
            capacity: Number(capacityInput.value)
        };
    });
}

addRoomBtn?.addEventListener('click', addRoom);

function initializeRooms() {
    renderRooms();
    bindRoomEvents();
}

function populateFloorPreferences() {
    const select = document.getElementById('floorPreferenceSelect');
    if (!select) return;

    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }

    roomFloors.forEach(floor => {
        const option = document.createElement('option');
        option.value = floor;
        option.textContent = floor;
        select.appendChild(option);
    });
}

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
renderHours();

// Event listeners for day toggles
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('day-toggle')) {
        const toggle = e.target;
        const day = toggle.getAttribute('data-day');
        const isChecked = toggle.checked;
        const label = toggle.nextElementSibling;
        const card = toggle.closest('.p-2');
        const title = card.querySelector('.fw-bold');
        const timeInputs = card.querySelectorAll('input[type="time"]');

        label.textContent = isChecked ? 'Ανοιχτό' : 'Κλειστό';
        if (day === 'sun') {
            label.classList.toggle('text-danger', !isChecked);
            title.classList.toggle('text-danger', !isChecked);
        }

        timeInputs.forEach(input => {
            input.disabled = !isChecked;
        });
    }
});

loadRoomsFromJson().then(() => {
    initializeRooms();
    populateFloorPreferences();
});
