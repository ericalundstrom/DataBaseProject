

// const {Client} = require('pg');
// const client = new Client ({
//     user: 'an4297',
//     password: 'p7d1r0dj',
//     databse: 'Erica test',
//     host: 'pgserver.mah.se'
// });

// client.connect();

// client.query("select * from student where student.f_name like 'T%'", (err, res) => {
//     if(!err){
//         console.log(res.rows);
//     }else{
//         console.log(err.message);
//     }
//     client.end;
// })

const express = require('express');
const app = express();
const PORT = 4000;

app.get('/', (req, res) => {
    console.log("hejsan");
    const {Client} = require('pg');
    const client = new Client ({
    user: 'an4297',
     password: 'p7d1r0dj',
     databse: 'Erica test',
     host: 'pgserver.mah.se'
 });

 client.connect();

 client.query("SELECT * FROM student", (err, dbRes) => {
    if (!err) {
        console.log(dbRes.rows);
        res.send(dbRes.rows); // Här används rätt res
    } else {
        console.log("fungerar ej", err);
        res.status(500).send("Ett fel inträffade igen");
    }
    client.end();
});
})

app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });

// const express = require('express');
// const { Client } = require('pg');

// // Skapa en Express-app
// const app = express();
// const PORT = 3000; // Porten där localhost-servern körs

// // Databasfunktion för att hämta studenter
// async function getStudents() {
//     const client = new Client({
//         user: 'an4297',
//         password: 'p7d1r0dj',
//         database: 'Erica test',
//         host: 'pgserver.mah.se',
//     });

//     try {
//         await client.connect();
//         const result = await client.query("select * from student where student.f_name like 'T%'");
//         return result.rows;
//     } catch (err) {
//         console.error('Error executing query', err.message);
//         throw err;
//     } finally {
//         await client.end();
//     }
// }

// // Route för startsida
// app.get('/', (req, res) => {
//     res.send('Welcome to the API! Access /students to see the data.');
// });

// // Route för att hämta studenter
// app.get('/students', async (req, res) => {
//     try {
//         const students = await getStudents();
//         res.json(students);
//     } catch (err) {
//         res.status(500).send('Server error: ' + err.message);
//     }
// });

// // Starta servern
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });

