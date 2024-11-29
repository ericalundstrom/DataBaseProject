
function RenderForm() {

    document.querySelector("body").innerHTML = "";
    // Skapa formulär
    const form = document.createElement('form');
    form.id = "studentForm";

    // Input för förnamn
    const firstNameInput = document.createElement('input');
    firstNameInput.type = "text";
    firstNameInput.name = "f_name";
    firstNameInput.placeholder = "Förnamn";
    form.appendChild(firstNameInput);

    // Input för efternamn
    const lastNameInput = document.createElement('input');
    lastNameInput.type = "text";
    lastNameInput.name = "l_name";
    lastNameInput.placeholder = "Efternamn";
    form.appendChild(lastNameInput);

    const cityInput = document.createElement('input');
    cityInput.type = "text";
    cityInput.name = "city";
    cityInput.placeholder = "Stad";
    form.appendChild(cityInput);

    const depCodeInput = document.createElement('input');
    depCodeInput.type = "text";
    depCodeInput.name = "dep_code";
    depCodeInput.placeholder = "Avdelnings kod";
    form.appendChild(depCodeInput);

    const phonenumber = document.createElement('input');
    phonenumber.type = "text";
    phonenumber.name = "tel";
    phonenumber.placeholder = "Telefonnummer";
    form.appendChild(phonenumber);

    // Submit-knapp
    const submitButton = document.createElement('button');
    submitButton.type = "submit";
    submitButton.textContent = "Lägg till student";
    form.appendChild(submitButton);

    // Lägg till formuläret i body
    document.body.appendChild(form);

    let button = document.createElement("button");
    button.textContent = "Se alla studenter";
    document.querySelector("body").append(button);
    button.addEventListener("click", (e) => {
        e.preventDefault()
        RenderStudents()
    })

    let PatchButton = document.createElement("button");
    PatchButton.textContent = "Ändra namn på student";
    document.querySelector("body").append(PatchButton);
    PatchButton.addEventListener("click", (e) => {
        e.preventDefault()
        RenderPatch()
    })

    // Lägg till händelse för formulärets skickande
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Förhindrar sidladdning

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log(data);

        try {
            const response = await fetch('/add-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Student tillagd!");
                form.reset(); // Töm formuläret
            } else {
                alert("Något gick fel, försök igen.");
            }
        } catch (error) {
            console.error("Fel vid skickande av data:", error);
        }
    });
}

async function RenderStudents() {


    document.querySelector("body").innerHTML = "";
    try {
        const response = await fetch('/students');
        if (response.ok) {
            const students = await response.json();
            const studentList = document.createElement('ul');

            students.forEach(student => {
                const listItem = document.createElement('li');
                if (student.city !== null) {
                    
                    listItem.textContent = `${student.f_name} ${student.l_name} (${student.city})`;
                }else{

                    listItem.textContent = `${student.f_name} ${student.l_name} (ingen stad)`;
                }
                studentList.appendChild(listItem);
            });

            document.body.innerHTML = ''; // Rensa sidan
            document.body.appendChild(studentList); // Visa studentlistan
        } else {
            console.error("Kunde inte hämta studenter");
        }
    } catch (error) {
        console.error("Fel vid hämtning av studenter:", error);
    }
    let button = document.createElement("button");
    button.textContent = "Lägg till student";
    document.querySelector("body").append(button);
    button.addEventListener("click", (e) => {
        e.preventDefault()
        RenderForm()
    })

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Ta bort studenter";
    document.querySelector("body").append(deleteButton);
    deleteButton.addEventListener("click", (e) => {
        e.preventDefault()
        RenderRemoveStudent()
    })

    let PatchButton = document.createElement("button");
    PatchButton.textContent = "Ändra namn på student";
    document.querySelector("body").append(PatchButton);
    PatchButton.addEventListener("click", (e) => {
        e.preventDefault()
        RenderPatch()
    })

}

RenderStudents()


function RenderRemoveStudent(data) {
    document.querySelector("body").innerHTML = "";

    let AddStudent = document.createElement("button");
    AddStudent.textContent = "Lägg till student";
    document.querySelector("body").append(AddStudent);
    AddStudent.addEventListener("click", (e) => {
        e.preventDefault()
        RenderForm()
    })

    let button = document.createElement("button");
    button.textContent = "Se alla studenter";
    document.querySelector("body").append(button);
    button.addEventListener("click", (e) => {
        e.preventDefault()
        RenderStudents()
    })

    let PatchButton = document.createElement("button");
    PatchButton.textContent = "Ändra namn på student";
    document.querySelector("body").append(PatchButton);
    PatchButton.addEventListener("click", (e) => {
        e.preventDefault()
        RenderPatch()
    })

    const form = document.createElement('form');
    form.id = "studentForm";

    const deleteID = document.createElement('input');
    deleteID.type = "number"; 
    deleteID.name = "id";
    deleteID.placeholder = "Id på student";
    form.appendChild(deleteID);

    document.body.appendChild(form);

    const submitButton = document.createElement('button');
    submitButton.type = "submit";
    submitButton.textContent = "Ta bort student";
    form.appendChild(submitButton);


    form.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
    
        if (data.id) {
            data.id = parseInt(data.id, 10);
        }
        
        console.log(data);
    
        try {
            const response = await fetch('/delete-student', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                alert("Student Borttagen!");
                form.reset();
            } else {
                alert("Något gick fel, försök igen.");
            }
        } catch (error) {
            console.error("Fel vid skickande av data:", error);
        }
    });
    
    
}


function RenderPatch(params) {
    document.querySelector("body").innerHTML = "";

    let AddStudent = document.createElement("button");
    AddStudent.textContent = "Lägg till student";
    document.querySelector("body").append(AddStudent);
    AddStudent.addEventListener("click", (e) => {
        e.preventDefault()
        RenderForm()
    })

    let button = document.createElement("button");
    button.textContent = "Se alla studenter";
    document.querySelector("body").append(button);
    button.addEventListener("click", (e) => {
        e.preventDefault()
        RenderStudents()
    })

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Ta bort studenter";
    document.querySelector("body").append(deleteButton);
    deleteButton.addEventListener("click", (e) => {
        e.preventDefault()
        RenderRemoveStudent()
    })


    const form = document.createElement('form');
    form.id = "studentForm";

    const idForm = document.createElement('input');
    idForm.type = "number"; 
    idForm.name = "id";
    idForm.placeholder = "id för student";
    form.appendChild(idForm);

    const Patchform = document.createElement('input');
    Patchform.type = "text"; 
    Patchform.name = "f_name";
    Patchform.placeholder = "Förnamn på student";
    form.appendChild(Patchform);

    document.body.appendChild(form);

    const submitButton = document.createElement('button');
    submitButton.type = "submit";
    submitButton.textContent = "Uppdatera studentens namn";
    form.appendChild(submitButton);


    form.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
    
        if (data.id) {
            data.id = parseInt(data.id, 10);
        }
        data.f_name = String(data.f_name);
        
        console.log(data);
    
        try {
            const response = await fetch('/change-student', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                alert("Studentens namn är ändrat!!");
                form.reset();
            } else {
                alert("Något gick fel, försök igen.");
            }
        } catch (error) {
            console.error("Fel vid skickande av data:", error);
        }
    });
    
    
}