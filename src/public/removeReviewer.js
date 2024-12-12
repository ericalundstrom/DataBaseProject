const title = document.querySelectorAll(".reviewer-name");

title.forEach(link => {
    link.addEventListener("click", (event) => {
    event.preventDefault();
    const title = link.dataset.title;
    const content = link.dataset.content;
    console.log(content);
    console.log(event);
    showArticleContent(title, content);
    });
});

function showArticleContent(title, content) {
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");
    modalTitle.textContent = title;
    modalContent.textContent = content;

    modalContent.innerHTML = content; 

    const modal = document.getElementById("article-modal");
    modal.style.display = "block";
}

const closeModalButton = document.getElementById("closeModal");
closeModalButton.addEventListener("click", () => {
    const modal = document.getElementById("article-modal");
    modal.style.display = "none";
});




// <tr>
// <td>
//   <a href="#" class="reviewer-name"
//   data-title="<%= reviewer.first_name + ' ' + reviewer.last_name %>"
//      data-content="<%= 'Affiliation:' + reviewer.affiliation + ' ' + 'Email:' + reviewer.email %>">
//     <%= reviewer.first_name %>
//   </a>
// </td>
// <td><%= reviewer.last_name %></td>
// <td class="delete">x</td>
// </tr>