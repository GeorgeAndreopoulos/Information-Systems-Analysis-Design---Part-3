const currentUser = requireAuth();

const ROLE_VOCATIVE = {
    admin: 'Διαχειριστή',
    teacher: 'Καθηγητή',
    student: 'Μαθητή'
};

document.getElementById('darkModeSlot').appendChild(createDarkModeToggle());

const FEATURES = [
    {
        title: 'Νέα Καρτέλα Χρήστη',
        icon: 'bi-person-plus',
        href: 'pages/CreateUserProfile/createUser.html',
        text: 'Δημιουργία νέας καρτέλας μαθητή ή καθηγητή στο σύστημα με τα απαραίτητα προσωπικά και ακαδημαϊκά στοιχεία.',
        roles: ['admin']
    },
    {
        title: 'Δήλωση Περιορισμών',
        icon: 'bi-clock-history',
        href: 'pages/RegisterAvailabilityAndConstraints/constraintsDashboard.html',
        text: 'Ψηφιακή καταχώρηση περιορισμών και διαθεσιμότητας για την τροφοδότηση του αλγορίθμου.',
        roles: ['admin', 'teacher', 'student']
    },
    {
        title: 'Αξιολόγηση Μαθητών',
        icon: 'bi-clipboard2-data',
        href: 'pages/RecordAcademicProfile/academicProfile.html',
        text: 'Καταγραφή και ενημέρωση του μαθησιακού και συμπεριφορικού προφίλ των μαθητών από τους αξιολογητές.',
        roles: ['teacher']
    },
    {
        title: 'Παραγωγή Προγράμματος',
        icon: 'bi-calendar-week',
        href: 'pages/GenerateSchedule/schedulingDashboard.html',
        text: 'Εκκίνηση του αλγορίθμου βελτιστοποίησης, επισκόπηση στατιστικών και οριστικοποίηση ωρολογίου προγράμματος.',
        roles: ['admin']
    }
];

if (currentUser) {
    document.getElementById('roleLabel').textContent = ROLE_LABELS[currentUser.role];
    document.getElementById('userGreeting').textContent = `Γεια σου, ${ROLE_VOCATIVE[currentUser.role]}`;

    document.getElementById('featuresContainer').innerHTML = FEATURES
        .filter(feature => feature.roles.includes(currentUser.role))
        .map(feature => `
            <div class="col-md-6">
                <div class="card feature-card p-4 text-center">
                    <div class="card-body">
                        <i class="bi ${feature.icon} card-icon"></i>
                        <h4 class="card-title fw-bold">${feature.title}</h4>
                        <p class="card-text text-muted mb-4">${feature.text}</p>
                        <a href="${feature.href}" class="btn btn-brand w-100">Μετάβαση <i class="bi bi-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `).join('');
}
