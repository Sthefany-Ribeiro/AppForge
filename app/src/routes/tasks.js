const { Router } = require('express')
const pool = require('../db')

const router = Router()

async function initTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id         SERIAL PRIMARY KEY,
      title      VARCHAR(255) NOT NULL,
      done       BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)
}
initTable().catch(console.error)

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'title é obrigatório' })

  try {
    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { done } = req.body

  try {
    const result = await pool.query(
      'UPDATE tasks SET done = $1 WHERE id = $2 RETURNING *',
      [done, id]
    )
    if (result.rowCount === 0) return res.status(404).json({ error: 'task não encontrada' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id])
    if (result.rowCount === 0) return res.status(404).json({ error: 'task não encontrada' })
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router