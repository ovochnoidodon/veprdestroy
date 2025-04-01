// Обработка формы регистрации
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    fetch('register_process.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        const messageDiv = document.getElementById('regMessage');
        if (data.success) {
            messageDiv.textContent = 'Регистрация успешна!';
            messageDiv.className = 'success';
            closeRegisterModal();
        } else {
            messageDiv.textContent = data.message;
            messageDiv.className = 'error';
        }
    })
    .catch(error => console.error('Ошибка:', error));
});

// Обработка формы входа
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('logUsername').value;
    const password = document.getElementById('logPassword').value;

    fetch('login_process.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        const messageDiv = document.getElementById('logMessage');
        if (data.success) {
            messageDiv.textContent = 'Вы успешно вошли!';
            messageDiv.className = 'success';
            closeLoginModal();
        } else {
            messageDiv.textContent = data.message;
            messageDiv.className = 'error';
        }
    })
    .catch(error => console.error('Ошибка:', error));
});