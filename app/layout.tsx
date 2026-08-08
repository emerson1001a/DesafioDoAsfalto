import type { Metadata, Viewport } from "next";
import "./globals.css";
import MetaPixel from "./MetaPixel";

// Ao trocar a imagem no futuro, incremente o "v" (ex: ?v=4) para
// forçar WhatsApp/Facebook a buscarem a versão nova, sem depender
// de cache expirar sozinho.
const ogImage = "/desafio-do-asfalto-whatsapp-zedagraxa-1200x630.png?v=3";

export const metadata: Metadata = {
  metadataBase: new URL("https://desafio-do-asfalto.vercel.app"),
  title: "Desafio do Asfalto",
  applicationName: "@Zedagraxa.oficial",
  description: "POR @ZEDAGRAXA.OFICIAL",
  openGraph: {
    title: "Desafio do Asfalto",
    description: "POR @ZEDAGRAXA.OFICIAL",
    siteName: "@Zedagraxa.oficial",
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Desafio do Asfalto" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Desafio do Asfalto",
    description: "POR @ZEDAGRAXA.OFICIAL",
    images: [ogImage]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#090909"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body>
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
