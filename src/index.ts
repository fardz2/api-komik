import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import komik from './routes/komik.route.js'
import dotenv from 'dotenv'

dotenv.config()
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.basePath('/api').route('/komik', komik);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
