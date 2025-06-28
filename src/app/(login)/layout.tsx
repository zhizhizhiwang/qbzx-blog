import type { Metadata } from 'next'
import {
    ClerkProvider,
} from '@clerk/nextjs'
import "@/css/globals.css";

export const metadata: Metadata = {
    title: '登录页',
    description: '登录页',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <div className={`antialiased`}>
                {children}
            </div>
        </ClerkProvider>
    )
}