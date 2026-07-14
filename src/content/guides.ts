export type GuideIcon = "globe" | "building" | "phone" | "tag" | "life-buoy" | "radar";

export interface GuideSource {
  title: string;
  publisher: string;
  href: string;
  note: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  numbered?: string[];
  note?: string;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface Guide {
  slug: string;
  icon: GuideIcon;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  readingMinutes: number;
  publishedAt: string;
  reviewedAt: string;
  quickAnswer: string;
  intro: string[];
  checklistTitle: string;
  checklist: string[];
  sections: GuideSection[];
  faqs: GuideFaq[];
  sources: GuideSource[];
  related: string[];
}

const EGM_FRAUD = "https://www.egm.gov.tr/dolandiricilik";
const EGM_CYBER_FAQ = "https://www.egm.gov.tr/siber/sikca-sorulan-sorular";
const SGB_REPORT = "https://siberguvenlik.gov.tr/ihbar";
const SGB_LIST = "https://siberguvenlik.gov.tr/zararli-baglantilar";
const ICANN_RDAP = "https://www.icann.org/rdap/";
const WEB_RISK = "https://docs.cloud.google.com/web-risk/docs/lookup-api";
const KVKK_JOB_SCAM =
  "https://www.kvkk.gov.tr/Icerik/7095/IS-VAADI-KONULU-TCK-KAPSAMINDAKI-KISISEL-VERI-IHLALLERINE-ILISKIN-KAMUOYU-DUYURUSU";
const EDEVLET_CONSUMER = "https://www.turkiye.gov.tr/tuketici-sikayeti-uygulamasi";

export const guides: Guide[] = [
  {
    slug: "sahte-site-nasil-anlasilir",
    icon: "globe",
    title: "Sahte site nasıl anlaşılır? Ödeme öncesi 12 kontrol",
    shortTitle: "Sahte siteyi anlama",
    description:
      "Bir alışveriş veya ödeme sitesinin güvenilirliğini; alan adı, şirket bilgisi, ödeme akışı ve teknik sinyaller üzerinden adım adım değerlendir.",
    category: "Web güvenliği",
    readingMinutes: 9,
    publishedAt: "2026-06-22",
    reviewedAt: "2026-07-14",
    quickAnswer:
      "Tek bir işarete güvenme. Alan adını harf harf kontrol et; şirket ve iletişim bilgilerini bağımsız kaynakta doğrula; yalnızca havale isteyen, olağan dışı ucuz ve acele ettiren sitelerde ödeme yapma. HTTPS kilidi tek başına güven kanıtı değildir.",
    intro: [
      "Sahte bir mağaza, gerçek markanın renklerini, logosunu ve ürün fotoğraflarını birkaç saat içinde kopyalayabilir. Bu nedenle sayfanın profesyonel görünmesi güvenilir olduğunu göstermez. Sağlam değerlendirme; görünümden çok alan adının geçmişine, satıcının doğrulanabilir kimliğine ve ödeme davranışına bakar.",
      "Aşağıdaki yöntem satın alma kararını senin yerine vermez. Ama farklı sinyalleri birlikte okuyarak en yaygın tuzakları ödeme ekranına gelmeden fark etmene yardımcı olur.",
    ],
    checklistTitle: "60 saniyelik ödeme öncesi kontrol",
    checklist: [
      "Alan adını mesajdaki linkten değil, adres çubuğundan harf harf oku.",
      "Şirket unvanı, açık adres, iade koşulu ve çalışan iletişim kanalı var mı kontrol et.",
      "Fiyatı markanın veya bilinen mağazaların fiyatlarıyla karşılaştır.",
      "Yalnızca kişisel IBAN'a havale isteniyorsa ödemeyi durdur.",
      "Satıcıyı, mesajda verilen numara dışında bağımsız bir kanaldan doğrula.",
      "GerçekVeri sonucu dahil hiçbir tek araca kesin güven damgası gibi bakma.",
    ],
    sections: [
      {
        id: "alan-adi",
        title: "1. Alan adını ve adres çubuğunu incele",
        paragraphs: [
          "Dolandırıcılar genellikle bilinen bir markaya benzeyen, ancak bir harfi farklı olan alan adları kullanır. 'rn' birleşiminin 'm' gibi görünmesi, markaya 'destek', 'odeme' veya 'kampanya' kelimesi eklenmesi ve alışılmadık uzantılar sık görülen örneklerdir. Telefon ekranında adresin tamamı görünmüyorsa bağlantıyı kopyalayıp düz metin olarak incele.",
          "Alan adının yeni olması tek başına suç kanıtı değildir; yeni işletmeler de yeni alan adı kullanır. Fakat birkaç günlük alan adı, olağan dışı indirim, kişisel IBAN ve acele baskısıyla birleşiyorsa risk belirgin şekilde yükselir. GerçekVeri, kayıt zamanını RDAP üzerinden okumaya çalışır; RDAP verisinin bulunmaması da tek başına olumsuz hüküm oluşturmaz.",
        ],
        bullets: [
          "Marka adı doğru mu, fazladan tire veya harf var mı?",
          "Bağlantı asıl alan adında mı, yoksa marka adı yalnızca uzun yolun içinde mi?",
          "Tarayıcı sertifika uyarısı veriyor mu? Uyarıyı geçerek devam etme.",
          "Arama reklamından geldiysen aynı adresi markanın resmi sosyal hesabı veya uygulamasıyla karşılaştır.",
        ],
      },
      {
        id: "sirket",
        title: "2. Satıcının gerçek dünyadaki izini doğrula",
        paragraphs: [
          "Güvenilir bir e-ticaret sayfasında şirket unvanı, açık iletişim bilgisi, ön bilgilendirme ve iade koşulları birbiriyle tutarlıdır. Sadece WhatsApp numarası veya ücretsiz e-posta adresi bulunması otomatik olarak dolandırıcılık demek değildir; ancak yüksek tutarlı alışveriş için doğrulanabilir bir muhatap bırakmaz.",
          "Sitedeki telefonu aramak tek başına bağımsız doğrulama değildir; numarayı da aynı kişi yazmış olabilir. Şirket adını ayrı bir aramada kontrol et, adresin gerçekten o işletmeye ait olup olmadığına bak ve markanın bilinen resmi kanalından ödeme alan adını teyit et.",
        ],
        bullets: [
          "İletişim ve iade sayfaları eksik veya başka sitelerden kopyalanmış mı?",
          "Şirket unvanı ile ödeme yapılan hesap sahibinin adı açıklanabilir biçimde uyuşuyor mu?",
          "Sosyal hesaplar yeni mi; yorumlar birbirine çok benzer veya topluca aynı tarihte mi?",
          "Destek ekibi temel ürün ve teslimat sorularına somut cevap verebiliyor mu?",
        ],
      },
      {
        id: "odeme",
        title: "3. Ödeme biçiminin sana ne anlattığını oku",
        paragraphs: [
          "Dolandırıcılık akışının en güçlü işaretlerinden biri geri alma ve itiraz mekanizmalarını devre dışı bırakmaya çalışmasıdır. Kişisel hesaba havale, kripto varlık, hediye kartı veya ekran paylaşımı talebi; özellikle tanımadığın satıcıda ciddi uyarıdır. Kartla ödeme de sıfır risk değildir, fakat bankanın işlem itirazı gibi ek süreçler sunabilir.",
          "3D Secure ekranına geldiğinde mağaza adı, tutar ve işlem bilgisini okumadan kod girme. Telefonla arayan birine SMS doğrulama kodu söyleme. Kodun bankadan gelmesi, arayan kişinin bankadan olduğunu kanıtlamaz; kod yalnızca işlemin senin cihazında onaylandığını gösterebilir.",
        ],
        note: "Acil ödeme, son ürün, hesabın kapanacak veya kurye kapıda gibi baskılar seni kontrol adımlarını atlamaya yöneltir. Zaman baskısını başlı başına bir risk sinyali say.",
      },
      {
        id: "teknik-sinyaller",
        title: "4. Teknik sonuçları doğru yorumla",
        paragraphs: [
          "HTTPS, tarayıcı ile site arasındaki trafiği şifreler; işletmenin dürüst olduğunu doğrulamaz. Benzer şekilde, eski bir alan adı da el değiştirmiş veya ele geçirilmiş olabilir. Kara listede sonuç bulunmaması 'güvenli' anlamına gelmez; yeni saldırılar listelere henüz girmemiş olabilir.",
          "En sağlıklı yaklaşım; alan adı yaşı, zararlı bağlantı listesi, internet geçmişi, kurumsal e-posta yapılandırması, satıcı kimliği ve topluluk ihbarlarını birlikte değerlendirmektir. GerçekVeri risk kartı bu sinyalleri görünür kılar, fakat resmi makam veya garanti hizmeti değildir.",
        ],
      },
    ],
    faqs: [
      {
        question: "HTTPS kilidi olan bir site dolandırıcı olabilir mi?",
        answer:
          "Evet. HTTPS bağlantıyı şifreler; alan adının sahibinin güvenilir olduğunu garanti etmez. Ücretsiz sertifikalar meşru siteler kadar sahte siteler tarafından da kullanılabilir.",
      },
      {
        question: "Yeni açılmış her site riskli midir?",
        answer:
          "Hayır. Yeni alan adı yalnızca bağlamsal bir sinyaldir. Şirket doğrulaması, ödeme yöntemi, fiyat davranışı ve diğer teknik işaretlerle birlikte değerlendirilmelidir.",
      },
      {
        question: "Kara listede çıkmıyorsa ödeme yapabilir miyim?",
        answer:
          "Bu sonuç yalnızca kontrol anında eşleşme bulunmadığını söyler. Yeni veya hedefli dolandırıcılıklar henüz listelenmemiş olabilir; diğer kontrolleri mutlaka yap.",
      },
    ],
    sources: [
      {
        title: "Dolandırıcılık",
        publisher: "Emniyet Genel Müdürlüğü",
        href: EGM_FRAUD,
        note: "Nitelikli dolandırıcılık ve kamu görevlisi taklidi uyarıları.",
      },
      {
        title: "Zararlı Bağlantılar",
        publisher: "T.C. Siber Güvenlik Başkanlığı",
        href: SGB_LIST,
        note: "Oltalama ve zararlı bağlantılar için güncel resmi kayıt araması.",
      },
      {
        title: "Registration Data Access Protocol (RDAP)",
        publisher: "ICANN",
        href: ICANN_RDAP,
        note: "Alan adı kayıt verisine erişen protokolün resmi açıklaması.",
      },
    ],
    related: ["risk-skoru-nasil-hesaplaniyor", "sahte-ilan-kapora-dolandiriciligi", "dolandirildim-ne-yapmaliyim"],
  },
  {
    slug: "iban-dolandiriciligi",
    icon: "building",
    title: "IBAN dolandırıcılığı: Havale yapmadan önce ne kontrol edilir?",
    shortTitle: "IBAN dolandırıcılığı",
    description:
      "IBAN biçim doğrulamasının sınırlarını, hesap sahibi kontrolünü, kapora tuzaklarını ve şüpheli para transferinde atılacak adımları öğren.",
    category: "Ödeme güvenliği",
    readingMinutes: 8,
    publishedAt: "2026-06-24",
    reviewedAt: "2026-07-14",
    quickAnswer:
      "Geçerli bir IBAN yalnızca numaranın matematiksel olarak doğru olduğunu gösterir; hesabın güvenilir veya satıcıya ait olduğunu göstermez. Transfer ekranındaki alıcı adını, satıcının doğrulanmış kimliğiyle karşılaştır ve tanımadığın kişiye kapora göndermeden önce bağımsız doğrulama yap.",
    intro: [
      "IBAN sorgularında en sık yapılan hata, 'geçerli' sonucunu 'güvenli' diye okumaktır. Mod-97 kontrolü yazım hatasını yakalayabilir ve banka kodu hakkında bilgi verebilir; hesabı kullanan kişinin niyetini, ürünün varlığını veya paranın geri alınabilirliğini ölçemez.",
      "Para transferi çoğu zaman hızlı sonuçlanır. Bu nedenle doğru kontrol anı transferden sonradan değil, onay düğmesinden öncedir.",
    ],
    checklistTitle: "Havale/EFT öncesi kısa kontrol",
    checklist: [
      "Alıcı adını, teklif veya sözleşmedeki kişi/şirket adıyla karşılaştır.",
      "IBAN son anda değiştiyse eski, doğrulanmış kanaldan tekrar teyit et.",
      "Ürün veya taşınmazı görmeden yüksek kapora gönderme.",
      "Açıklama alanına işlemin ne için yapıldığını açıkça yaz.",
      "Mesaj, ilan, hesap bilgisi ve dekontu kaybolmayacak şekilde sakla.",
      "Şüphedeysen transferi durdur; gerçek fırsat kısa bir doğrulama süresine dayanır.",
    ],
    sections: [
      {
        id: "gecerli-guvenli-degil",
        title: "Geçerli IBAN neden güven kanıtı değildir?",
        paragraphs: [
          "Türkiye IBAN'ı ülke kodu, kontrol basamakları, banka kodu ve hesap bölümünden oluşur. Matematiksel kontrol, rakamların belirli standarda uyup uymadığını sınar. Dolandırıcı da kendi adına veya erişebildiği başka bir hesap adına tamamen geçerli bir IBAN kullanabilir.",
          "GerçekVeri bu nedenle ihbar bulunmayan IBAN'ı 'güvenli' olarak etiketlemez; 'doğrulanmadı' gösterir. Halk ihbarı da kesin suç kanıtı değildir. Bir kayıt, dikkatli incelemeye başlanması için uyarı sinyali olarak ele alınmalıdır.",
        ],
      },
      {
        id: "alici-adi",
        title: "Alıcı adı ve işlem bağlamını eşleştir",
        paragraphs: [
          "Kurumsal bir satıcıya ödeme yaparken alıcı tarafın ilgisiz bir gerçek kişi olması açıklama gerektirir. Bireysel ikinci el alışverişte kişi hesabı normal olabilir; burada da ilandaki satıcı, görüştüğün kişi ve banka ekranındaki alıcı adı tutarlı olmalıdır.",
          "Kurumsal e-posta hesabı ele geçirilen saldırılarda gerçek bir faturanın IBAN'ı son anda değiştirilebilir. 'Muhasebe hesabımız değişti' mesajını aynı e-posta zincirinden yanıtlayarak doğrulamak yeterli değildir. Daha önce bildiğin bir telefon veya yüz yüze kanal kullan.",
        ],
        bullets: [
          "Alıcı adı neden farklı? Makul ve doğrulanabilir açıklama var mı?",
          "Ödeme bilgisi görüşmenin son dakikasında mı değişti?",
          "Para, ürün veya hizmetle hukuki bağı olmayan üçüncü kişiye mi gidiyor?",
          "Parayı parçalara bölme, açıklamayı boş bırakma veya farklı ad yazma isteniyor mu?",
        ],
      },
      {
        id: "kapora",
        title: "Kapora tuzağının ortak deseni",
        paragraphs: [
          "Kapora dolandırıcılığı çoğu zaman gerçekçi bir ilan, piyasanın biraz altında fiyat ve çok sayıda alıcı olduğu iddiasıyla başlar. Amaç, mağdurun ürünü görmeden küçük görünen bir tutarı hızlıca göndermesidir. İlk ödeme geldikten sonra kargo, sigorta veya noter adı altında yeni ödemeler istenebilir.",
          "Kimlik fotoğrafı, ruhsat veya tapu görüntüsü görmek tek başına koruma sağlamaz; bu belgeler başka bir mağdurdan çalınmış olabilir. Belgedeki kişiyle gerçekten görüştüğünü ve malın varlığını bağımsız şekilde doğrulamak gerekir.",
        ],
      },
      {
        id: "yanlis-transfer",
        title: "Şüpheli transfer yaptıysan ilk saat",
        paragraphs: [
          "Bankanın yalnızca resmi uygulamasındaki veya kartın üzerindeki numarayı kullanarak hemen bankaya ulaş. İşlemin durumunu, iptal/bloke veya dolandırıcılık bildirimi seçeneklerini sor. Sonuç garanti değildir; erken bildirim yine de en önemli adımdır.",
          "Mesajları silme, karşı tarafı uyarmak için acele etme ve daha fazla para gönderme. Dekont, ilan bağlantısı, kullanıcı adı, telefon, konuşma kayıtları ve zaman çizelgesini koru; ardından polis merkezi, Cumhuriyet Başsavcılığı veya Siber Suçlarla Mücadele birimine şahsen başvuru seçeneklerini değerlendir.",
        ],
      },
    ],
    faqs: [
      {
        question: "IBAN sahibinin adını internetten öğrenebilir miyim?",
        answer:
          "Bankacılık ve kişisel veri kuralları nedeniyle tam hesap sahibi bilgisi herkese açık değildir. Transfer ekranı bankanın izin verdiği ölçüde alıcı bilgisini gösterebilir; bu bilgiyi işlem bağlamıyla eşleştir.",
      },
      {
        question: "Ad-soyad eşleşiyorsa hesap güvenli midir?",
        answer:
          "Hayır. Bu yalnızca paranın beklediğin isimdeki hesaba gittiğini destekler. Ürün, hizmet veya niyet hakkında garanti vermez.",
      },
      {
        question: "GerçekVeri bir IBAN'ı neden doğrulanmadı gösteriyor?",
        answer:
          "Biçim ve banka bilgisi itibar ölçmez. Yeterli bağımsız sinyal veya topluluk kaydı yoksa yanlış güven üretmemek için sonuç doğrulanmadı olarak kalır.",
      },
    ],
    sources: [
      {
        title: "Dolandırıcılık",
        publisher: "Emniyet Genel Müdürlüğü",
        href: EGM_FRAUD,
        note: "Banka ve bilişim sistemlerinin araç olarak kullanıldığı dolandırıcılığa ilişkin resmi bilgi.",
      },
      {
        title: "İş vaadi konulu kişisel veri ihlalleri duyurusu",
        publisher: "Kişisel Verileri Koruma Kurumu",
        href: KVKK_JOB_SCAM,
        note: "Kimlik belgesi ve IBAN üzerinden yürütülen güncel tuzak örneği.",
      },
      {
        title: "Siber Suçlar Sıkça Sorulan Sorular",
        publisher: "Emniyet Genel Müdürlüğü",
        href: EGM_CYBER_FAQ,
        note: "Adli başvuru yollarına ilişkin resmi yönlendirme.",
      },
    ],
    related: ["sahte-ilan-kapora-dolandiriciligi", "dolandirildim-ne-yapmaliyim", "risk-skoru-nasil-hesaplaniyor"],
  },
  {
    slug: "telefon-sms-dolandiriciligi",
    icon: "phone",
    title: "Telefon ve SMS dolandırıcılığı: Arayan numara gerçek görünse bile",
    shortTitle: "Telefon ve SMS güvenliği",
    description:
      "Banka, polis, kargo veya kamu kurumu taklidi aramaları; sahte SMS bağlantıları ve doğrulama kodu tuzaklarına karşı uygulanabilir kontrol rehberi.",
    category: "İletişim güvenliği",
    readingMinutes: 8,
    publishedAt: "2026-06-28",
    reviewedAt: "2026-07-14",
    quickAnswer:
      "Arayan numara veya SMS başlığı gerçek görünebilir. Görüşmeyi sonlandır; kurumun numarasını mesajdan değil resmi uygulama, kart veya resmi siteden kendin bulup geri ara. Şifre, kart bilgisi ve tek kullanımlık doğrulama kodunu telefonda paylaşma.",
    intro: [
      "Telefon dolandırıcılığında saldırganın en güçlü aracı teknik bilgi değil, otorite ve aciliyet hissidir. Banka güvenlik birimi, savcı, polis, kargo veya müşteri hizmetleri gibi davranarak düşünme süresini kısaltmaya çalışır.",
      "Numaranın tanıdık görünmesi güvenilirlik kanıtı değildir. Arayan kimliği manipüle edilebilir; ayrıca gerçek bir kurumun adı SMS başlığında taklit edilebilir. Güvenli yöntem, görüşme içindeki kanıtlarla değil bağımsız bir kanalla doğrulamaktır.",
    ],
    checklistTitle: "Şüpheli aramada yapman gerekenler",
    checklist: [
      "Panik yapmadan görüşmeyi sonlandır.",
      "Arayanın verdiği numarayı değil, kurumun resmi numarasını kendin bul.",
      "SMS kodu, mobil bildirim onayı, kart şifresi veya ekran paylaşımı verme.",
      "Telefonuna uzaktan erişim uygulaması kurma.",
      "Bağlantıya tıklamak yerine resmi uygulamayı doğrudan aç.",
      "Şüpheli numarayı ve senaryoyu kanıtlarıyla bildir.",
    ],
    sections: [
      {
        id: "senaryolar",
        title: "En yaygın sosyal mühendislik senaryoları",
        paragraphs: [
          "'Hesabınızdan şüpheli işlem yapıldı', 'adınız soruşturmaya karıştı', 'kargonuz teslim edilemedi' veya 'iadeniz için kod söyleyin' cümleleri farklı görünse de aynı kalıbı izler: korku ya da kazanç duygusu oluştur, acil karar aldır ve gizli bilgiyi veya parayı ele geçir.",
          "Emniyet Genel Müdürlüğü, polis veya savcının operasyon yürütmek için para ve altın istemeyeceğini açıkça vurgular. Aynı şekilde banka çalışanı olduğunu söyleyen birinin tek kullanımlık kod istemesi, kodun bankadan gelmesiyle meşru hâle gelmez.",
        ],
        bullets: [
          "Hattın terör veya suç olayına karıştığı iddiası",
          "Hesabı korumak için 'güvenli hesaba' para aktarma talebi",
          "Kargo ücreti veya gümrük borcu için kısa bağlantı",
          "Ödül, iade veya kampanya için kart bilgisi ve kod talebi",
          "Cihaza destek vermek bahanesiyle ekran paylaşımı/uzaktan erişim",
        ],
      },
      {
        id: "bagimsiz-dogrulama",
        title: "Bağımsız doğrulama nasıl yapılır?",
        paragraphs: [
          "Görüşmeyi kapatmak kaba davranmak değildir; güvenlik prosedürüdür. Bankayı kartının arkasındaki numaradan veya resmi mobil uygulamadan ara. Kamu kurumuna e-Devlet üzerinden veya resmi alan adını kendin yazarak ulaş. Arayan kişinin verdiği dahili numarayı, linki veya geri arama talimatını kullanma.",
          "Dolandırıcı hattı açık tutarak başka birini aradığını sanmanı sağlayabilir. Özellikle sabit hat senaryolarında telefonu tamamen kapatıp başka cihazdan veya bir süre sonra aramak daha güvenlidir.",
        ],
      },
      {
        id: "sms",
        title: "SMS bağlantısında alan adını bul",
        paragraphs: [
          "Mesaj metninde marka adı geçmesi veya gönderen başlığının daha önceki gerçek mesajlarla aynı dizide görünmesi bağlantıyı güvenli yapmaz. Kısaltılmış linkler asıl hedefi gizler. Bağlantıya basmadan resmi uygulamaya girerek aynı bildirim gerçekten var mı kontrol et.",
          "Bir bağlantıya tıkladıysan ancak bilgi girmediysen sayfayı kapat, indirilen dosya olup olmadığını kontrol et ve cihazı güncelle. Parola girdiysen güvenilir cihazdan ilgili hesabın parolasını değiştir, diğer oturumları kapat ve çok faktörlü doğrulamayı etkinleştir.",
        ],
      },
      {
        id: "numara-sorgusu",
        title: "Numara sorgusunun sınırları",
        paragraphs: [
          "Numara biçimi, alan kodu veya hat türü yalnızca teknik bağlam sağlar. 0850 hattı kullanmak suç göstergesi olmadığı gibi cep telefonu numarası kullanmak da masumiyet kanıtı değildir. Numara taşıma, sanal santral ve arayan kimliği taklidi nedeniyle sahibin kimliği dışarıdan kesin belirlenemez.",
          "GerçekVeri telefon sonucunu, topluluk ihbarı yoksa bu nedenle 'doğrulanmadı' olarak tutar. Birden fazla tutarlı ihbar dikkat seviyesini artırır; yine de numaranın o anda kimin kontrolünde olduğunu kesinleştirmez.",
        ],
      },
    ],
    faqs: [
      {
        question: "Telefon ekranında bankanın numarası yazıyorsa gerçek midir?",
        answer:
          "Kesin değildir. Arayan kimliği taklit edilebilir. Görüşmeyi bitirip bankayı resmi uygulama veya kart üzerindeki numaradan kendin ara.",
      },
      {
        question: "SMS doğrulama kodunu banka çalışanı isteyebilir mi?",
        answer:
          "Tek kullanımlık kod işlemi onaylayabilir ve gizli tutulmalıdır. Arayan kişiye kod söyleme; mesajın işlem tutarı ve alıcı gibi ayrıntılarını oku.",
      },
      {
        question: "Şüpheli bağlantıyı nereye bildirebilirim?",
        answer:
          "Zararlı bağlantıyı T.C. Siber Güvenlik Başkanlığının ihbar formuna ve taklit edilen kuruma bildirebilirsin. Maddi kayıp varsa bankan ve adli makamlarla da iletişime geç.",
      },
    ],
    sources: [
      {
        title: "Dolandırıcılık",
        publisher: "Emniyet Genel Müdürlüğü",
        href: EGM_FRAUD,
        note: "Kamu görevlisi taklidi ve para talebi hakkında resmi uyarılar.",
      },
      {
        title: "Zararlı bağlantı ihbarı",
        publisher: "T.C. Siber Güvenlik Başkanlığı",
        href: SGB_REPORT,
        note: "Şüpheli URL ve siber olay bildirim formu.",
      },
      {
        title: "Zararlı Bağlantılar",
        publisher: "T.C. Siber Güvenlik Başkanlığı",
        href: SGB_LIST,
        note: "Oltalama ve zararlı bağlantı kayıtları.",
      },
    ],
    related: ["sahte-site-nasil-anlasilir", "dolandirildim-ne-yapmaliyim", "risk-skoru-nasil-hesaplaniyor"],
  },
  {
    slug: "sahte-ilan-kapora-dolandiriciligi",
    icon: "tag",
    title: "Sahte ilan ve kapora dolandırıcılığı nasıl fark edilir?",
    shortTitle: "Sahte ilan ve kapora",
    description:
      "Araç, ev, elektronik ve ikinci el ilanlarında çalıntı görsel, acele baskısı, platform dışına çıkarma ve kapora tuzaklarını fark et.",
    category: "Alışveriş güvenliği",
    readingMinutes: 9,
    publishedAt: "2026-07-01",
    reviewedAt: "2026-07-14",
    quickAnswer:
      "İlanın gerçek platformda bulunması satıcının güvenilir olduğunu göstermez. Ürünü ve satıcının tasarruf yetkisini bağımsız doğrulamadan kapora gönderme; platformun ödeme ve mesajlaşma sistemi dışına çıkma; çalıntı olabilecek belge fotoğrafını tek başına kanıt sayma.",
    intro: [
      "Sahte ilanlar çoğu zaman tamamen uydurma değildir. Gerçek bir ilanın fotoğrafları ve açıklaması kopyalanır, fiyat cazip olacak kadar düşürülür ve başka bir telefon/IBAN eklenir. Bu yüzden kaliteli fotoğraf, ayrıntılı açıklama veya ruhsat görüntüsü güven kanıtı sayılmaz.",
      "İlan güvenliğinde iki ayrı şeyi kontrol etmek gerekir: kullanılan platformun gerçek alan adı ve ilandaki satıcının gerçekten ürün üzerinde tasarruf yetkisi olup olmadığı.",
    ],
    checklistTitle: "Kapora göndermeden önce",
    checklist: [
      "Fotoğrafları tersine görsel aramayla veya farklı ilanlarda kontrol et.",
      "Satıcıdan o güne özel, makul bir doğrulama iste (ör. ürünü farklı açıdan canlı gösterme).",
      "Araç/taşınmaz gibi yüksek tutarda yüz yüze ve resmi kayıt doğrulaması yap.",
      "Platform dışı link, sahte güvenli ödeme sayfası veya kargo sigortası talebini reddet.",
      "Satıcı, ilan ve banka alıcı bilgisinin tutarlılığını kontrol et.",
      "Acele baskısı varsa işlemi durdur ve benzer ilanları karşılaştır.",
    ],
    sections: [
      {
        id: "kopya-ilan",
        title: "Kopyalanmış ilanı ele veren ayrıntılar",
        paragraphs: [
          "Aynı fotoğraf ve metin farklı şehirlerde, farklı hesaplarla veya belirgin fiyat farkıyla görünüyorsa ilan kopyalanmış olabilir. Görsellerin ekran görüntüsü olması, plakanın/seri numarasının farklı yöntemlerle kapatılması ve satıcının yeni fotoğraf üretmekten kaçınması da şüpheyi artırır.",
          "Yazım tarzı ile telefon görüşmesindeki ürün bilgisi uyuşmuyorsa satıcı ilanın asıl sahibi olmayabilir. Model, kullanım süresi, kusur ve teslimat gibi ayrıntılara net cevap verememesi önemlidir.",
        ],
      },
      {
        id: "platform-disi",
        title: "Platform dışına çıkarma ve sahte ödeme sayfası",
        paragraphs: [
          "Dolandırıcı, komisyon bahanesiyle mesajlaşmayı WhatsApp veya Telegram'a taşımak isteyebilir. Sonra platformun güvenli ödeme hizmetine benzeyen bir bağlantı gönderir. Adres çubuğundaki alan adı gerçek platforma ait değilse logo ve tasarımın benzemesi hiçbir anlam taşımaz.",
          "Platform içi sistemler de mutlak garanti değildir, ancak konuşma ve ödeme kaydının korunmasına yardımcı olabilir. Satıcı koruma mekanizmasını terk etmeni istiyorsa bunun kime yaradığına bak.",
        ],
      },
      {
        id: "belge",
        title: "Kimlik, ruhsat ve tapu fotoğrafı neden yeterli değil?",
        paragraphs: [
          "Belge fotoğrafları başka bir satış görüşmesinden, veri sızıntısından veya sosyal medyadan ele geçirilmiş olabilir. Görüntüdeki kişinin gerçekten konuştuğun kişi olduğunu ve belgenin güncel olduğunu doğrulamadan ödeme yapmak güvenli değildir.",
          "Ayrıca dolandırıcıya kendi kimlik fotoğrafını göndermek, yeni sahte ilanlarda senin kimliğinin kullanılmasına yol açabilir. Gerekli olmayan kişisel veriyi paylaşma; resmi işlem gerekiyorsa yalnızca yetkili ve doğrulanmış kanal kullan.",
        ],
      },
      {
        id: "teslimat",
        title: "Güvenli teslimat ve ödeme sırası",
        paragraphs: [
          "Düşük tutarlı ikinci el üründe bile ürünün güncel varlığını doğrula, takip edilebilir ödeme yöntemini tercih et ve konuşma kaydını sakla. Yüksek tutarlı araç veya taşınmaz işleminde ekspertiz, resmi kayıt ve mülkiyet/temsil yetkisi kontrolünü kapora öncesine al.",
          "Satıcı gerçekten ciddi bir alıcı arıyorsa makul doğrulama isteğini tehdit olarak görmez. 'Şimdi göndermezsen başkasına satıyorum' baskısı, sağlıklı kontrol sürecini bozmaya yönelik olabilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Bilinen bir pazaryerindeki ilan güvenli midir?",
        answer:
          "Platformun tanınması, tek tek satıcıların güvenilir olduğunu garanti etmez. Satıcıyı, ürünü ve ödeme akışını ayrıca doğrulamalısın.",
      },
      {
        question: "Satıcı kimlik fotoğrafı gönderdi; kapora gönderebilir miyim?",
        answer:
          "Kimlik görüntüsü çalıntı olabilir ve ürünle bağ kurmaz. Yüz yüze, canlı ve resmi doğrulama olmadan tek başına yeterli kanıt değildir.",
      },
      {
        question: "İlan linki sorgusu neyi kontrol eder?",
        answer:
          "GerçekVeri, bağlantının bilinen pazaryerine ait olup olmadığını, bilinmeyen alan adının teknik sinyallerini ve topluluk ihbarlarını inceler. Satıcının kimliğini veya ürünün varlığını doğrulayamaz.",
      },
    ],
    sources: [
      {
        title: "Dolandırıcılık",
        publisher: "Emniyet Genel Müdürlüğü",
        href: EGM_FRAUD,
        note: "Dolandırıcılık türleri ve resmi uyarılar.",
      },
      {
        title: "İş vaadi konulu kişisel veri ihlalleri duyurusu",
        publisher: "Kişisel Verileri Koruma Kurumu",
        href: KVKK_JOB_SCAM,
        note: "Sahte ilan, kimlik görseli ve IBAN talebinin riskleri.",
      },
      {
        title: "Tüketici Hakem Heyetlerine Başvuru",
        publisher: "e-Devlet / Ticaret Bakanlığı",
        href: EDEVLET_CONSUMER,
        note: "Uygun tüketici uyuşmazlıkları için resmi başvuru hizmeti.",
      },
    ],
    related: ["iban-dolandiriciligi", "sahte-site-nasil-anlasilir", "dolandirildim-ne-yapmaliyim"],
  },
  {
    slug: "dolandirildim-ne-yapmaliyim",
    icon: "life-buoy",
    title: "Dolandırıldım, ne yapmalıyım? İlk saat için müdahale planı",
    shortTitle: "Dolandırıldım: ilk adımlar",
    description:
      "Para transferi, kart, hesap veya kimlik bilgisi kaybında ilk saatten itibaren bankaya, hesaplara, delillere ve resmi başvuruya göre önceliklendirilmiş plan.",
    category: "Acil durum",
    readingMinutes: 10,
    publishedAt: "2026-07-04",
    reviewedAt: "2026-07-14",
    quickAnswer:
      "Önce zararı büyüten erişimi kes: bankanı resmi kanaldan ara, kart/hesap güvenlik işlemlerini başlat, ele geçirilen parolaları güvenilir cihazdan değiştir. Mesaj, dekont, URL ve zaman çizelgesini koru. Ardından polis merkezi, Cumhuriyet Başsavcılığı veya Siber Suçlarla Mücadele birimine başvur.",
    intro: [
      "Dolandırıcılık sonrası utanç veya panik yüzünden beklemek, saldırgana zaman kazandırır. Bu olaylar profesyonel sosyal mühendislik yöntemleriyle yürütülür; ilk hedef kendini suçlamak değil, erişimi kesmek ve kanıtı korumaktır.",
      "Aşağıdaki sıra genel bir müdahale planıdır. Her bankanın ve olayın süreci farklıdır; para iadesi veya hesabın bloke edilmesi garanti edilemez. Acil tehlike varsa 112'yi ara.",
    ],
    checklistTitle: "İlk 60 dakikanın öncelikleri",
    checklist: [
      "Bankayı kart/uygulamadaki resmi kanaldan ara ve olayı bildir.",
      "Kartı, dijital bankacılığı veya şüpheli işlemi bankanın yönlendirmesiyle güvene al.",
      "E-posta başta olmak üzere ele geçirilmiş parolaları temiz cihazdan değiştir.",
      "Tüm aktif oturumları kapat ve çok faktörlü doğrulamayı aç.",
      "Dekont, konuşma, numara, kullanıcı adı, ilan ve URL'lerin kopyasını al.",
      "Kronolojik bir olay özeti yaz ve resmi başvuru için sakla.",
    ],
    sections: [
      {
        id: "para",
        title: "1. Para veya kart işlemini hemen bankaya bildir",
        paragraphs: [
          "Bankanın numarasını gelen mesajdan veya arayan kişiden alma. Kartın arkasını, resmi mobil uygulamayı ya da bankanın alan adını kendin yazarak bulduğun iletişim kanalını kullan. İşlemin türünü, saatini, tutarını ve alıcı bilgisini net biçimde aktar; iptal, itiraz veya bloke imkânını sor.",
          "Dolandırıcı 'parayı kurtarma', 'vergi', 'dosya masrafı' veya 'iade onayı' adı altında ikinci ödeme isteyebilir. İlk kaybı geri almak için yeni para göndermek zararı büyütür. Banka ve kolluk dışındaki kurtarma hizmetlerine karşı da temkinli ol.",
        ],
      },
      {
        id: "hesap",
        title: "2. Dijital hesap zincirini güvene al",
        paragraphs: [
          "E-posta hesabı çoğu hizmetin parola sıfırlama merkezidir; önce onu güvene al. Güvenilir bir cihazdan benzersiz parola belirle, açık oturumları kapat, kurtarma telefonu/e-postasını kontrol et ve çok faktörlü doğrulamayı etkinleştir.",
          "Aynı parolayı kullandığın diğer hesapları sırayla değiştir. Uzaktan erişim uygulaması kurduysan internet bağlantısını kes, uygulamayı kaldırmadan önce gerekirse uzman desteği al ve cihazı güvenlik taramasından geçir. SIM hattın aniden servis dışı kaldıysa operatörle hemen görüş.",
        ],
      },
      {
        id: "delil",
        title: "3. Delili silme; düzenli bir dosya oluştur",
        paragraphs: [
          "Mesajları engellemeden önce ekran görüntüsü ve dışa aktarma seçeneklerini kullan. İlanın tamamını, profil adresini, ödeme talebini, banka dekontunu, telefon numarasını, e-posta başlıklarını ve şüpheli URL'yi kaydet. Ekran görüntüsünün yanında mümkünse asıl dosya veya bağlantıyı da sakla.",
          "Kısa bir zaman çizelgesi yaz: ilk temas, verilen vaat, gönderilen bilgi, ödeme ve fark etme anı. Bu kayıt bankaya ve adli makamlara aynı olayı tutarlı anlatmayı kolaylaştırır. Kanıt toplarken zararlı bağlantıyı yeniden açma veya şüpheli dosyayı çalıştırma.",
        ],
      },
      {
        id: "resmi-basvuru",
        title: "4. Doğru resmi kanala başvur",
        paragraphs: [
          "Emniyet Genel Müdürlüğünün yönlendirmesine göre olayın işlendiği yerden sorumlu polis merkezi, Cumhuriyet Başsavcılığı veya Siber Suçlarla Mücadele Şube Müdürlüğüne şahsen müracaat edilebilir. Başvuru yöntemi ve hukuki nitelik olaya göre değişebileceği için resmi birimlerin yönlendirmesini izle.",
          "Şüpheli bağlantıyı ayrıca T.C. Siber Güvenlik Başkanlığının ihbar formuna gönderebilirsin. Bir mal veya hizmet uyuşmazlığı söz konusuysa şartları oluştuğunda Ticaret Bakanlığının Tüketici Hakem Heyeti hizmeti de ayrı bir yol olabilir; ceza şikâyetinin yerine geçmez.",
        ],
        numbered: [
          "Bankaya/ödeme kuruluşuna olay kaydı açtır ve kayıt numarasını sakla.",
          "Delillerle birlikte kolluk veya savcılık başvurusunu yap.",
          "Zararlı URL'yi Siber Güvenlik Başkanlığına ve taklit edilen kuruma bildir.",
          "Kimlik belgesi paylaştıysan ilgili hesap ve kurumlarda olağan dışı işlem takibi yap.",
        ],
      },
    ],
    faqs: [
      {
        question: "Havale yaptım; banka parayı kesin geri alabilir mi?",
        answer:
          "Hayır, sonuç garanti değildir. İşlemin durumu ve bankalar arası süreç belirleyicidir. Yine de gecikmeden resmi banka kanalına bildirmek en önemli ilk adımdır.",
      },
      {
        question: "Mesajları silmeli veya dolandırıcıyı hemen engellemeli miyim?",
        answer:
          "Önce güvenli biçimde kanıtları kaydet. Sonrasında iletişimi kes; tehdit, fiziksel risk veya acil durum varsa kanıt toplamayı beklemeden 112'ye başvur.",
      },
      {
        question: "GerçekVeri'ye ihbar etmek resmi şikâyet sayılır mı?",
        answer:
          "Hayır. GerçekVeri topluluk uyarı platformudur; banka, kolluk, savcılık veya Siber Güvenlik Başkanlığına yapılan resmi bildirimin yerine geçmez.",
      },
    ],
    sources: [
      {
        title: "Siber Suçlar Sıkça Sorulan Sorular",
        publisher: "Emniyet Genel Müdürlüğü",
        href: EGM_CYBER_FAQ,
        note: "Şahsi müracaat ve başvuru yerlerine ilişkin resmi yönlendirme.",
      },
      {
        title: "Zararlı bağlantı ihbarı",
        publisher: "T.C. Siber Güvenlik Başkanlığı",
        href: SGB_REPORT,
        note: "Şüpheli URL ve siber olay bildirim formu.",
      },
      {
        title: "Tüketici Hakem Heyetlerine Başvuru",
        publisher: "e-Devlet / Ticaret Bakanlığı",
        href: EDEVLET_CONSUMER,
        note: "Uygun tüketici uyuşmazlıkları için resmi çevrimiçi hizmet.",
      },
    ],
    related: ["iban-dolandiriciligi", "telefon-sms-dolandiriciligi", "sahte-site-nasil-anlasilir"],
  },
  {
    slug: "risk-skoru-nasil-hesaplaniyor",
    icon: "radar",
    title: "GerçekVeri risk skoru nasıl hesaplanıyor? Açık metodoloji",
    shortTitle: "Risk skoru metodolojisi",
    description:
      "0-100 risk puanının hangi teknik sinyallerden oluştuğunu, topluluk ihbarlarının etkisini, bilinmeyen sonuçları ve sistemin sınırlarını açıkça gör.",
    category: "Metodoloji",
    readingMinutes: 11,
    publishedAt: "2026-07-07",
    reviewedAt: "2026-07-14",
    quickAnswer:
      "Skor; alan adı kayıt yaşı, zararlı bağlantı eşleşmesi, internet geçmişi, DNS/e-posta yapılandırması, barındırma bağlamı ve topluluk ihbarı gibi sinyallerin ağırlıklı toplamıdır. Bir karar veya güvenlik garantisi değildir; her sinyal kartta ayrı gösterilir.",
    intro: [
      "Bir güvenlik aracı yalnızca sonucunu değil, sonuca nasıl ulaştığını da açıklamalıdır. GerçekVeri bu nedenle tek bir 'güvenli/güvensiz' etiketi yerine puanı oluşturan sinyalleri kullanıcıya gösterir.",
      "Metodoloji özellikle yanlış güveni azaltmak için tasarlanmıştır. Veri yokluğunu güvenlik kanıtı saymaz; IBAN ve telefonda yalnızca biçim bilgisi varsa 'doğrulanmadı' sonucunu kullanır.",
    ],
    checklistTitle: "Bir risk kartını okurken",
    checklist: [
      "Toplam puandan önce tek tek sinyalleri oku.",
      "'Temiz' liste sonucunu garanti olarak yorumlama.",
      "Yeni alan adını bağlamdan kopuk suçlama sayma.",
      "Topluluk ihbarının doğrulanma ve sayı bilgisini dikkate al.",
      "Bilinmeyen/atlanmış kaynakların sonucu zayıflattığını unutma.",
      "Yüksek tutarlı kararlarda bağımsız ve resmi doğrulama yap.",
    ],
    sections: [
      {
        id: "model",
        title: "Puan modeli ve risk bantları",
        paragraphs: [
          "Motor düşük bir taban değerden başlar ve risk artıran sinyallerin ağırlığını toplar. Sonuç 0 ile 100 arasında sınırlandırılır. 0-34 arası 'güvenli görünüyor', 35-69 arası 'şüpheli', 70-100 arası 'yüksek risk' bandıdır. Sinyal yoksa veya yalnızca itibar göstermeyen biçim kontrolü varsa 'doğrulanmadı' kullanılır.",
          "Eşikler olasılık tahmini değildir; örneğin 70 puan yüzde 70 dolandırıcılık ihtimali anlamına gelmez. Bunlar farklı sinyalleri tek ekranda önceliklendirmek için kullanılan açıklanabilir karar bantlarıdır.",
        ],
      },
      {
        id: "web-sinyalleri",
        title: "Web sitesi sorgusunda kullanılan sinyaller",
        paragraphs: [
          "Alan adı kayıt yaşı RDAP üzerinden okunur. Google Web Risk yapılandırılmışsa URL, sosyal mühendislik ve zararlı yazılım listelerinde aranır. Arşiv geçmişi sitenin daha önce görülüp görülmediğine; DNS sorguları MX ve DMARC gibi e-posta yapılandırmalarına; IP bilgisi ise barındırma bağlamına yardımcı olur.",
          "Bu sinyallerin hiçbiri tek başına hüküm değildir. Yeni ve DMARC'sız bir kişisel site meşru olabilir; eski alan adı ele geçirilmiş olabilir; yurt dışında barındırma çok normaldir. Ağırlıklar kullanıcıyı daha fazla doğrulamaya yönelten risk göstergeleri olarak tasarlanmıştır.",
        ],
        bullets: [
          "0-14 günlük alan adı güçlü; 15-90 günlük alan adı orta uyarı üretir.",
          "Web Risk eşleşmesi güçlü olumsuz sinyaldir; eşleşme yokluğu garanti değildir.",
          "Arşiv geçmişinin olmaması hafif uyarıdır; yeni ve engellenmiş sitelerde veri bulunmayabilir.",
          "MX/DMARC eksikliği yardımcı sinyaldir; işletmenin meşruiyetini doğrudan ölçmez.",
          "Barındırma ülkesi yalnızca bağlamdır ve düşük ağırlık taşır.",
        ],
      },
      {
        id: "diger-turler",
        title: "IBAN, telefon ve ilan sonuçları",
        paragraphs: [
          "IBAN motoru mod-97 biçimini ve bilinen banka kodunu kontrol eder. Geçerli biçim, hesabın güvenli olduğunu göstermediği için ihbar yoksa bant 'doğrulanmadı'dır. Telefon motoru yalnızca numara biçimi ve hat türü gibi bağlamı çıkarır; numaranın kime ait olduğunu iddia etmez.",
          "İlan motoru bağlantının tanınan pazaryerine mi, sosyal medya alanına mı yoksa bilinmeyen bir siteye mi ait olduğunu değerlendirir. Tanınan platform sonucu satıcıyı güvenli ilan etmez; her kartta satıcıyı ayrıca doğrulama uyarısı bulunur.",
        ],
      },
      {
        id: "ihbar-ai",
        title: "Topluluk ihbarı, moderasyon ve AI özeti",
        paragraphs: [
          "İhbar sayısı arttıkça risk katkısı kademeli artar ve üst sınırda durur; böylece tek veri türü tüm kararı sonsuza kadar büyütmez. İhbarlar oran sınırlama ve kişisel veri maskeleme süreçlerinden geçer. Yine de kullanıcı bildirimi mahkeme kararı veya resmi kara liste değildir.",
          "AI özeti yalnızca kartta zaten görünen sinyalleri sadeleştirmek için kullanılır. Puanı AI belirlemez. AI servisi yoksa aynı sinyallerden kural tabanlı bir metin üretilir. Özet bilgilendirme amaçlıdır ve kullanıcıya ödeme emri vermez.",
        ],
        note: "Yanlış veya eski sonuçlar için her risk kartında itiraz bağlantısı bulunur. İnceleme sonucunda kayıt düzeltilebilir veya kaldırılabilir.",
      },
      {
        id: "sinirlar",
        title: "Bilinen sınırlar ve yanlış yorumlar",
        paragraphs: [
          "Sistem bir kişiyi teşhis etmez, suç isnadı yapmaz ve para iadesi garantisi vermez. Dış veri kaynakları geçici olarak yanıt vermeyebilir; yeni saldırılar henüz listelenmemiş olabilir; meşru site yanlış sinyaller üretebilir. Önbellekli taramalar en fazla 24 saat içinde yenilenir.",
          "Puan, bir karar destek aracıdır. Özellikle para, kimlik veya hesap erişimi içeren işlemlerde gerçek satıcıyı ve kurumu bağımsız kanallardan doğrulamak gerekir.",
        ],
      },
    ],
    faqs: [
      {
        question: "70 puan, yüzde 70 dolandırıcılık ihtimali mi?",
        answer:
          "Hayır. Puan kalibre edilmiş olasılık değil, ağırlıklı uyarı göstergesidir. Ayrıntılı sinyaller mutlaka okunmalıdır.",
      },
      {
        question: "Puanı yapay zekâ mı veriyor?",
        answer:
          "Hayır. Puan deterministik ağırlıklardan oluşur. Yapay zekâ yalnızca görünen sinyalleri sade bir paragrafta özetler.",
      },
      {
        question: "Sonuç yanlışsa ne yapabilirim?",
        answer:
          "Risk kartındaki itiraz bağlantısını kullanarak adresi ve gerekçeyi iletebilirsin. Kayıt ve teknik sinyaller incelenerek gerekli düzeltme yapılır.",
      },
    ],
    sources: [
      {
        title: "Registration Data Access Protocol (RDAP)",
        publisher: "ICANN",
        href: ICANN_RDAP,
        note: "Alan adı kayıt verisinin standart erişim protokolü.",
      },
      {
        title: "Using the Lookup API",
        publisher: "Google Cloud Web Risk",
        href: WEB_RISK,
        note: "URL'leri Google'ın Web Risk listelerinde arayan resmi API açıklaması.",
      },
      {
        title: "Zararlı Bağlantılar",
        publisher: "T.C. Siber Güvenlik Başkanlığı",
        href: SGB_LIST,
        note: "Türkiye'deki resmi zararlı bağlantı kayıtları ve sınıflandırması.",
      },
    ],
    related: ["sahte-site-nasil-anlasilir", "iban-dolandiriciligi", "telefon-sms-dolandiriciligi"],
  },
];

export const guideBySlug = new Map(guides.map((guide) => [guide.slug, guide]));

export const featuredGuides = guides.filter((guide) =>
  [
    "sahte-site-nasil-anlasilir",
    "dolandirildim-ne-yapmaliyim",
    "risk-skoru-nasil-hesaplaniyor",
  ].includes(guide.slug),
);
