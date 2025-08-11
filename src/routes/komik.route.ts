import { Hono } from 'hono'

import { getDaftarKomik, getHotKomik, } from '../controllers/komik.controller.js'
import { getKomikBySlug, getKomikChapterBySlug } from '../controllers/detail-komik.controller.js'


const komik = new Hono()

komik.get('/', getHotKomik)
komik.get('/:slug', getKomikBySlug)
komik.get('/:slug/:chapter', getKomikChapterBySlug)
komik.get('/daftar-komik', getDaftarKomik)


export default komik
    