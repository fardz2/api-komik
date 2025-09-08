import { load } from "cheerio";
import type { ChapterItem, ChapterListItem, KomikChapterDetail, KomikDetail } from "../types/detail-komik.types.js";
import { fetchHtml } from "../utils/fetchHtml.js";
import { extractChapterSlug } from "../utils/extractslug.js";
// import { scrapeKomikBySlug } from "./scrapeKomikBySlug.js"; // Import the function

export const scrapeKomikChapterBySlug = async (slug: string, chapter: string): Promise<KomikChapterDetail> => {
  const url = `${process.env.KOMIKCAST_URL}/${chapter}/`;
  const html = await fetchHtml(url);
  const $ = load(html);

  let chaptersList: ChapterListItem[] = [];
  try {
    const komikDetail = await scrapeKomikBySlug(slug);
    chaptersList = komikDetail.chapters.map((ch: ChapterItem) => ({
      title: ch.title,
      url: ch.url,
    }));
  } catch (e) {
    console.error(`Error fetching chapter list from scrapeKomikBySlug for manga slug ${slug}:`, e);
  }

  // Extract images from script ts_reader.run
  const images: string[] = [];
  const scriptContent = $('script:contains("ts_reader.run")').html();
  if (scriptContent) {
    const jsonMatch = scriptContent.match(/ts_reader\.run\(({.*?})\);/s);
    if (jsonMatch) {
      try {
        const config = JSON.parse(jsonMatch[1]);
        if (config.sources && config.sources[0].images) {
          images.push(...config.sources[0].images);
        }
      } catch (e) {
        console.error('Error parsing ts_reader JSON:', e);
      }
    }
  }

  // Extract prev and next chapter from script ts_reader.run
  let prevChapter: string | null = null;
  let nextChapter: string | null = null;
  if (scriptContent) {
    const jsonMatch = scriptContent.match(/ts_reader\.run\(({.*?})\);/s);
    if (jsonMatch) {
      try {
        const config = JSON.parse(jsonMatch[1]);
        prevChapter = extractChapterSlug(config.prevUrl || '') || null;
        nextChapter = extractChapterSlug(config.nextUrl || '') || null;
      } catch (e) {
        console.error('Error parsing ts_reader JSON for prev/next:', e);
      }
    }
  }

  // Fallback to HTML elements if prev/next not found in script
  if (!prevChapter) {
    const prevChapterHref = $('.nextprev a.ch-prev-btn').attr('href') || '';
    prevChapter = extractChapterSlug(prevChapterHref) || null;
  }
  if (!nextChapter) {
    const nextChapterHref = $('.nextprev a.ch-next-btn').attr('href') || '';
    nextChapter = extractChapterSlug(nextChapterHref) || null;
  }

  // Extract chapter title or number from the page, fallback to slug
  const chapterTitle = $('h1.entry-title').text().trim() || chapter;

  return {
    slug: chapter,
    chapter: chapterTitle,
    images,
    chaptersList,
    prevChapter,
    nextChapter,
  };
};

// The scrapeKomikBySlug function remains unchanged
export const scrapeKomikBySlug = async (slug: string): Promise<KomikDetail> => {
  const url = `${process.env.KOMIKCAST_URL}/manga/${slug}`;
  const html = await fetchHtml(url);
  const $ = load(html);

  const title = $('h1.entry-title').text().trim();
  const image = $('.thumb img').attr('src') || '';
  const rating = $('.rating .num').text().trim();
  const sinopsis = $('.entry-content[itemprop="description"]').text().trim();
  const updatedOn = $('time[itemprop="dateModified"]').attr('datetime') || '';
  const totalChapter = $('.epcur.epcurlast').text().trim();

  const genres: string[] = $('.seriestugenre a')
    .toArray()
    .map((el) => $(el).text().trim());

  let nativeTitle = '';
  let status = '';
  let type = '';
  let released = '';
  let author = '';

  $('.infotable tr').each((_, el) => {
    const key = $(el).find('td').first().text().trim().toLowerCase();
    const value = $(el).find('td').last().text().trim();
    switch (key) {
      case 'alternative':
        nativeTitle = value;
        break;
      case 'status':
        status = value;
        break;
      case 'type':
        type = value;
        break;
      case 'released':
        released = value;
        break;
      case 'author':
        author = value;
        break;
    }
  });

  const chapters: ChapterItem[] = $('#chapterlist li')
    .toArray()
    .map((el) => {
      const anchor = $(el).find('a');
      const chapterTitle = anchor.find('.chapternum').text().trim();
      const chapterUrl = anchor.attr('href') || '';
      const updatedAt = anchor.find('.chapterdate').text().trim();
      return {
        title: chapterTitle,
        url: extractChapterSlug(chapterUrl) || '',
        updatedAt,
      };
    });

  return {
    author,
    chapters,
    genres,
    image,
    nativeTitle,
    rating,
    released,
    sinopsis,
    slug,
    status,
    title,
    totalChapter,
    type,
    updatedOn,
  };
};