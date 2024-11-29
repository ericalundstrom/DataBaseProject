const { Pool } = require('pg');

const pool = new Pool({
  host: 'pgserver.mah.se',
  port: 5432,
  user: '',
  password: '',
  database: 'conference_management',
});

const connectDatabase = async () => {
  const client = await pool.connect();
  return client;
};

module.exports = { connectDatabase };
