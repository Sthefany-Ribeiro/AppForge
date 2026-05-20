require('dotenv').config()
const express = require('express')
const helmet = require('helmet')

const healthRoutes = require('./routes/health')
const taskRoutes = require('./routes/tasks')

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(express.json())

app.use('/', healthRoutes)
app.use('/tasks', taskRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'rota não encontrada' })
})

app.use((err, req, res, next) => {
  console.error('[error]', err.stack)
  res.status(500).json({ error: 'erro interno do servidor' })
})

app.listen(PORT, () => {
  console.log(`[app] porta ${PORT} — ${process.env.NODE_ENV || 'development'}`)
})

module.exports = app