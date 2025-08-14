import { Hono } from 'hono'

import { getDaftarKomik, getHotKomik, getKomikSearch, } from '../controllers/komik.controller.js'
import { getKomikBySlug, getKomikChapterBySlug } from '../controllers/detail-komik.controller.js'

const komik = new Hono()

komik.get('/', getHotKomik)
komik.get('/daftar-komik', getDaftarKomik)
komik.get('/search', getKomikSearch);
komik.get('/:slug', getKomikBySlug)
komik.get('/:slug/:chapter', getKomikChapterBySlug)



export default komik
    