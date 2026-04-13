const startBtn = document.getElementById('startAlgoBtn');
const loadingArea = document.getElementById('loadingArea');
const progressBar = document.getElementById('mainProgressBar');
const resultsArea = document.getElementById('resultsArea');

startBtn.addEventListener('click', function () {
    startBtn.classList.add('d-none');
    loadingArea.classList.remove('d-none');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress > 100) progress = 100;

        progressBar.style.width = progress + '%';
        progressBar.innerText = progress + '%';

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(showResults, 800);
        }
    }, 400);
});

function showResults() {
    loadingArea.classList.add('d-none');
    resultsArea.classList.remove('d-none');
    resultsArea.scrollIntoView({ behavior: 'smooth' });
    renderSchedule('Δευτέρα');
}

const HOURS = [
    '9:30', '10:30', '11:30', '12:30', '13:30', '14:30',
    '15:30', '16:30', '17:30', '18:30', '19:30', '20:30', '21:30', '22:30'
];

const ROOMS = [
    'I1', 'I2', 'I3', 'I4',
    'Υ1', 'Υ2', 'Υ3',
    'Α101', 'Α102', 'Α103', 'Α104',
    'Α201', 'Α202', 'Α203', 'Α204', 'Α205', 'Α206'
];

const GROUPS = [
    'γ1', 'γ2', 'Α1', 'Α2', 'Α3', 'Α4',
    'Βθ1', 'Βθ2', 'ΒΘ3', 'Βθ4', 'ΒΥ1', 'ΒΥ2', 'ΒΟ1', 'ΒΟ2', 'ΒΟ3', 'ΒΟ4',
    'ΓΘ1', 'ΓΘ2', 'ΓΘ3', 'ΓΘ4', 'ΓΘ5', 'ΓΥ1', 'ΓΥ2', 'ΓΟ1', 'ΓΟ2', 'ΓΟ3', 'ΓΟ4', 'ΓΟ5'
];

const DAY_HOURS = {
    'Δευτέρα': ['15:30', '16:30', '17:30', '18:30', '19:30', '20:30', '21:30', '22:30'],
    'Τρίτη': ['15:30', '16:30', '17:30', '18:30', '19:30', '20:30', '21:30', '22:30'],
    'Τετάρτη': ['15:30', '16:30', '17:30', '18:30', '19:30', '20:30', '21:30', '22:30'],
    'Πέμπτη': ['15:30', '16:30', '17:30', '18:30', '19:30', '20:30', '21:30', '22:30'],
    'Παρασκευή': ['15:30', '16:30', '17:30', '18:30', '19:30', '20:30', '21:30', '22:30'],
    'Σάββατο': ['9:30', '10:30', '11:30', '12:30', '13:30', '14:30']
};

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function generateSchedule() {
    const result = {};
    const DAYS = ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];

    for (const day of DAYS) {
        const hours = DAY_HOURS[day];
        const n = hours.length;
        const entries = [];

        const groupBusy = Array.from({ length: n }, () => new Set());

        for (const room of shuffle([...ROOMS])) {
            const roomFilled = new Array(n).fill(false);
            let i = 0;

            while (i < n) {
                if (roomFilled[i]) { i++; continue; }

                if (Math.random() < 0.06) { i++; continue; }

                const free = GROUPS.filter(g => !groupBusy[i].has(g));
                if (free.length === 0) { i++; continue; }
                const group = free[Math.floor(Math.random() * free.length)];

                let maxLen = 0;
                for (let j = i; j < n && maxLen < 6; j++) {
                    if (!roomFilled[j] && !groupBusy[j].has(group)) maxLen++;
                    else break;
                }
                if (maxLen < 2) { i++; continue; }

                const blockSize = 2 + Math.floor(Math.random() * (Math.min(6, maxLen) - 1));

                for (let k = 0; k < blockSize; k++) {
                    roomFilled[i + k] = true;
                    groupBusy[i + k].add(group);
                    entries.push({ time: hours[i + k], room, group });
                }
                i += blockSize;
            }
        }
        result[day] = entries;
    }
    return result;
}

const scheduleData = generateSchedule();

function getCellClass(group) {
    if (group.startsWith('γ')) return 'sched-cell-gamma';
    if (group.startsWith('Α')) return 'sched-cell-alpha';
    if (group.startsWith('Β')) return 'sched-cell-beta';
    if (group.startsWith('Γ')) return 'sched-cell-delta';
    return '';
}

function buildHeader() {
    const thead = document.getElementById('scheduleHead');
    let row = '<tr><th>Ώρα</th>';
    ROOMS.forEach(r => { row += '<th>' + r + '</th>'; });
    row += '</tr>';
    thead.innerHTML = row;
}

function renderSchedule(day) {
    const entries = scheduleData[day] || [];
    const dayHours = DAY_HOURS[day] || HOURS;
    const lookup = {};
    entries.forEach(e => { lookup[e.time + '|' + e.room] = e.group; });

    const tbody = document.getElementById('scheduleBody');
    let html = '';
    dayHours.forEach(h => {
        html += '<tr><td>' + h + '</td>';
        ROOMS.forEach(r => {
            const group = lookup[h + '|' + r];
            if (group) {
                html += '<td class="' + getCellClass(group) + '">' + group + '</td>';
            } else {
                html += '<td></td>';
            }
        });
        html += '</tr>';
    });
    tbody.innerHTML = html;
}

buildHeader();

document.getElementById('daySelector').addEventListener('change', function () {
    renderSchedule(this.value);
});
