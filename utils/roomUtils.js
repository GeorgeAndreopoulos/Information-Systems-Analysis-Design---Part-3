let roomFloors = [];
let rooms = [];

// Room data loading and processing
async function loadAndProcessRooms() {
    const roomsData = await loadRoomsData();
    if (roomsData && roomsData.length > 0) {
        rooms = roomsData.map(room => ({
            name: String(room.name || 'Νέα Αίθουσα'),
            floor: room.floor || 'Άγνωστο',
            capacity: Number(room.capacity) || 1
        }));
        roomFloors = [...new Set(rooms.map(room => room.floor))].sort();
    } else {
        console.warn('Δεν φορτώθηκαν αίθουσες από το JSON.');
        rooms = [];
        roomFloors = [];
    }
}

// HTML escaping for security
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Room markup generation
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

// Update room count badge
function updateRoomCount(roomCountBadge) {
    if (roomCountBadge) {
        roomCountBadge.innerText = `Σύνολο: ${rooms.length} Αίθουσες`;
    }
}

// Render rooms in the UI
function renderRooms(roomsContainer, roomCountBadge) {
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

    updateRoomCount(roomCountBadge);
}

// Room management functions
function deleteRoom(index, roomsContainer, roomCountBadge) {
    if (index >= 0 && index < rooms.length) {
        rooms.splice(index, 1);
        renderRooms(roomsContainer, roomCountBadge);
    }
}

function addRoom(roomsContainer, roomCountBadge) {
    const defaultFloor = roomFloors.length > 0 ? roomFloors[0] : 'Άγνωστο';
    rooms.push({ name: 'Νέα Αίθουσα', floor: defaultFloor, capacity: 5 });
    renderRooms(roomsContainer, roomCountBadge);
}

// Event binding for dynamic room elements
function bindRoomEvents(roomsContainer, roomCountBadge) {
    if (!roomsContainer) return;

    roomsContainer.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-room');
        if (!deleteButton) return;
        const index = Number(deleteButton.dataset.index);
        deleteRoom(index, roomsContainer, roomCountBadge);
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

// Initialization function to be called on page load
function initializeRooms(roomsContainer, roomCountBadge, addRoomBtn) {
    renderRooms(roomsContainer, roomCountBadge);
    bindRoomEvents(roomsContainer, roomCountBadge);
    addRoomBtn?.addEventListener('click', () => addRoom(roomsContainer, roomCountBadge));
}

// Populate floor preferences in the dropdown
function populateFloorPreferences(floorPreferenceSelect) {
    if (!floorPreferenceSelect) return;

    while (floorPreferenceSelect.children.length > 1) {
        floorPreferenceSelect.removeChild(floorPreferenceSelect.lastChild);
    }

    roomFloors.forEach(floor => {
        const option = document.createElement('option');
        option.value = floor;
        option.textContent = floor;
        floorPreferenceSelect.appendChild(option);
    });
}
