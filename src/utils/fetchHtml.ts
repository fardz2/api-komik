export const fetchHtml = async (url: string): Promise<string> => {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  if (!res.ok) {
    const error = new Error(`Gagal fetch: ${url}`);
    (error as any).status = res.status; // tambahkan properti status
    throw error;
  }

  return await res.text();
};


// Decode HTML entities seperti &#8220; menjadi tanda kutip
export function decodeHtml(html: string): string {
  return html.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code));
}