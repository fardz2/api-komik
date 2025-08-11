
import type { DaftarKomikResult, FilterOptions, KomikItem } from '../types/komik.types.js'
import { extractSlug } from '../utils/extractslug.js'
import { fetchHtml } from '../utils/fetchHtml.js'
import { load } from 'cheerio'

export const scrapeHotKomik = async (): Promise<KomikItem[]> => {
  const html = await fetchHtml(`${process.env.KOMIKCAST_URL}/`)
  const $ = load(html)
  const results: KomikItem[] = []

  $('div.bixbox.hothome .swiper-slide').each((_, el) => {
    const anchor = $(el).find('a')
    const fullUrl = anchor.attr('href') || ''

    results.push({
      title: anchor.attr('title')?.trim() || '',
      slug: extractSlug(fullUrl),
      image: $(el).find('img').attr('src') || '',
      type: $(el).find('.type').text().trim(),
      chapter: $(el).find('.chapter').text().trim(),
      rating: $(el).find('.numscore').text().trim()
    })
  })

  return results
}

export const scrapeDaftarKomik = async (page: number = 1): Promise<DaftarKomikResult> => {
  const url = `${process.env.KOMIKCAST_URL}/daftar-komik/page/${page}`
  const html = await fetchHtml(url)
  const $ = load(html)

  const results: KomikItem[] = []

  $('.list-update_item').each((_, el) => {
    const anchor = $(el).find('a')
    const img = $(el).find('img')
    const fullUrl = anchor.attr('href') || ''

    results.push({
      title: $(el).find('.title').text().trim(),
      slug: extractSlug(fullUrl),
      image: img.attr('src') || '',
      type: $(el).find('.type').text().trim(),
      chapter: $(el).find('.chapter').text().trim(),
      rating: $(el).find('.numscore').text().trim()
    })
  })

  // Pagination
  const currentPage = parseInt($('.pagination .current').text()) || page
  let totalPages = currentPage
  $('.pagination .page-numbers').each((_, el) => {
    const text = $(el).text().trim()
    const num = parseInt(text)
    if (!isNaN(num) && num > totalPages) {
      totalPages = num
    }
  })

  const hasNext = $('.pagination .next').length > 0
  const hasPrev = $('.pagination .prev').length > 0

  return {
    comics: results,
    pagination: {
      currentPage,
      totalPages,
      hasNext,
      hasPrev
    }
  }
}




