/**
 * Curated list of common Turkish job titles.
 * Used as autocomplete suggestions in the salary form.
 *
 * Phase 1: replace with a normalized `Position` model in the DB so we can
 * canonicalize submissions ("Frontend Developer" vs "Front-end Geliştirici").
 */

export const commonPositions = [
  // Yazılım
  "Yazılım Geliştirici",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Mobil Developer",
  "iOS Developer",
  "Android Developer",
  "Data Engineer",
  "Data Scientist",
  "Data Analyst",
  "ML Engineer",
  "QA Engineer",
  "SRE",
  "Cloud Engineer",
  "Cybersecurity Engineer",
  "Engineering Manager",
  "Tech Lead",
  "CTO",
  // Tasarım & ürün
  "UI/UX Designer",
  "Product Designer",
  "Graphic Designer",
  "Product Manager",
  "Product Owner",
  "Project Manager",
  "Scrum Master",
  // Mühendislik
  "Makine Mühendisi",
  "Elektrik Mühendisi",
  "Elektronik Mühendisi",
  "Endüstri Mühendisi",
  "İnşaat Mühendisi",
  "Kimya Mühendisi",
  "Bilgisayar Mühendisi",
  "Çevre Mühendisi",
  "Otomotiv Mühendisi",
  "Mimar",
  // Sağlık
  "Doktor",
  "Hemşire",
  "Diş Hekimi",
  "Eczacı",
  "Fizyoterapist",
  "Psikolog",
  // Eğitim
  "Öğretmen",
  "Akademisyen",
  "Eğitim Koordinatörü",
  // Finans / Hukuk
  "Avukat",
  "Mali Müşavir",
  "Muhasebeci",
  "Finans Uzmanı",
  "Bankacı",
  // Pazarlama / Satış
  "Pazarlama Uzmanı",
  "Dijital Pazarlama Uzmanı",
  "SEO Uzmanı",
  "Performans Pazarlama Uzmanı",
  "İçerik Üreticisi",
  "Sosyal Medya Uzmanı",
  "Satış Temsilcisi",
  "Satış Müdürü",
  "Müşteri Temsilcisi",
  "Çağrı Merkezi Operatörü",
  // İK & operasyon
  "İnsan Kaynakları Uzmanı",
  "İK Müdürü",
  "Operasyon Uzmanı",
  "Lojistik Uzmanı",
  "Tedarik Zinciri Uzmanı",
  // Üretim & saha
  "Üretim Operatörü",
  "Üretim Müdürü",
  "Kalite Kontrol Uzmanı",
  "Vardiya Amiri",
  "Ustabaşı",
  "Şoför",
  // Hizmet
  "Garson",
  "Aşçı",
  "Şef",
  "Berber / Kuaför",
  "Güvenlik Görevlisi",
  // Diğer
  "Serbest Meslek",
  "Stajyer",
] as const;

export type CommonPosition = (typeof commonPositions)[number];
