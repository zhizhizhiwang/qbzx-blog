import type { Metadata } from "next";

import "@/css/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

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
                <body className={`antialiased`}>
                    {children}
                </body>
            </ClerkProvider>
        </html>

    );
}
