import type { Context } from 'hono'
import { scrapeDaftarKomik, scrapeHotKomik, scrapeKomikSearch } from '../services/komik.service.js'
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
      genre: c.req.queries()['genre[]'] || [],
      status: c.req.query('status') || '',
      type: c.req.query('type') || '',
      orderby: c.req.query('orderby') || ''
    };
    
    const data = await scrapeDaftarKomik(filters)
    
    return c.json({
      message: true,
      data
    })
  } catch (err: any) {
    console.error(err.message)
    return c.json(errorResponse(err.message), 500)
  }
}
export const getKomikSearch = async (c: Context) => {
  try {
        const filters = {
      page: Number(c.req.query('page')) || 1,
      q: c.req.query('q') || ''
    };
    const data = await scrapeKomikSearch(filters);
    return c.json(successResponse(data));
  } catch (err: any) {
    return c.json(errorResponse(err.message), 500);
  }
}


