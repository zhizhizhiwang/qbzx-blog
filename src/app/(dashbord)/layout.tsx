import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/css/globals.css";
import styles from "@/css/page.module.css";
import Sidebar from "@/item/sidebar";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Qbzx bbs",
    description: "文章面板",
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
                <body className={`${geistSans.variable} ${geistMono.variable}`}>
                    {children}
                </body>
            </ClerkProvider>
        </html>

    );
}
