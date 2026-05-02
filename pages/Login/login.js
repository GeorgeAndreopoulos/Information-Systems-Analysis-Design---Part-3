(() => {
    const form          = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorBox      = document.getElementById('loginError');
    const errorText     = document.getElementById('loginErrorText');
    const loginBtn      = document.getElementById('loginBtn');
    const toggleBtn     = document.getElementById('togglePassword');

    // Toggle password visibility
    toggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        toggleBtn.querySelector('i').className = isPassword
            ? 'bi bi-eye-slash'
            : 'bi bi-eye';
    });

    // Hide error when user types
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
            errorBox.classList.add('d-none');
            input.classList.remove('is-invalid');
        });
    });

    // Handle form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            errorText.textContent = '╬ú╧à╬╝╧Ç╬╗╬╖╧ü╧Ä╧â╧ä╬╡ ╬║╬▒╬╣ ╧ä╬▒ ╬┤╧ì╬┐ ╧Ç╬╡╬┤╬»╬▒.';
            errorBox.classList.remove('d-none');
            if (!username) usernameInput.classList.add('is-invalid');
            if (!password) passwordInput.classList.add('is-invalid');
            return;
        }

        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        setTimeout(() => {
            if (login(username, password)) {
                window.location.href = '../../index.html';
            } else {
                errorText.textContent = '╬¢╬¼╬╕╬┐╧é ╧î╬╜╬┐╬╝╬▒ ╧ç╧ü╬«╧â╧ä╬╖ ╬« ╬║╧ë╬┤╬╣╬║╧î╧é ╧Ç╧ü╧î╧â╬▓╬▒╧â╬╖╧é.';
                errorBox.classList.remove('d-none');
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
                passwordInput.value = '';
                passwordInput.focus();
            }
        }, 800);
    });

    // Allow Enter key on password field
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') form.requestSubmit();
    });
})();

document.getElementById('loginDarkSlot').appendChild(createDarkModeToggle());
