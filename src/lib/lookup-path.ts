// Sorgu URL'i — anahtar slash içerebilir (ilan: host/path). Catch-all route
// `/sorgu/[kind]/[...value]` ile eşleşir; her segment ayrı encode edilir.
export function lookupPath(kind: string, key: string): string {
  const path = key
    .split("/")
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `/sorgu/${kind}/${path}`;
}

// Next.js catch-all parametreleri bazı ortamlarda `%20` gibi kaçışları çözmeden
// döndürebilir. Her segmenti ayrı çözüp sonra birleştirmek, ilan URL'lerindeki
// gerçek slash sınırlarını da korur.
export function lookupValueFromSegments(segments: readonly string[]): string {
  return segments
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .join("/");
}
