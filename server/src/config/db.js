const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,      
  host: process.env.DB_HOST,   
  database: process.env.DB_NAME,
  password: process.env.DB_PASS, 
  port: process.env.DB_PORT || 5432,
});

pool.connect()
  .then(() => console.log('Connected to Postgres successfully!'))
  .catch(err => console.error('Postgres connection error:', err));

module.exports = pool;