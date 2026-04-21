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

const HOURS = buildHalfHourSlots(9, 30, 22, 30);

let ROOMS = [];

async function loadRoomsData() {
    try {
        const response = await fetch('../../data/rooms.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const roomsData = await response.json();
        if (Array.isArray(roomsData)) {
            ROOMS = roomsData.map(room => room.name.replace('Αίθουσα ', '').trim());
        }
    } catch (error) {
        console.error('Σφάλμα φόρτωσης rooms.json:', error);
        ROOMS = [];
    }
}

const GROUPS = [
    'γ1', 'γ2', 'Α1', 'Α2', 'Α3', 'Α4',
    'Βθ1', 'ΒΘ2', 'ΒΘ3', 'ΒΘ4', 'ΒΥ1', 'ΒΥ2', 'ΒΟ1', 'ΒΟ2', 'ΒΟ3', 'ΒΟ4',
    'ΓΘ1', 'ΓΘ2', 'ΓΘ3', 'ΓΘ4', 'ΓΘ5', 'ΓΥ1', 'ΓΥ2', 'ΓΟ1', 'ΓΟ2', 'ΓΟ3', 'ΓΟ4', 'ΓΟ5'
];

const DAY_HOURS = {
    'Δευτέρα': buildHalfHourSlots(14, 30, 22, 30),
    'Τρίτη': buildHalfHourSlots(14, 30, 22, 30),
    'Τετάρτη': buildHalfHourSlots(14, 30, 22, 30),
    'Πέμπτη': buildHalfHourSlots(14, 30, 22, 30),
    'Παρασκευή': buildHalfHourSlots(14, 30, 22, 30),
    'Σάββατο': buildHalfHourSlots(9, 30, 15, 30)
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

let scheduleData = {};

function initializeSchedule() {
    scheduleData = generateSchedule();
}

let TEACHERS = [];
let studentList = [];

const SPECIALTY_MAP = {
    "fysikos": "Φυσική",
    "mathimatikos": "Μαθηματικά",
    "ximikos": "Χημεία",
    "viologos": "Βιολογία",
    "oikonomologos": "Οικονομία (ΑΟΘ)",
    "filologos": "Έκθεση / Αρχαία",
    "pliroforikos": "Πληροφορική (ΑΕΠΠ)"
};

async function loadTeacherData() {
    try {
        const response = await fetch('../../data/teachers.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data)) {
            TEACHERS = data;
        }
    } catch (error) {
        console.error('Σφάλμα φόρτωσης teachers.json:', error);
        TEACHERS = [];
    }
}

async function loadStudentData() {
    try {
        const response = await fetch('../../data/students.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data)) {
            studentList = data;
        }
    } catch (error) {
        console.error('Σφάλμα φόρτωσης students.json:', error);
        studentList = [];
    }
}

function getCellClass(group) {
    if (group.startsWith('γ')) return 'sched-cell-gamma';
    if (group.startsWith('Α')) return 'sched-cell-alpha';
    if (group.startsWith('Β')) return 'sched-cell-beta';
    if (group.startsWith('Γ')) return 'sched-cell-delta';
    return '';
}

function getGroupDetails(groupName) {
    const teacher = TEACHERS.find(t => t.groups.includes(groupName));
    const teacherName = teacher ? teacher.name : "Άγνωστος";
    const subject = teacher ? SPECIALTY_MAP[teacher.specialty] : "Άγνωστο Μάθημα";

    // Αντιστοίχιση τάξης βάσει πρώτου γράμματος τμήματος
    let targetGrade = "";
    if (groupName.startsWith("γ")) targetGrade = "Γ' Γυμνασίου";
    else if (groupName.startsWith("Α")) targetGrade = "Α' Λυκείου";
    else if (groupName.startsWith("Β")) targetGrade = "Β' Λυκείου";
    else if (groupName.startsWith("Γ")) targetGrade = "Γ' Λυκείου";

    // 5 μαθητές της αντίστοιχης τάξης
    const matchedStudents = studentList
        .filter(s => s.grade === targetGrade)
        .slice(0, 5)
        .map(s => `• ${s.name}`);

    const studentsHtml = matchedStudents.length > 0 
        ? matchedStudents.join('<br>') 
        : "<span class='text-muted'>Δεν βρέθηκαν μαθητές</span>";

    return `
        <div class='mb-1'><strong>Καθηγητής:</strong> ${teacherName}</div>
        <div class='mb-2'><strong>Μάθημα:</strong> ${subject}</div>
        <div><strong>Μαθητές:</strong><br>${studentsHtml}</div>
    `;
}

function createCellHtml(groupName) {
    const cssClass = getCellClass(groupName);
    const popoverContent = getGroupDetails(groupName);

    return `<div class="${cssClass} p-2 rounded text-center" 
             style="cursor: pointer; transition: transform 0.2s;"
             onmouseover="this.style.transform='scale(1.05)'" 
             onmouseout="this.style.transform='scale(1)'"
             data-bs-toggle="popover" 
             data-bs-trigger="hover" 
             data-bs-placement="top"
             data-bs-html="true" 
             title="Τμήμα ${groupName}" 
             data-bs-content="${popoverContent.replace(/"/g, '&quot;')}">
            ${groupName}
        </div>`;
}

function buildHeader() {
    const thead = document.getElementById('scheduleHead');
    let row = '<tr><th>Ώρα / Αίθουσα</th>';
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
                html += '<td>' + createCellHtml(group) + '</td>';
            } else {
                html += '<td></td>';
            }
        });
        html += '</tr>';
    });
    tbody.innerHTML = html;
    
    initPopovers();
}

function initPopovers() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => {
        return new bootstrap.Popover(popoverTriggerEl, {
            container: 'body'
        });
    });
}

// Αρχικοποίηση μετά τη φόρτωση όλων των δεδομένων
Promise.all([loadRoomsData(), loadTeacherData(), loadStudentData()]).then(() => {
    initializeSchedule();
    buildHeader();
    document.getElementById('daySelector').addEventListener('change', function () {
        renderSchedule(this.value);
    });
});