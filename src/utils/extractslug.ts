// utils/extractSlug.ts
export const extractSlug = (url: string): string => {
  return url
    .replace(/^https?:\/\/[^/]+\/komik\//, '') // hapus domain dan /komik/
    .replace(/\/$/, '') // hapus slash terakhir kalau ada
}
export const extractChapterSlug = (url: string): string => {
  if (!url.includes('/chapter/')) return url
  const slug = url.split('/chapter/')[1] || ''
  return slug.endsWith('/') ? slug.slice(0, -1) : slug
}