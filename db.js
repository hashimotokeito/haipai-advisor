const { Pool } = require('pg');

const pool = new Pool({
  database: 'nekko_lesson',
});

module.exports = { pool };