const articleLinks = document.querySelectorAll('.article-title');
articleLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const title = this.getAttribute('data-title');
        const content = this.getAttribute('data-content');
        const articleId = this.getAttribute('data-article-id');

        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalContent').textContent = content;
        document.getElementById('articleId').value = articleId;
        document.getElementById('article-modal').style.display = 'block';
    });
});

document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('article-modal').style.display = 'none';
});

document.getElementById('commentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    fetch('/reviewer/save-comment', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            alert('Comment submitted successfully');
            e.target.reset();
        }
    });
});

window.addEventListener('click', function (e) {
    const modal = document.getElementById('article-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
