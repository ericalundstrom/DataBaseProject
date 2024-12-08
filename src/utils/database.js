const { Pool } = require('pg');

const pool = new Pool({
  host: 'pgserver.mah.se',
  port: 5432,
  user: 'an4297',
  password: 'p7d1r0dj',
  database: 'conference_management_erica',
});

const connectDatabase = async () => {
  const client = await pool.connect();
  return client;
};

module.exports = { connectDatabase };
