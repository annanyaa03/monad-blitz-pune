import type { Metadata } from "next";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";

import Providers from "@/components/Providers";

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
    <html lang="en">
      <body className="antialiased bg-[#FAFAFA] text-[#111111]">
        <Providers>
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </Providers>
      </body>
    </html>
  );
}
