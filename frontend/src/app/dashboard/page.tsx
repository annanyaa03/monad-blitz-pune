"use client";

import Navbar from "@/components/Navbar";
import DashboardPreview from "@/components/DashboardPreview";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="pt-20">
        <DashboardPreview />
      </div>
    </main>
  );
}
