import { AppShell } from "@/components/layout/app-shell";
import Script from "next/script";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* GA4 설치 코드 시작 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-E6572JB840"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // URL에서 UTM 파라미터 추출
          const urlParams = new URLSearchParams(window.location.search);
          const utmParams = {};
          if (urlParams.get('utm_source')) utmParams.utm_source = urlParams.get('utm_source');
          if (urlParams.get('utm_medium')) utmParams.utm_medium = urlParams.get('utm_medium');
          if (urlParams.get('utm_campaign')) utmParams.utm_campaign = urlParams.get('utm_campaign');
          if (urlParams.get('utm_term')) utmParams.utm_term = urlParams.get('utm_term');
          if (urlParams.get('utm_content')) utmParams.utm_content = urlParams.get('utm_content');

          gtag('config', 'G-E6572JB840', {
            send_page_view: true,
            ...utmParams
          });
        `}
      </Script>
      {/* GA4 설치 코드 끝 */}

      <AppShell>{children}</AppShell>
    </>
  );
}