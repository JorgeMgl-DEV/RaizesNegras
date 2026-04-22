/** @type {import('next').NextConfig} */
const publicEnv = {
  NEXT_PUBLIC_GOOGLE_API_KEY:
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.VITE_GOOGLE_API_KEY || "",
  NEXT_PUBLIC_GOOGLE_DRIVE_ID:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_ID || process.env.VITE_GOOGLE_DRIVE_ID || "",
  NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_GENERAL:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_GENERAL ||
    process.env.VITE_GOOGLE_DRIVE_FOLDER_GENERAL ||
    "",
  NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_CENTRO:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_CENTRO ||
    process.env.VITE_GOOGLE_DRIVE_FOLDER_CENTRO ||
    "",
  NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_LESTE:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_LESTE ||
    process.env.VITE_GOOGLE_DRIVE_FOLDER_LESTE ||
    "",
  NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_NORTE:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_NORTE ||
    process.env.VITE_GOOGLE_DRIVE_FOLDER_NORTE ||
    "",
  NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_OESTE:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_OESTE ||
    process.env.VITE_GOOGLE_DRIVE_FOLDER_OESTE ||
    "",
  NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_SUL:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_SUL ||
    process.env.VITE_GOOGLE_DRIVE_FOLDER_SUL ||
    "",
  NEXT_PUBLIC_GOOGLE_DRIVE_SUBFOLDER_ID:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_SUBFOLDER_ID ||
    process.env.VITE_GOOGLE_DRIVE_SUBFOLDER_ID ||
    "",
};

const nextConfig = {
  env: publicEnv,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iema.ma.gov.br",
      },
      {
        protocol: "https",
        hostname: "imagens.ebc.com.br",
      },
      {
        protocol: "https",
        hostname: "agenciabrasil.ebc.com.br",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self' https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
