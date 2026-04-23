// Validation logic for teacher hour limits and success message handling

function validateTeacherHourLimits(minInputSelector, maxInputSelector, errorBoxSelector) {
    const minInput = document.querySelector(minInputSelector);
    const maxInput = document.querySelector(maxInputSelector);
    const errorBox = document.querySelector(errorBoxSelector);

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

function syncTeacherHourValidation(minInputSelector, maxInputSelector, errorBoxSelector) {
    const minInput = document.querySelector(minInputSelector);
    const maxInput = document.querySelector(maxInputSelector);
    
    if (!minInput || !maxInput) return;

    const syncFunc = () => {
        maxInput.min = minInput.value || "0";
        validateTeacherHourLimits(minInputSelector, maxInputSelector, errorBoxSelector);
    };

    minInput.addEventListener('input', syncFunc);
    maxInput.addEventListener('input', () => validateTeacherHourLimits(minInputSelector, maxInputSelector, errorBoxSelector));
    syncFunc();
}

// Function to display success message after form submission with role-specific content
function showSuccess(role) {
    if (role === 'teacher' && !validateTeacherHourLimits('#teacherMinHours', '#teacherMaxHours', '#teacherHoursError')) {
        return;
    }

    const mainContainer = document.getElementById('mainAppContainer');
    const successView = document.getElementById('finalSuccessView');
    const title = document.getElementById('finalMessageTitle');
    const sub = document.getElementById('finalMessageSub');

    const messages = {
        'admin': {
            title: "Επιτυχής Καταχώρηση Ρυθμίσεων!",
            sub: "Οι λειτουργικοί περιορισμοί του φροντιστηρίου ενημερώθηκαν επιτυχώς."
        },
        'teacher': {
            title: "Επιτυχής Καταχώρηση Διαθεσιμότητας!",
            sub: "Το εβδομαδιαίο πρόγραμμα διαθεσιμότητάς σας υποβλήθηκε επιτυχώς."
        },
        'student': {
            title: "Επιτυχής Καταχώρηση Περιορισμών!",
            sub: "Οι προσωπικοί σας περιορισμοί υποβλήθηκαν επιτυχώς."
        }
    };

    if (messages[role]) {
        title.innerText = messages[role].title;
        sub.innerText = messages[role].sub;
    }

    mainContainer.classList.add('d-none');
    successView.classList.remove('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
