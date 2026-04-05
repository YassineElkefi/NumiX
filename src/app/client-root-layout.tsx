"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../contexts/ThemeContext";
import Footer from "../components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full flex flex-col min-h-screen bg-[var(--bg)]">
        <ThemeProvider>
          {/* Main content grows to fill space */}
          <div className="flex-1">{children}</div>

          {/* Footer sticks to bottom */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}