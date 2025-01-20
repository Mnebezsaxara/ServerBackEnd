// Обновлённый код "login.js" для авторизации
const loginForm = document.getElementById('login-form');
const registerButton = document.getElementById('register-button');
const logoutButton = document.getElementById('logout-button');

// Проверка на авторизацию
if (localStorage.getItem('token')) {
    logoutButton.style.display = 'block';
}

// Авторизация пользователя
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Response from server:', data); // Лог ответа сервера
            localStorage.setItem('token', data.token);
            alert('Login successful');
            logoutButton.style.display = 'block';
        } else {
            console.log('Error response:', data); // Лог ошибки
            alert('Ошибка: ' + data.error);
        }
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
});

// Регистрация пользователя
registerButton.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Регистрация успешна');
            localStorage.setItem('token', data.token);
        } else {
            alert('Ошибка: ' + data.error);
        }
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
});

// Выход из системы
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Вы вышли из системы');
    window.location.reload();
});