
import "@/css/globals.css";
import 'github-markdown-css/github-markdown.css';
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import localFont from "next/font/local";

export const runtime = "experimental-edge";

const SarasaFont = localFont({
    src: "../../public/font/SarasaMonoSlabSC-Regular.woff2",
    variable: "--font-mono",
});


type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}



export default function RootLayout({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <html lang="zh-Hans">
      <body className={`${SarasaFont.className} antialiased`}>
          <Component {...pageProps} />
      </body>
    </html>
  );
}
