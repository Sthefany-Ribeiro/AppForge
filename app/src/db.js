const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

pool.connect((err, client, release) => {
  if (err) {
    console.error('[db] erro ao conectar:', err.message)
    return
  }
  release()
  console.log('[db] conectado em', process.env.DB_HOST)
})

module.exports = pool