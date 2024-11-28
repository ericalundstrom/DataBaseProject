

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

// // Middleware
app.use(express.json());
app.use(express.static('public'));

// // View engine
app.set('view engine', 'ejs');

// // Routes
app.get('/', (req, res) => {
    res.render('index');
});


app.get('/students', (req, res) => {
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
            res.json(dbRes.rows); // Här används rätt res
        } else {
            console.log("fungerar ej", err);
            res.status(500).send("Ett fel inträffade");
        }
        client.end();
    });
})

app.post('/add-student', async (req, res) => {

    const { f_name, l_name, city, dep_code, tel } = req.body;
    console.log(req.body);

    if (!f_name || !l_name || !city || !dep_code || !tel) {
        return res.status(400).send("Alla fält är obligatoriska!");
    }

    const {Client} = require('pg');
    const client = new Client({
        user: 'an4297',
        password: 'p7d1r0dj',
        databse: 'Erica test',
        host: 'pgserver.mah.se'
    });

    try {
        await client.connect();

        const newId = await generateUniqueId(client);

        const query = 'INSERT INTO student (id, f_name, l_name, city, dep_code, tel) VALUES ($1, $2, $3, $4, $5, $6)';
        const values = [newId, f_name, l_name, city, dep_code, tel];

        await client.query(query, values);
        res.status(201).send("Student tillagd!");
    } catch (err) {
        console.error("Fel vid inmatning i databasen:", err);
        res.status(500).send("Ett serverfel inträffade.");
    } finally {
        client.end();
    }
});

app.delete('/delete-student', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send("ID är obligatoriskt.");
    }

    const {Client} = require('pg');
    const client = new Client({
        user: 'an4297',
        password: 'p7d1r0dj',
        databse: 'Erica test',
        host: 'pgserver.mah.se'
    });

    try {
        await client.connect();

        const query = 'DELETE FROM student WHERE id = $1';
        const values = [id];

        const result = await client.query(query, values);

        if (result.rowCount > 0) {
            res.status(200).send("Student borttagen.");
        } else {
            res.status(404).send("Studenten med det angivna ID:t finns inte.");
        }
    } catch (error) {
        console.error("Fel vid borttagning i databasen:", error);
        res.status(500).send("Ett serverfel inträffade.");
    } finally {
        client.end();
    }
})

async function generateUniqueId(client) {
    try {
        const result = await client.query('SELECT MAX(id) AS max_id FROM student');
        const maxId = result.rows[0].max_id || 0; // Om tabellen är tom, börja på 0
        return maxId + 1; // Returnera ett nytt unikt ID
    } catch (error) {
        console.error('Fel vid generering av ID:', error);
        throw new Error('Kunde inte generera ett unikt ID');
    }
}

app.patch('/change-student', async (req,res) => {
    const { id, f_name } = req.body;

    if (!id || !f_name) {
        return res.status(400).send("Både ID och förnamn är obligatoriska.");
    }

    const {Client} = require('pg');
    const client = new Client({
        user: 'an4297',
        password: 'p7d1r0dj',
        databse: 'Erica test',
        host: 'pgserver.mah.se'
    });

    try {
        await client.connect();

        const query = 'UPDATE student SET f_name = $1 WHERE id = $2';

        const values = [f_name, id];

        const result = await client.query(query, values);

        if (result.rowCount > 0) {
            res.status(200).send("Student uppdaterad.");
        } else {
            res.status(404).send("Studenten med det angivna ID:t finns inte.");
        }
    } catch (error) {
        console.error("Fel vid borttagning i databasen:", error);
        res.status(500).send("Ett serverfel inträffade.");
    } finally {
        client.end();
    }

})

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
