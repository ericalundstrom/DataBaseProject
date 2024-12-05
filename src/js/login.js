const registerButton = document.querySelector('.register-button');

if (registerButton) {
    registerButton.addEventListener('click', function() {
        window.location.href = '/';
    });
}
