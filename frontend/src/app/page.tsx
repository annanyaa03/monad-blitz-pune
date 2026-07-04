"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LandingContent from "@/components/LandingContent";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <Hero />
      <LandingContent />
      <Footer />
    </main>
  );
}
