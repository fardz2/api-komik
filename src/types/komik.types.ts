export interface KomikItem {
  title: string
  slug: string
  image: string
  type: string
  chapter: string
  rating: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface DaftarKomikResult {
  comics: KomikItem[]
  pagination: PaginationInfo
}

export interface FilterOptions {
  page?: number
  genre?: string[] // contoh: ['4-koma', 'comedy']
  status?: string  // 'Ongoing' atau 'Completed'
  type?: string    // 'manga', 'manhwa', 'manhua'
  orderby?: string // 'titleasc', 'titledesc', dll.
}
