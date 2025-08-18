import type { DaftarKomikResult, KomikItem } from '../types/komik.types.js';
import { decodeHtml, fetchHtml } from '../utils/fetchHtml.js';
import { load } from 'cheerio';
import { parseKomikList, parsePagination } from '../utils/parseKomikList.js';
import { extractSlug } from '../utils/extractslug.js';


export const scrapeHotKomik = async (): Promise<KomikItem[]> => {
  const html = await fetchHtml(`${process.env.KOMIKCAST_URL}/`)
  const $ = load(html)
  const results: KomikItem[] = []

  $('div.bixbox.hothome .swiper-slide').each((_, el) => {
    const anchor = $(el).find('a')
    const fullUrl = anchor.attr('href') || ''
    console.log('Full URL:', fullUrl)
    results.push({
      title: decodeHtml($(el).find('.title').text().trim()),
      slug: extractSlug(fullUrl),
      image: $(el).find('img').attr('src') || '',
      type: $(el).find('.type').text().trim(),
      chapter: $(el).find('.chapter').text().trim(),
      rating: $(el).find('.numscore').text().trim()
    })
  })

  return results
}

export const scrapeKomikTerbaru = async (page: number): Promise<DaftarKomikResult> => {
  const html = await fetchHtml(`${process.env.KOMIKCAST_URL}/daftar-komik/page/${page}/?sortby=update`);
  const $ = load(html);
  return {
    comics: parseKomikList($),
    pagination: parsePagination($, page)
  };
};

export const scrapeDaftarKomik = async (filters: {
  page: number;
  genre: string[];
  status: string;
  type: string;
  orderby: string;
}): Promise<DaftarKomikResult> => {
  const query = new URLSearchParams();
  filters.genre.forEach((g, i) => query.append(`genre[${i}]`, g));
  if (filters.status) query.append('status', filters.status);
  if (filters.type) query.append('type', filters.type);
  if (filters.orderby) query.append('orderby', filters.orderby);

  const baseUrl = process.env.KOMIKCAST_URL?.replace(/\/+$/, '') || '';
  const html = await fetchHtml(`${baseUrl}/daftar-komik/page/${filters.page}/?${query.toString()}`);
  const $ = load(html);

  return {
    comics: parseKomikList($),
    pagination: parsePagination($, filters.page)
  };
};

export const scrapeKomikSearch = async (filters: { q: string; page: number }): Promise<DaftarKomikResult> => {
  const baseUrl = process.env.KOMIKCAST_URL?.replace(/\/+$/, '') || '';
  const html = await fetchHtml(`${baseUrl}/page/${filters.page}/?s=${encodeURIComponent(filters.q)}&post_type=wp-manga`);
  const $ = load(html);

  return {
    comics: parseKomikList($),
    pagination: parsePagination($, filters.page)
  };
};

export const scrapeKomikByTipe = async (tipe: string, page: number): Promise<DaftarKomikResult> => {
  const baseUrl = process.env.KOMIKCAST_URL?.replace(/\/+$/, '') || '';
  const html = await fetchHtml(`${baseUrl}/type/${tipe}/page/${page}/`);
  const $ = load(html);
  return {
    comics: parseKomikList($),
    pagination: parsePagination($, page)
  };
}

export const scrapeKomikByGenre = async (genre: string, page: number): Promise<DaftarKomikResult> => {
  const baseUrl = process.env.KOMIKCAST_URL?.replace(/\/+$/, '') || '';
  const html = await fetchHtml(`${baseUrl}/genres/${genre}/page/${page}/`);
  const $ = load(html);
  return {
    comics: parseKomikList($),
    pagination: parsePagination($, page)
  };
};
