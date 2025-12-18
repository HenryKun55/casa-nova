import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Amazon S3 / CloudFront
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      // Google Cloud Storage
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      // Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // ImgBB
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      // Imgur
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      // Domínios de lojas comuns
      {
        protocol: "https",
        hostname: "**.magazineluiza.com.br",
      },
      {
        protocol: "https",
        hostname: "**.americanas.com.br",
      },
      {
        protocol: "https",
        hostname: "**.mercadolivre.com.br",
      },
      {
        protocol: "https",
        hostname: "**.shopee.com.br",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      // Adicione mais domínios conforme necessário
    ],
    // Otimização de imagens ativa para performance
    unoptimized: false,
    // Cache de imagens otimizado
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 dias
  },
};

export default nextConfig;
