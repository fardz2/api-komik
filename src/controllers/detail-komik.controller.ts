import type { Context } from "hono"
import { scrapeKomikBySlug, scrapeKomikChapterBySlug } from "../services/detail-komik.service.js"
import { errorResponse, successResponse } from "../utils/response.js"

export const getKomikBySlug = async (c: Context) => {
  const slug = c.req.param('slug')
  try {
    const data = await scrapeKomikBySlug(slug)
    return c.json(successResponse(data))
  } catch (err: any) {
    return c.json(errorResponse(err.message), 500)
  }
}
export const getKomikChapterBySlug = async (c: Context) => {
  const slug = c.req.param('slug')
  const chapter = c.req.param('chapter')
  try {
    const data = await scrapeKomikChapterBySlug(slug,chapter)
    return c.json(successResponse(data))
  } catch (err: any) {
    return c.json(errorResponse(err.message), )
  }
}