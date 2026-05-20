const { Router } = require('express')
const pool = require('../db')

const router = Router()

router.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

router.get('/readyz', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ready', db: 'connected' })
  } catch (err) {
    res.status(503).json({ status: 'not ready', db: 'disconnected' })
  }
})

module.exports = router