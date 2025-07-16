"use client";
import { CommandForm } from "@/components/command-input/CommandForm";
import ProdAtLocalhostLogo from "@/components/Logo";
import Footer from "./Footer";
import Header from "./Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ---------- Header ---------- */}
      <Header />
      {/* ---------- Main ---------- */}
      <main className="flex-1 h-screen p-6 overflow-y-auto">{children}</main>

      {/* ---------- Footer ---------- */}
      <Footer />
    </div>
  );
}
