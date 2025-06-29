import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "마케터 역량 진단",
  description: "당신의 마케터 유형을 진단하고 강점을 발견하세요",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: "마케터 역량 진단",
    description: "당신의 마케터 유형을 진단하고 강점을 발견하세요",
    images: [
      {
        url: '/og-images/main3.png',
        width: 720,
        height: 720,
        alt: '마케터 성향테스트 대표 썸네일',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-head"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-W3K5QHBK');
            `,
          }}
        />
        {/* End Google Tag Manager */}
        
        {/* Kakao SDK */}
        <Script
          id="kakao-sdk"
          strategy="beforeInteractive"
          src="https://developers.kakao.com/sdk/js/kakao.js"
        />
        
        {/* Kakao SDK 초기화 */}
        <Script
          id="kakao-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.Kakao) {
                if (!window.Kakao.isInitialized()) {
                  window.Kakao.init('f265d81144e358dad13c422075f42c62');
                }
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W3K5QHBK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}
