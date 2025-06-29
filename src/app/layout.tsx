import type { Metadata } from "next";
import "./globals.css";
import { roboto } from "@/font/font";
import { Providers } from "./providers";


export const metadata: Metadata = {
  title: "MediCare",
  description: "Système de gestion médicale moderne",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="fr">
      <body className={`${roboto.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
