const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || process.env.USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'nekko_lesson',
});

module.exports = { pool };
