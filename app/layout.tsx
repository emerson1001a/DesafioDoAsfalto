import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Desafio do Asfalto",
  description: "10 perguntas que ja derrubaram muito motorista experiente.",
  openGraph: {
    title: "Desafio do Asfalto",
    description: "Voce acha que manda na estrada? Testa ai.",
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
