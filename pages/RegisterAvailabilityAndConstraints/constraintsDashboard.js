const times = buildHalfHourSlots(9, 30, 22, 30);

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

const roomsContainer = document.getElementById('roomsContainer');
const addRoomBtn = document.getElementById('addRoomBtn');
const roomCountBadge = document.getElementById('roomCountBadge');



handleSaturdayToggle();

window.showSuccess = showSuccess;
window.clearTable = clearTable;

syncTeacherHourValidation('#teacherMinHours', '#teacherMaxHours', '#teacherHoursError');

renderTables(times);
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

loadAndProcessRooms().then(() => {
    initializeRooms(roomsContainer, roomCountBadge, addRoomBtn);
    populateFloorPreferences(document.getElementById('floorPreferenceSelect'));
});
