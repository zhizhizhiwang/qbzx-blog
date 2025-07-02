import type { Metadata } from "next";

import "@/css/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";

const SarasaFont = localFont({
    src: "../../public/font/SarasaMonoSlabSC-Regular.woff2",
    variable: "--font-mono",
});


export const metadata: Metadata = {
    title: "Qbzx bbs",
    icons: {
        icon: '/qbbs.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-Hans">
            <ClerkProvider>
                <body className={`${SarasaFont.className} antialiased`}>
                    {children}
                </body>
            </ClerkProvider>
        </html>

    );
}
