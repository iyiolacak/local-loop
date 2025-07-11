"use client";
import { CommandTextarea } from "@/components/command-input/CommandInput";
import ProdAtLocalhostLogo from "@/components/Logo";
import { Input } from "@/components/ui/input";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        Switch from CSS Grid to a flexbox column layout.
        This prevents row-height mis-calculations that were clipping content and
        guarantees the main area stretches to fill the remaining viewport height.
      */}
      <body className="min-h-screen flex flex-col">
        {/* ---------- Header ---------- */}
        <header className="flex-none border-b">
          <div className="h-full px-8 mx-auto max-w-full flex items-center justify-between">
            {/* Logo – keeps intrinsic width */}
            <div className="flex-shrink-0">
              <ProdAtLocalhostLogo />
            </div>

            {/* Command bar – grows, stays centred, never shrinks below its content */}
            <div className="flex-1 h-full flex py-4 items-center justify-center">
              <div className="max-h-full w-1/2">
                <CommandTextarea
                // autoResize={false}
                  autoCorrect="off"

                  placeholder="Animate the cats in GSAP"
                />
              </div>
            </div>
          </div>
        </header>

        {/* ---------- Main ---------- */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

        {/* ---------- Footer ---------- */}
        <footer className="flex-none h-[40px] flex items-center justify-center border-t text-sm">
          © 2025
        </footer>
      </body>
    </html>
  );
}
