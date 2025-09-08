
import type { KomikItem, PaginationInfo } from '../types/komik.types.js';
import { extractSlug } from './extractslug.js';
import { decodeHtml } from './fetchHtml.js';
import type { CheerioAPI } from 'cheerio';

export const parseKomikList = ($: CheerioAPI): KomikItem[] => {
 const results: KomikItem[] = [];

 $('.listupd .bs').each((_: any, el: any) => {
    const anchor = $(el).find('a');
    const img = $(el).find('img');
    const fullUrl = anchor.attr('href') || '';

    const typeSpan = $(el).find('span.type');
    const typeClasses = typeSpan.attr('class')?.split(' ') || [];
    const comicType = typeClasses.find(cls => cls !== 'type') || '';

  results.push({
  
      title: decodeHtml(anchor.attr('title') || ''),
      slug: extractSlug(fullUrl),
      image: img.attr('src') || '',
      type: comicType, 
      chapter: $(el).find('.epxs').text().trim(),

      rating: $(el).find('.numscore').text().trim()
    });
  });
  return results;
};

export const parsePagination = ($: CheerioAPI, fallbackPage: number): PaginationInfo => {
// Halaman saat ini adalah halaman yang diminta.
const currentPage = fallbackPage;

// Cek keberadaan tombol "Next" (class 'r') dan "Prev" (class 'l').
const hasNext = $('.hpage .r').length > 0;
const hasPrev = $('.hpage .l').length > 0;

return {
  currentPage,
  hasNext,
  hasPrev,
};
};
