// Обновлённый код "form.js" для двухфакторной авторизации
const loginForm = document.getElementById('login-form');
const registerButton = document.getElementById('register-button');
const logoutButton = document.getElementById('logout-button');
const otpContainer = document.getElementById('otp-container'); // Контейнер для ввода OTP
const otpInput = document.getElementById('otp'); // Поле для ввода OTP
const verifyOtpButton = document.getElementById('verify-otp-button'); // Кнопка для подтверждения OTP

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
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            otpContainer.style.display = 'block'; // Показываем форму ввода OTP
        } else {
            alert(`Ошибка: ${data.error}`);
        }
    } catch (error) {
        alert(`Ошибка: ${error.message}`);
    }
});

// Подтверждение OTP
verifyOtpButton.addEventListener('click', async () => {
    const otp = otpInput.value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('http://localhost:8080/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Авторизация успешна!');
            localStorage.setItem('token', data.token);
            window.location.reload();
        } else {
            alert(`Ошибка: ${data.error}`);
        }
    } catch (error) {
        alert(`Ошибка: ${error.message}`);
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
            body: JSON.stringify({ email, password }),
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
