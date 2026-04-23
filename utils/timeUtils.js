// 30-minute time slots generator
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

// Hour slots for each day
function buildDayHours(days) {
    const dayHours = {};
    
    days.forEach(day => {
        if (day === 'Σάββατο') {
            dayHours[day] = buildHalfHourSlots(9, 30, 15, 30);
        } else {
            dayHours[day] = buildHalfHourSlots(14, 30, 22, 30);
        }
    });
    
    return dayHours;
}
