// Loading rooms data - returns full room objects with all properties
async function loadRoomsData() {
    try {
        const response = await fetch('../../data/rooms.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const roomsData = await response.json();
        if (Array.isArray(roomsData)) {
            return roomsData;
        }
    } catch (error) {
        console.error('Σφάλμα φόρτωσης rooms.json:', error);
    }
    return [];
}

// Extract just room names (for scheduling algorithm)
function extractRoomNames(roomObjects) {
    return roomObjects.map(room => room.name.replace('Αίθουσα ', '').trim());
}

// Loading teachers data
async function loadTeacherData() {
    try {
        const response = await fetch('../../data/teachers.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data)) {
            return data;
        }
    } catch (error) {
        console.error('Σφάλμα φόρτωσης teachers.json:', error);
    }
    return [];
}

// Loading students data
async function loadStudentData() {
    try {
        const response = await fetch('../../data/students.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
            return data;
        }
    } catch (error) {
        console.error('Σφάλμα φόρτωσης students.json:', error);
    }
    return [];
}

// Load subjects data
async function loadSubjectsData() {
    try {
        const response = await fetch('../../data/subjects.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        subjectsData = await response.json();
    } catch (error) {
        console.error('Σφάλμα φόρτωσης subjects.json:', error);
        subjectsData = {};
    }
}