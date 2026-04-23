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
    renderScheduleWrapper('Δευτέρα');
}

let ROOMS = [];
let DAY_HOURS = {};
let scheduleData = {};

function populateDaysDropdown() {
    const daySelector = document.getElementById('daySelector');
    
    if (!daySelector || typeof DAYS === 'undefined') return;

    daySelector.innerHTML = '';

    DAYS.forEach((day, index) => {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        
        if (index === 0) {
            option.selected = true;
        }
        
        daySelector.appendChild(option);
    });
}

populateDaysDropdown();

function initializeSchedule() {
    DAY_HOURS = buildDayHours(DAYS);
    scheduleData = generateSchedule(DAYS, DAY_HOURS, ROOMS, GROUPS);
}

let TEACHERS = [];
let studentList = [];

function createCellHtmlWrapper(groupName) {
    return createCellHtml(groupName, TEACHERS, SPECIALTIES, studentList);
}

function renderScheduleWrapper(day) {
    renderSchedule(day, scheduleData, DAY_HOURS, ROOMS, createCellHtmlWrapper);
}

// Initialize data and render schedule on page load
Promise.all([loadRoomsData(), loadTeacherData(), loadStudentData()]).then((results) => {
    ROOMS = extractRoomNames(results[0]); // Extract names from full room objects
    TEACHERS = results[1];
    studentList = results[2];
    
    initializeSchedule();
    buildHeader(ROOMS);
    document.getElementById('daySelector').addEventListener('change', function () {
        renderScheduleWrapper(this.value);
    });
});