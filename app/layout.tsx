import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import type { LocalizationResource } from "@clerk/types";
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// DESIGN_PLAN.md: Inter 폰트 (우선순위)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// DESIGN_PLAN.md: JetBrains Mono 폰트
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Linkpitch - AI 수주 비서",
  description: "퍼포먼스 마케터를 위한 콜드메일·시퀀스 비서",
  // favicon.ico는 app/favicon.ico에 있으면 Next.js가 자동으로 인식합니다
  // metadata에서 명시적으로 설정할 필요 없음
};

// Clerk 한국어 localization 커스터마이징
const customKoKR: LocalizationResource = {
  ...koKR,
  signIn: {
    ...koKR.signIn,
    start: {
      ...koKR.signIn?.start,
      title: "LinkPitch에 로그인",
      subtitle: "환영합니다! 계속하려면 로그인해 주세요",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      localization={customKoKR}
      appearance={{
        variables: {
          colorPrimary: "#f59e0b",
        },
      }}
    >
      <html lang="ko" className="dark" suppressHydrationWarning>
        <head>
          <link
            rel="stylesheet"
            as="style"
            crossOrigin="anonymous"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
          style={{
            fontFamily: 'var(--font-inter), var(--font-pretendard), var(--font-geist-sans), sans-serif',
          }}
        >
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
          
          <SyncUserProvider>
            {children}
            <Toaster position="top-center" richColors />
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
