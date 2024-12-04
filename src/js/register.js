const authMessage = document.querySelector('.auth-message');

if (authMessage) {
    setTimeout(() => {
        authMessage.style.display = 'none';
    }, 5000);
}

const loginButton = document.querySelector('.login-button');

if (loginButton) {
    loginButton.addEventListener('click', function() {
        window.location.href = '/login';
    });
}
