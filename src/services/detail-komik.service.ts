import { load } from "cheerio"
import type { ChapterItem, ChapterListItem, KomikChapterDetail, KomikDetail } from "../types/detail-komik.types.js"
import { fetchHtml } from "../utils/fetchHtml.js"
import { extractChapterSlug } from "../utils/extractslug.js"

export const scrapeKomikBySlug = async (slug: string): Promise<KomikDetail> => {
  const url = `${process.env.KOMIKCAST_URL}/komik/${slug}`
  const html = await fetchHtml(url)
  const $ = load(html)

  // Title & Native title
  const title = $('.komik_info-content-body-title').first().text().trim()
  const nativeTitle = $('.komik_info-content-native').text().trim()

  // Image
  const image = $('.komik_info-cover-image img').attr('src') || ''

  // Genres (array)
  const genres: string[] = []
  $('.komik_info-content-genre a.genre-item').each((_, el) => {
    genres.push($(el).text().trim())
  })

  // Metadata (released, author, status, type, total chapter, updatedOn)
  const released = $('.komik_info-content-info-release').text().replace('Released:', '').trim()
  const author = $('.komik_info-content-info').filter((_, el) => $(el).text().includes('Author:')).text().replace('Author:', '').trim()
  const status = $('.komik_info-content-info').filter((_, el) => $(el).text().includes('Status:')).text().replace('Status:', '').trim()
  const type = $('.komik_info-content-info-type a').text().trim()
  const totalChapter = $('.komik_info-content-info').filter((_, el) => $(el).text().includes('Total Chapter:')).text().replace('Total Chapter:', '').trim()
  const updatedOn = $('.komik_info-content-update time').attr('datetime') || ''

  // Rating
  const rating = $('.data-rating').attr('data-ratingkomik') || ''

  // Sinopsis (text inside .komik_info-description-sinopsis)
  const sinopsis = $('.komik_info-description-sinopsis').text().trim()

  // Chapters list
  const chapters: ChapterItem[] = []
  $('#chapter-wrapper li.komik_info-chapters-item').each((_, el) => {
    const chapterTitle = $(el).find('a.chapter-link-item').text().trim()
    const chapterUrl = $(el).find('a.chapter-link-item').attr('href') || ''
    const updatedAt = $(el).find('.chapter-link-time').text().trim()
    chapters.push({
        title: chapterTitle,
        url: extractChapterSlug(chapterUrl),
        updatedAt,
    })
  })

  return {
    title,
    nativeTitle,
    slug,
    image,
    genres,
    released,
    author,
    status,
    type,
    totalChapter,
    updatedOn,
    rating,
    sinopsis,
    chapters,
  }
}

export const scrapeKomikChapterBySlug = async (slug: string, chapter: string) : Promise<KomikChapterDetail>=> {
  const url = `${process.env.KOMIKCAST_URL}/chapter/${slug}-${chapter}/`
  const html = await fetchHtml(url)
  const $ = load(html)

  // Ambil semua gambar halaman komik
  const images: string[] = []
  $('.main-reading-area img').each((_, el) => {
    const imgUrl = $(el).attr('src')
    if (imgUrl) images.push(imgUrl)
  })

  // Ambil daftar chapter dari select option
  const chaptersList: ChapterListItem[] = []
  $('#slch option').each((_, el) => {
    const option = $(el)
    const chapterTitle = option.text().trim()
    const chapterUrl = option.attr('value') || ''
    chaptersList.push({ title: chapterTitle, url: extractChapterSlug(chapterUrl) })
  })

  // Ambil link previous dan next chapter
  const prevChapter = $('a[rel="prev"]').attr('href') || null
  const nextChapter = $('a[rel="next"]').attr('href') || null

  return {
    url,
    slug,
    chapter,
    images,
    chaptersList,
    prevChapter,
    nextChapter,
  }
}


