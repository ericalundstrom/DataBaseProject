const articleLinks = document.querySelectorAll('.article-title');
articleLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const title = this.getAttribute('data-title');
        const content = this.getAttribute('data-content');

        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalContent').textContent = content;

        document.getElementById('article-modal').style.display = 'block';
    });
});

document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('article-modal').style.display = 'none';
});

window.addEventListener('click', function (e) {
    const modal = document.getElementById('article-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
