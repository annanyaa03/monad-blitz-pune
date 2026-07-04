import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";

import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monad AI Agent",
  description: "Autonomous trading agent powered by Monad and Pyth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground transition-colors duration-300">
        <Providers>
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </Providers>
      </body>
    </html>
  );
}
