"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ArchitectureSection from "@/components/ArchitectureSection";
import LandingContent from "@/components/LandingContent";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Navbar />
      <Hero />
      <ArchitectureSection />
      <LandingContent />
      <Footer />
    </main>
  );
}
