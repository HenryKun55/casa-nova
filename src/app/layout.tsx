import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chá de Casa Nova - Henrique & Yasmim",
  description: "Ajude-nos a mobiliar nossa casa nova! Escolha um presente da nossa lista especial.",
  openGraph: {
    title: "Chá de Casa Nova - Henrique & Yasmim",
    description: "Ajude-nos a mobiliar nossa casa nova! Escolha um presente da nossa lista especial.",
    type: "website",
    locale: "pt_BR",
    siteName: "Chá de Casa Nova",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chá de Casa Nova - Henrique & Yasmim",
    description: "Ajude-nos a mobiliar nossa casa nova! Escolha um presente da nossa lista especial.",
  },
  keywords: ["chá de casa nova", "lista de presentes", "casa nova", "casamento"],
  authors: [{ name: "Henrique & Yasmim" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
