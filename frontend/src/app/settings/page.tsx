"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { User, Bell, Key, Shield, Smartphone, Monitor } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function Settings() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "security", label: "Security & Keys", icon: <Key size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Monitor size={18} /> },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6 flex-1 w-full max-w-[1200px] mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex flex-col space-y-2 shrink-0">
          <h2 className="text-2xl font-semibold mb-6 px-4 tracking-tight">Settings</h2>
          
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-foreground text-background shadow-md"
                    : "text-muted hover:bg-muted/10 hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card border border-border rounded-2xl p-8 min-h-[500px]">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-medium mb-1">Profile Information</h3>
                <p className="text-sm text-muted">Update your account's profile information and email address.</p>
              </div>

              <div className="h-px bg-border w-full my-6" />

              <div className="flex items-center gap-6">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session?.user?.image || "https://ui-avatars.com/api/?name=" + (session?.user?.name || "User")}
                    alt="Profile Avatar"
                    className="w-24 h-24 rounded-full border-4 border-background shadow-sm"
                  />
                  <button className="absolute bottom-0 right-0 bg-foreground text-background p-1.5 rounded-full shadow-md hover:scale-105 transition-transform">
                    <User size={14} />
                  </button>
                </div>
                <div>
                  <h4 className="font-medium text-lg">{session?.user?.name || "User Name"}</h4>
                  <p className="text-sm text-muted mb-3">{session?.user?.email || "user@example.com"}</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                      Change Avatar
                    </button>
                    <button className="px-4 py-2 bg-transparent border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted/10 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">Display Name</label>
                  <input
                    type="text"
                    defaultValue={session?.user?.name || ""}
                    className="w-full md:max-w-md bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#836EF9]/50 focus:border-[#836EF9] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">Email Address</label>
                  <input
                    type="email"
                    defaultValue={session?.user?.email || ""}
                    className="w-full md:max-w-md bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#836EF9]/50 focus:border-[#836EF9] transition-all"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button className="px-6 py-2.5 bg-[#836EF9] text-white text-sm font-medium rounded-xl hover:bg-[#725cf6] transition-colors shadow-lg shadow-[#836EF9]/20">
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-medium mb-1">Notifications</h3>
                <p className="text-sm text-muted">Manage how you receive alerts and updates.</p>
              </div>
              
              <div className="h-px bg-border w-full my-6" />
              
              <div className="space-y-6">
                {[
                  { title: "Trade Executions", desc: "Get notified when a trade is executed by the agent." },
                  { title: "Risk Alerts", desc: "Receive alerts when risk parameters are triggered." },
                  { title: "Weekly Reports", desc: "A summary of your trading performance." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-sm text-muted mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#836EF9]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-medium mb-1">Security & API Keys</h3>
                <p className="text-sm text-muted">Manage your API keys for external integrations.</p>
              </div>
              
              <div className="h-px bg-border w-full my-6" />

              <div className="bg-background border border-border rounded-xl p-5 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={18} className="text-[#836EF9]" />
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                </div>
                <p className="text-sm text-muted mb-4">Add an extra layer of security to your account.</p>
                <button className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                  Enable 2FA
                </button>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-sm">Exchange API Keys</h4>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="API Key"
                      className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#836EF9]/50 focus:border-[#836EF9] transition-all"
                    />
                    <button className="px-6 py-2.5 bg-[#836EF9] text-white text-sm font-medium rounded-xl hover:bg-[#725cf6] transition-colors whitespace-nowrap">
                      Add Key
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === "appearance" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-medium mb-1">Appearance</h3>
                <p className="text-sm text-muted">Customize the look and feel of your dashboard.</p>
              </div>
              
              <div className="h-px bg-border w-full my-6" />

              <div className="space-y-4">
                 <p className="text-sm text-muted">Theme settings can be toggled using the sun/moon icon in the top navigation bar.</p>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </main>
  );
}
