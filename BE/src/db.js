const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: Number(process.env.POSTGRES_PORT || 5432),
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDb() {
  const sql = fs.readFileSync(
    path.join(__dirname, 'init.sql'),
    'utf8'
  );

  await pool.query(sql);

  console.log('Database initialized');
}

module.exports = {
  pool,
  initDb
};