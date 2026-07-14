/**
 * Google Consent Mode v2 varsayılanı reklam etiketi çalışmadan önce kurulur.
 * Tercih bileşeni, kullanıcının seçimini aynı gtag kuyruğuna update olarak yazar.
 */
export function ConsentModeDefaults() {
  return (
    <script
      id="consent-mode-defaults"
      dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          wait_for_update: 500
        });
        gtag('set', 'ads_data_redaction', true);
      `,
      }}
    />
  );
}
