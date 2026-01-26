import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NihongoApp - Aprende japonés",
  description: "Aplicación completa para aprender japonés: silabarios, vocabulario, gramática y partículas JLPT N5-N1",
  keywords: ["NihongoApp", "japonés", "aprender japonés", "JLPT", "hiragana", "katakana", "kanji", "gramática japonesa"],
  authors: [{ name: "NihongoApp Team" }],
  icons: {
    icon: "/nihon/logo.svg",
  },
  openGraph: {
    title: "NihongoApp - Aprende japonés",
    description: "Aplicación completa para aprender japonés: silabarios, vocabulario, gramática y partículas JLPT N5-N1",
    url: process.env.NODE_ENV === 'production' ? 'https://[USERNAME].github.io/nihon' : 'http://localhost:3000',
    siteName: "NihongoApp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NihongoApp - Aprende japonés",
    description: "Aplicación completa para aprender japonés: silabarios, vocabulario, gramática y partículas JLPT N5-N1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
