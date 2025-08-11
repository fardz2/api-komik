export interface ChapterItem {
  title: string
  url: string
  updatedAt: string
}

export interface KomikDetail {
  title: string
  nativeTitle: string
  slug: string
  image: string
  genres: string[]
  released: string
  author: string
  status: string
  type: string
  totalChapter: string
  updatedOn: string
  rating: string
  sinopsis: string
  chapters: ChapterItem[]
}
export interface ChapterListItem {
  title: string
  url: string
}

export interface KomikChapterDetail {
  url: string
  slug: string
  chapter: string
  images: string[]
  chaptersList: ChapterListItem[]
  prevChapter: string | null
  nextChapter: string | null
}
