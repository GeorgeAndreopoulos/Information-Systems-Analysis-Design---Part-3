const currentUser = requireAuth();

document.getElementById('darkModeSlot').appendChild(createDarkModeToggle());

const FEATURES = [
    {
        title: '╬¥╬¡╬▒ ╬Ü╬▒╧ü╧ä╬¡╬╗╬▒ ╬º╧ü╬«╧â╧ä╬╖',
        icon: 'bi-person-plus',
        href: 'pages/CreateUserProfile/createUser.html',
        text: '╬ö╬╖╬╝╬╣╬┐╧à╧ü╬│╬»╬▒ ╬╜╬¡╬▒╧é ╬║╬▒╧ü╧ä╬¡╬╗╬▒╧é ╬╝╬▒╬╕╬╖╧ä╬« ╬« ╬║╬▒╬╕╬╖╬│╬╖╧ä╬« ╧â╧ä╬┐ ╧â╧ì╧â╧ä╬╖╬╝╬▒ ╬╝╬╡ ╧ä╬▒ ╬▒╧Ç╬▒╧ü╬▒╬»╧ä╬╖╧ä╬▒ ╧Ç╧ü╬┐╧â╧ë╧Ç╬╣╬║╬¼ ╬║╬▒╬╣ ╬▒╬║╬▒╬┤╬╖╬╝╬▒╧è╬║╬¼ ╧â╧ä╬┐╬╣╧ç╬╡╬»╬▒.',
        roles: ['admin']
    },
    {
        title: '╬ö╬«╬╗╧ë╧â╬╖ ╬á╬╡╧ü╬╣╬┐╧ü╬╣╧â╬╝╧Ä╬╜',
        icon: 'bi-clock-history',
        href: 'pages/RegisterAvailabilityAndConstraints/constraintsDashboard.html',
        text: '╬¿╬╖╧å╬╣╬▒╬║╬« ╬║╬▒╧ä╬▒╧ç╧Ä╧ü╬╖╧â╬╖ ╧Ç╬╡╧ü╬╣╬┐╧ü╬╣╧â╬╝╧Ä╬╜ ╬║╬▒╬╣ ╬┤╬╣╬▒╬╕╬╡╧â╬╣╬╝╧î╧ä╬╖╧ä╬▒╧é ╬│╬╣╬▒ ╧ä╬╖╬╜ ╧ä╧ü╬┐╧å╬┐╬┤╧î╧ä╬╖╧â╬╖ ╧ä╬┐╧à ╬▒╬╗╬│╬┐╧ü╬»╬╕╬╝╬┐╧à.',
        roles: ['admin', 'teacher', 'student']
    },
    {
        title: '╬æ╬╛╬╣╬┐╬╗╧î╬│╬╖╧â╬╖ ╬£╬▒╬╕╬╖╧ä╧Ä╬╜',
        icon: 'bi-clipboard2-data',
        href: 'pages/RecordAcademicProfile/academicProfile.html',
        text: '╬Ü╬▒╧ä╬▒╬│╧ü╬▒╧å╬« ╬║╬▒╬╣ ╬╡╬╜╬╖╬╝╬¡╧ü╧ë╧â╬╖ ╧ä╬┐╧à ╬╝╬▒╬╕╬╖╧â╬╣╬▒╬║╬┐╧ì ╬║╬▒╬╣ ╧â╧à╬╝╧Ç╬╡╧ü╬╣╧å╬┐╧ü╬╣╬║╬┐╧ì ╧Ç╧ü╬┐╧å╬»╬╗ ╧ä╧ë╬╜ ╬╝╬▒╬╕╬╖╧ä╧Ä╬╜ ╬▒╧Ç╧î ╧ä╬┐╧à╧é ╬▒╬╛╬╣╬┐╬╗╬┐╬│╬╖╧ä╬¡╧é.',
        roles: ['teacher']
    },
    {
        title: '╬á╬▒╧ü╬▒╬│╧ë╬│╬« ╬á╧ü╬┐╬│╧ü╬¼╬╝╬╝╬▒╧ä╬┐╧é',
        icon: 'bi-calendar-week',
        href: 'pages/GenerateSchedule/schedulingDashboard.html',
        text: '╬ò╬║╬║╬»╬╜╬╖╧â╬╖ ╧ä╬┐╧à ╬▒╬╗╬│╬┐╧ü╬»╬╕╬╝╬┐╧à ╬▓╬╡╬╗╧ä╬╣╧â╧ä╬┐╧Ç╬┐╬»╬╖╧â╬╖╧é, ╬╡╧Ç╬╣╧â╬║╧î╧Ç╬╖╧â╬╖ ╧â╧ä╬▒╧ä╬╣╧â╧ä╬╣╬║╧Ä╬╜ ╬║╬▒╬╣ ╬┐╧ü╬╣╧â╧ä╬╣╬║╬┐╧Ç╬┐╬»╬╖╧â╬╖ ╧ë╧ü╬┐╬╗╬┐╬│╬»╬┐╧à ╧Ç╧ü╬┐╬│╧ü╬¼╬╝╬╝╬▒╧ä╬┐╧é.',
        roles: ['admin']
    }
];

if (currentUser) {
    document.getElementById('roleLabel').textContent = ROLE_LABELS[currentUser.role];

    document.getElementById('featuresContainer').innerHTML = FEATURES
        .filter(feature => feature.roles.includes(currentUser.role))
        .map(feature => `
            <div class="col-md-6">
                <div class="card feature-card p-4 text-center">
                    <div class="card-body">
                        <i class="bi ${feature.icon} card-icon"></i>
                        <h4 class="card-title fw-bold">${feature.title}</h4>
                        <p class="card-text text-muted mb-4">${feature.text}</p>
                        <a href="${feature.href}" class="btn btn-brand w-100">╬£╬╡╧ä╬¼╬▓╬▒╧â╬╖ <i class="bi bi-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `).join('');
}
