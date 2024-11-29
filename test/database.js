const { Client } = require('pg');

const client = new Client({
  host: 'pgserver.mah.se',
  user: 'an4297',
  password: 'p7d1r0dj',
  database: 'Erica test',
});

const connectDatabase = async () => {
  return await client.connect();
}

module.exports = connectDatabase;
