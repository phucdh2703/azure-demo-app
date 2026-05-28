const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'db',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'demo',
  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
});

async function initDb() {
  const sql = fs.readFileSync(
    path.join(__dirname, '../init.sql'),
    'utf8'
  );

  await pool.query(sql);

  console.log('Database initialized');
}

module.exports = {
  pool,
  initDb
};