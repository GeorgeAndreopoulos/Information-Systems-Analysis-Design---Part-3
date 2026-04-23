// Array Header Building
function buildHeader(rooms) {
    const thead = document.getElementById('scheduleHead');
    let row = '<tr><th>Ώρα / Αίθουσα</th>';
    rooms.forEach(r => { row += '<th>' + r + '</th>'; });
    row += '</tr>';
    thead.innerHTML = row;
}

// Program building and rendering
function renderSchedule(
    day,
    scheduleData,
    dayHours,
    rooms,
    createCellHtmlFunc
) {
    const entries = scheduleData[day] || [];
    const dayHoursData = dayHours[day] || [];
    const lookup = {};
    entries.forEach(e => { lookup[e.time + '|' + e.room] = e.group; });

    const tbody = document.getElementById('scheduleBody');
    let html = '';
    dayHoursData.forEach(h => {
        html += '<tr><td>' + h + '</td>';
        rooms.forEach(r => {
            const group = lookup[h + '|' + r];
            if (group) {
                html += '<td>' + createCellHtmlFunc(group) + '</td>';
            } else {
                html += '<td></td>';
            }
        });
        html += '</tr>';
    });
    tbody.innerHTML = html;
    
    initPopovers();
}

// Popover initialization
function initPopovers() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => {
        return new bootstrap.Popover(popoverTriggerEl, {
            container: 'body'
        });
    });
}
