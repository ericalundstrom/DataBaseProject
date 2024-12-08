const title = document.querySelectorAll(".article-title");

title.forEach(link => {
    link.addEventListener("click", (event) => {
    event.preventDefault();
    const title = link.dataset.title;
    const content = link.dataset.content;
    showArticleContent(title, content);
    });
});

function showArticleContent(title, content) {
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");
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
