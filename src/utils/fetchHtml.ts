export const fetchHtml = async (url: string): Promise<string> => {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  })

  if (!res.ok) {
    throw new Error(`Gagal fetch: ${url}`)
  }

  return await res.text()
}
