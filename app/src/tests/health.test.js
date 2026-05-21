const request = require('supertest')
const app = require('../index')

jest.mock('../db', () => ({
  query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
  connect: jest.fn().mockImplementation((cb) => cb(null, {}, () => {})),
}))

describe('GET /healthz', () => {
  it('retorna 200 e status ok', async () => {
    const res = await request(app).get('/healthz')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})

describe('GET /readyz', () => {
  it('retorna 200 quando banco conectado', async () => {
    const res = await request(app).get('/readyz')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ready')
  })
})