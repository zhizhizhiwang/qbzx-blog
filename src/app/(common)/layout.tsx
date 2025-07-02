import type { Metadata } from "next";
import "@/css/globals.css";

export const metadata: Metadata = {
  title: "Qbzx bbs",
  description: "Qbzx bbs",
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
    <>
      {children}
    </>
  );
}
