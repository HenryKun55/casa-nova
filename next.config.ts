import type { NextConfig } from "next";

// Site estático para GitHub Pages: https://henrykun55.github.io/casa-nova/
// Em produção (GitHub Actions) usamos basePath; em dev fica na raiz.
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/casa-nova" : "";

const nextConfig: NextConfig = {
  output: "export", // gera HTML estático em ./out
  basePath,
  trailingSlash: true, // melhor compatibilidade com GitHub Pages
  images: {
    unoptimized: true, // GitHub Pages não tem otimizador de imagem
  },
};

export default nextConfig;
