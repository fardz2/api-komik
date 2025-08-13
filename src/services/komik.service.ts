
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
export const scrapeKomikTerbaru = async (): Promise<KomikItem[]> => {
  const html = await fetchHtml(`${process.env.KOMIKCAST_URL}/komik-terbaru`)
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

export const scrapeDaftarKomik = async (filters: {
  page: number;
  genre: string[]; // bisa array
  status: string;
  type: string;
  orderby: string;
}): Promise<DaftarKomikResult> => {
  const query = new URLSearchParams();

  // Tambahkan genre[]
  filters.genre.forEach(g => query.append('genre[]', g));

  if (filters.status) query.append('status', filters.status);
  if (filters.type) query.append('type', filters.type);
  if (filters.orderby) query.append('orderby', filters.orderby);

  // page di Komikcast tetap pakai /page/{n}
  const url = `${process.env.KOMIKCAST_URL}/daftar-komik/page/${filters.page}?${query.toString()}`;

  const html = await fetchHtml(url);
  const $ = load(html);

  const results: KomikItem[] = [];

  $('.list-update_item').each((_, el) => {
    const anchor = $(el).find('a');
    const img = $(el).find('img');
    const fullUrl = anchor.attr('href') || '';

    results.push({
      title: anchor.attr('title')?.trim() || '',
      slug: extractSlug(fullUrl),
      image: img.attr('src') || '',
      type: $(el).find('.type').text().trim(),
      chapter: $(el).find('.chapter').text().trim(),
      rating: $(el).find('.numscore').text().trim()
    });
  });

  // Pagination
  const currentPage = parseInt($('.pagination .current').text()) || filters.page;
  let totalPages = currentPage;

  $('.pagination .page-numbers').each((_, el) => {
    const num = parseInt($(el).text().trim());
    if (!isNaN(num) && num > totalPages) {
      totalPages = num;
    }
  });

  return {
    comics: results,
    pagination: {
      currentPage,
      totalPages,
      hasNext: $('.pagination .next').length > 0,
      hasPrev: $('.pagination .prev').length > 0
    }
  };
};




