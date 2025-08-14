
import type { KomikItem, PaginationInfo } from '../types/komik.types.js';
import { extractSlug } from './extractslug.js';
import { decodeHtml } from './fetchHtml.js';
import type { CheerioAPI } from 'cheerio';

export const parseKomikList = ($: CheerioAPI): KomikItem[] => {
  const results: KomikItem[] = [];
  $('.list-update_item').each((_: any, el: any) => {
    const anchor = $(el).find('a');
    const img = $(el).find('img');
    const fullUrl = anchor.attr('href') || '';

    results.push({
      title: decodeHtml($(el).find('.title').text().trim()),
      slug: extractSlug(fullUrl),
      image: img.attr('src') || '',
      type: $(el).find('.type').text().trim(),
      chapter: $(el).find('.chapter').text().trim(),
      rating: $(el).find('.numscore').text().trim()
    });
  });
  return results;
};

export const parsePagination = ($: CheerioAPI, fallbackPage: number) : PaginationInfo => {
  let currentPage = fallbackPage;

  const currentText = $('.pagination .current').text().trim();
  if (currentText) currentPage = parseInt(currentText) || fallbackPage;

  if (!currentText) {
    const ariaCurrent = $('.pagination .page-numbers[aria-current="page"]').text().trim();
    if (ariaCurrent) currentPage = parseInt(ariaCurrent) || fallbackPage;
  }

  let totalPages = currentPage;
  $('.pagination .page-numbers').each((_: any, el: any) => {
    const num = parseInt($(el).text().trim());
    if (!isNaN(num) && num > totalPages) totalPages = num;
  });

  return {
    currentPage,
    totalPages,
    hasNext: $('.pagination .next').length > 0,
    hasPrev: $('.pagination .prev').length > 0
  };
};
