import { Analytics } from "@vercel/analytics/react";
import CookieConsent from "@/src/components/CookieConsent";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://raizesnegras.vercel.app"),
  title: "Raízes Negras - Portal da Cultura Afro-Maranhense | História e Identidade",
  description:
    "Explore a rica herança cultural afro-brasileira do Maranhão através de documentos históricos, manifestações culturais e pesquisas.",
  keywords: [
    "cultura afro-brasileira",
    "maranhão",
    "história negra",
    "manifestações culturais",
    "patrimônio cultural",
    "documentos históricos",
    "identidade negra",
  ],
  authors: [{ name: "Portal Raízes Negras" }],
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Raízes Negras - Portal da Cultura Afro-Maranhense",
    description:
      "Explore a rica herança cultural afro-brasileira do Maranhão através de documentos históricos, manifestações culturais e pesquisas.",
    url: "https://raizesnegras.vercel.app",
    siteName: "Raízes Negras",
    images: ["/social-share.png"],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raízes Negras - Portal da Cultura Afro-Maranhense",
    description:
      "Explore a rica herança cultural afro-brasileira do Maranhão através de documentos históricos, manifestações culturais e pesquisas.",
    images: ["/social-share.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" dir="ltr">
      <body>
        <CookieConsent />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
