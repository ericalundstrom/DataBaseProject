// async function RenderCards(data) {
//     console.log(data);
//     console.log("här");

//             try {
//                 const response = await fetch('/admin/edit-submission');
//                 console.log(response);
//                 if (response.ok) {
//                     const studentList = document.createElement('ul');
        
//                     response.forEach(student => {
//                         const listItem = document.createElement('li');
//                         listItem.textContent = `${student.start_date})`;
//                         studentList.appendChild(listItem);
//                     });
        
//                     document.body.innerHTML = ''; // Rensa sidan
//                     document.body.appendChild(studentList); // Visa studentlistan
//                 } else {
//                     console.error("Kunde inte hämta studenter");
//                 }
//             } catch (error) {
//                 console.error("Fel vid hämtning av studenter:", error);
//             }
// }

// RenderCards()