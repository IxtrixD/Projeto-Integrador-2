document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.querySelector('input[name="username"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();

    if (!username || !password) {
        alert('Preencha usuário e senha.');
        return;
    }

    window.location.href = 'paginas/home.html';
});