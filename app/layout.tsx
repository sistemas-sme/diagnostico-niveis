import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Diagnóstico SME | Nível de Consciência Empresarial",
  description:
    "Descubra seu nível de consciência empresarial. Diagnóstico rápido — 10 perguntas, 5 minutos.",
  openGraph: {
    title: "Diagnóstico SME | Nível de Consciência Empresarial",
    description:
      "Descubra seu nível de consciência empresarial. Diagnóstico rápido — 10 perguntas, 5 minutos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${jakarta.className} h-full`}>
      <body className="min-h-full flex flex-col bg-[#030718] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
