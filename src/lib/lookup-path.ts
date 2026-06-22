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
