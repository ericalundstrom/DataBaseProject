
const homeButton = document.querySelector('.go-gome');

if (homeButton) {
    homeButton.addEventListener('click', function() {
        window.location.href = '/admin/welcome-admin';
    });
}
