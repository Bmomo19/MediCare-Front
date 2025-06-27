import type { Metadata } from "next";
import "./globals.css";
import { roboto } from "@/font/font";
import { Providers } from "./providers";
import { ThemeModeScript } from 'flowbite-react';


export const metadata: Metadata = {
  title: "MediCare",
  icons: {
    icon: "/favicon.ico",
  },
  description: "Système de gestion médicale moderne",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${roboto.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
