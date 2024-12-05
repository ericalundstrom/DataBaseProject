const { Pool } = require('pg');

const pool = new Pool({
  host: 'pgserver.mah.se',
  port: 5432,
  user: 'an3937',
  password: '82q1bygc',
  database: 'conference_management',
});

const connectDatabase = async () => {
  const client = await pool.connect();
  return client;
};

module.exports = { connectDatabase };
