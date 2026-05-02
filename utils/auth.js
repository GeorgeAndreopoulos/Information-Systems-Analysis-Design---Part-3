const ROLE_LABELS = {
    admin: '╬ö╬╣╬▒╧ç╬╡╬╣╧ü╬╣╧â╧ä╬«╧é',
    teacher: '╬Ü╬▒╬╕╬╖╬│╬╖╧ä╬«╧é',
    student: '╬£╬▒╬╕╬╖╧ä╬«╧é'
};

const USERS = [
    { username: 'admin', password: 'admin123!', role: 'admin' },
    { username: 'teacher', password: 'teacher123!', role: 'teacher' },
    { username: 'student', password: 'student123!', role: 'student' }
];

function getLoginPath() {
    return window.location.pathname.includes('/pages/')
        ? '../Login/login.html'
        : 'pages/Login/login.html';
}

function getHomePath() {
    return window.location.pathname.includes('/pages/') ? '../../index.html' : 'index.html';
}

function login(username, password) {
    const user = USERS.find(candidate => (
        candidate.username === username && candidate.password === password
    ));

    if (!user) return null;

    const sessionUser = { username: user.username, role: user.role };
    sessionStorage.setItem('diatrivi_auth', JSON.stringify(sessionUser));
    return sessionUser;
}

function getCurrentUser() {
    const storedUser = sessionStorage.getItem('diatrivi_auth');
    if (!storedUser) return null;

    try {
        const user = JSON.parse(storedUser);
        if (user && user.username && user.role) return user;

        sessionStorage.removeItem('diatrivi_auth');
        return null;
    } catch {
        sessionStorage.removeItem('diatrivi_auth');
        return null;
    }
}

function requireAuth(allowedRoles = []) {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = getLoginPath();
        return null;
    }

    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        window.location.href = getHomePath();
        return null;
    }

    return user;
}

function logout() {
    sessionStorage.removeItem('diatrivi_auth');
    window.location.href = getLoginPath();
}
