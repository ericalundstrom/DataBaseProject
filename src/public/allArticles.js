const title = document.querySelectorAll(".article-title");

title.forEach(link => {
    link.addEventListener("click", (event) => {
    event.preventDefault();
    const author = link.dataset.author;
    const title = link.dataset.title;
    const content = link.dataset.content;
    showArticleContent(author, title, content);
    });
});

function showArticleContent(author, title, content) {
    const modalAuthor = document.getElementById("modalAuthor");
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");

    modalAuthor.textContent = "Author: " + author;
    modalTitle.textContent = title;
    modalContent.textContent = content;

    const modal = document.getElementById("article-modal");
    modal.style.display = "block";
}

const closeModalButton = document.getElementById("closeModal");
closeModalButton.addEventListener("click", () => {
    const modal = document.getElementById("article-modal");
    modal.style.display = "none";
});
