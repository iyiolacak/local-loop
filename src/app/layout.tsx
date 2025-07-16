import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VoiceRecorderProvider } from "./hooks/waveformRecorderContext";

export const metadata: Metadata = {
  title: "Locally Loop | Productivity at Localhost",
  description: "A local-first, frictionless, gamified productivity tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`antialiased font-sans`}>
        <VoiceRecorderProvider>
        <TooltipProvider>{children}</TooltipProvider>
        </VoiceRecorderProvider>
      </body>
    </html>
  );
}
