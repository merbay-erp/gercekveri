// Domain normalleştirme — sorgu/önbellek anahtarı için kanonik biçim.
// "https://WWW.Site.com/yol?x=1" → "site.com". Geçersizse null.
export function normalizeDomain(input: string): string | null {
  let s = (input ?? "").trim().toLowerCase();
  if (!s) return null;
  s = s.replace(/^https?:\/\//, "").replace(/^www\./, "");
  s = s.split("/")[0]!.split("?")[0]!.split("#")[0]!.split(":")[0]!;
  s = s.replace(/\.+$/, "");
  if (s.length < 4 || s.length > 253) return null;
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(s)) return null;
  if (s.includes("..")) return null;
  return s;
}
