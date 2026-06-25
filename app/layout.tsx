import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Desafio do Asfalto",
  description: "7 em cada 10 caminhoneiros erram pelo menos 3. Será que você passa?",
  openGraph: {
    title: "Desafio do Asfalto",
    description: "Você acha que manda na estrada? Testa aí.",
    type: "website"
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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
