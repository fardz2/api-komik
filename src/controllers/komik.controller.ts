import type { Context } from 'hono'
import { scrapeDaftarKomik, scrapeHotKomik, scrapeKomikByTipe, scrapeKomikSearch, scrapeKomikTerbaru } from '../services/komik.service.js'
import { successResponse, errorResponse } from '../utils/response.js'

export const getHotKomik = async (c: Context) => {
  try {
    const data = await scrapeHotKomik();
    return c.json(successResponse(data));
  } catch (err: any) {
    const statusCode = err?.status.toInteger ?? 500; // ambil dari FetchError, fallback ke 500
    return c.json(errorResponse(err?.message || 'Terjadi kesalahan'), statusCode);
  }
};

export const getDaftarKomik = async (c: Context) => {
  try {
    const filters = {
      page: Number(c.req.query('page')) || 1,
      genre: c.req.queries()['genre[]'] || [],
      status: c.req.query('status') || '',
      type: c.req.query('type') || '',
      orderby: c.req.query('orderby') || ''
    };
    
    const data = await scrapeDaftarKomik(filters);
    return c.json({
      message: true,
      data
    });
  } catch (err: any) {
    const statusCode = err?.status ?? 500;
    return c.json(errorResponse(err?.message || 'Terjadi kesalahan'), statusCode);
  }
};

export const getKomikTerbaru = async (c: Context) => {
  try {
    const page = Number(c.req.query('page')) || 1;
    const data = await scrapeKomikTerbaru(page);
    return c.json(successResponse(data));
  } catch (err: any) {
    const statusCode = err?.status ?? 500;
    return c.json(errorResponse(err?.message || 'Terjadi kesalahan'), statusCode);
  }
};

export const getKomikSearch = async (c: Context) => {
  try {
    const filters = {
      page: Number(c.req.query('page')) || 1,
      q: c.req.query('q') || ''
    };
    const data = await scrapeKomikSearch(filters);
    return c.json(successResponse(data));
  } catch (err: any) {
    const statusCode = err?.status ?? 500;
    return c.json(errorResponse(err?.message || 'Terjadi kesalahan'), statusCode);
  }
};

export const getKomikByTipe = async (c: Context) => {
  try {
    const tipe = c.req.param('tipe');
    const page = Number(c.req.query('page')) || 1;
    const data = await scrapeKomikByTipe(tipe, page);
    return c.json(successResponse(data));
  } catch (err: any) {
    const statusCode = err?.status ?? 500;
    console.error(err?.status);
    return c.json(errorResponse(err?.message || 'Terjadi kesalahan'), statusCode);
  }
};


