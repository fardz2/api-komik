// routes/komik.route.js
import { Hono } from 'hono'

import { 
  getDaftarKomik, 
  getHotKomik, 
  getKomikByGenre, 
  getKomikByTipe, 
  getKomikSearch, 
  getKomikTerbaru 
} from '../controllers/komik.controller.js'

import { 
  getKomikBySlug, 
  getKomikChapterBySlug 
} from '../controllers/detail-komik.controller.js'

const komik = new Hono()

// Hot, terbaru, daftar, search
komik.get('/', getHotKomik)
komik.get('/terbaru', getKomikTerbaru)
komik.get('/daftar-komik', getDaftarKomik)
komik.get('/search', getKomikSearch)

komik.get('/detail/:slug/:chapter', getKomikChapterBySlug)
komik.get('/detail/:slug', getKomikBySlug)

// Berdasarkan tipe
komik.get('/tipe/:tipe', getKomikByTipe)
komik.get('/genre/:genre', getKomikByGenre)

export default komik
