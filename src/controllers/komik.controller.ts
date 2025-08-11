import type { Context } from 'hono'
import { scrapeDaftarKomik, scrapeHotKomik } from '../services/komik.service.js'
import { successResponse, errorResponse } from '../utils/response.js'

export const getHotKomik = async (c: Context) => {
  try {
    const data = await scrapeHotKomik()
    return c.json(successResponse(data))
  } catch (err: any) {
    return c.json(errorResponse(err.message), 500)
  }
}

export const getDaftarKomik = async (c: Context) => {
  try {
    const filters = {
      page: Number(c.req.query('page')) || 1,
      genre: c.req.queries()['genre[]'], // bisa array
      status: c.req.query('status'),
      type: c.req.query('type'),
      orderby: c.req.query('orderby')
    }

    const data = await scrapeDaftarKomik(filters.page)
    return c.json({
      message: true,
      data
    })
  } catch (err: any) {
    return c.json(errorResponse(err.message), 500)
  }
}

