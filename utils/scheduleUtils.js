// Array shuffling function
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Program generation function
function generateSchedule(days, dayHours, rooms, groups) {
    const result = {};

    for (const day of days) {
        const hours = dayHours[day];
        const n = hours.length;
        const entries = [];
        const groupBusy = Array.from({ length: n }, () => new Set());

        for (const room of shuffle([...rooms])) {
            const roomFilled = new Array(n).fill(false);
            let i = 0;

            while (i < n) {
                if (roomFilled[i]) { i++; continue; }
                if (Math.random() < 0.06) { i++; continue; }

                const free = groups.filter(g => !groupBusy[i].has(g));
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

// Css class based on group name
function getCellClass(group) {
    if (group.startsWith('γ')) return 'sched-cell-gamma';
    if (group.startsWith('Α')) return 'sched-cell-alpha';
    if (group.startsWith('Β')) return 'sched-cell-beta';
    if (group.startsWith('Γ')) return 'sched-cell-delta';
    return '';
}

// Get group details for popover content
function getGroupDetails(groupName, teachers, specialties, studentList) {
    const teacher = teachers.find(t => t.groups.includes(groupName));
    const teacherName = teacher ? teacher.name : "Άγνωστος";

    let targetGrade = "";
    if (groupName.startsWith("γ")) targetGrade = "Γ' Γυμνασίου";
    else if (groupName.startsWith("Α")) targetGrade = "Α' Λυκείου";
    else if (groupName.startsWith("Β")) targetGrade = "Β' Λυκείου";
    else if (groupName.startsWith("Γ")) targetGrade = "Γ' Λυκείου";

    let subject = "Άγνωστο Μάθημα";
    if (teacher && specialties && specialties[teacher.specialty]) {
        const specData = specialties[teacher.specialty];
        const specificSubject = specData.subjects.find(sub => sub.includes(targetGrade));
        subject = specificSubject ? specificSubject : specData.title; 
    }

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

// HTML for schedule cell with popover
function createCellHtml(groupName, teachers, specialties, studentList) {
    const cssClass = getCellClass(groupName);
    const popoverContent = getGroupDetails(groupName, teachers, specialties, studentList);

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
