const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const usernameInput = loginForm.elements.namedItem('username');
const passwordInput = loginForm.elements.namedItem('password');
const passwordToggle = document.querySelector('.password-toggle');

passwordToggle.addEventListener('click', () => {
    const showPassword = passwordInput.type === 'password';
    passwordInput.type = showPassword ? 'text' : 'password';
    passwordToggle.setAttribute('aria-pressed', String(showPassword));
    passwordToggle.setAttribute('aria-label', showPassword ? 'Ocultar senha' : 'Mostrar senha');
    passwordToggle.querySelector('i').className = showPassword
        ? 'bx bx-lock-open-alt'
        : 'bx bxs-lock-alt';
});

async function fillLocalCredentials() {
    try {
        const response = await fetch('/api/local-login');
        if (!response.ok || usernameInput.value || passwordInput.value) return;

        const credentials = await response.json();
        usernameInput.value = credentials.username;
        passwordInput.value = credentials.password;
    } catch {
        return;
    }
}

fillLocalCredentials();

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginError.hidden = true;

    const formData = new FormData(loginForm);

    try {
        const response = await fetch(loginForm.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: formData.get('username'),
                password: formData.get('password')
            })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Não foi possível entrar.');
        }

        window.location.assign('paginas/home.html');
    } catch (error) {
        loginError.textContent = error.message || 'Não foi possível conectar ao servidor.';
        loginError.hidden = false;
    }
});