// utils/extractSlug.ts
export const extractSlug = (url: string): string => {
  return url
    .replace(/^https?:\/\/[^/]+\/manga\//, '') // hapus domain dan /manga/
    .replace(/\/$/, '') // hapus slash terakhir kalau ada
}

export const extractChapterSlug = (url: string): string | null => {
  // Jika URL kosong, tidak valid, atau merupakan placeholder seperti '#/prev/' atau '#/next/'
  if (!url || url === '#/prev/' || url === '#/next/') {
    return null;
  }

  // Split URL dan ambil bagian terakhir (atau sebelumnya jika diakhiri '/')
  const parts = url.split('/').filter(part => part);
  const lastPart = parts[parts.length - 1];
  return lastPart === '' ? parts[parts.length - 2] : lastPart;
};