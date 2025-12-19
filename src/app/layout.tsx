import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nosso Lar - Henrique & Yasmim",
  description: "Estamos começando nossa jornada juntos na Quinta das Alamedas. Venha fazer parte do nosso sonho! ❤️",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nosso Lar - H&Y",
  },
  openGraph: {
    title: "Nosso Lar dos Sonhos - Henrique & Yasmim",
    description: "Estamos começando nossa jornada juntos na Quinta das Alamedas. Venha fazer parte do nosso sonho! ❤️",
    type: "website",
    locale: "pt_BR",
    siteName: "Nosso Lar - Henrique & Yasmim",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nosso Lar dos Sonhos - Henrique & Yasmim",
    description: "Estamos começando nossa jornada juntos na Quinta das Alamedas. Venha fazer parte do nosso sonho! ❤️",
  },
  keywords: ["chá de casa nova", "henrique e yasmim", "quinta das alamedas", "nossa casa"],
  authors: [{ name: "Henrique & Yasmim" }],
};

export const viewport: Viewport = {
  themeColor: "#FF6B4A", // Laranja vibrante da Quinta das Alamedas
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
