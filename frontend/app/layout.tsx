import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your AI Career Roadmap",
  description: "Get a personalized year-by-year career roadmap powered by AI.",
};

import { CareerProvider } from "@/context/CareerContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        <CareerProvider>
          {children}
        </CareerProvider>
      </body>
    </html>
  );
}
