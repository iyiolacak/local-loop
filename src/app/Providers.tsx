"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SfxProvider } from "@/lib/sfx";
import ApiKeyPrompt from "@/components/ApiKeyPrompt";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SfxProvider>
      <TooltipProvider>
        {children}
        <ApiKeyPrompt />
      </TooltipProvider>
    </SfxProvider>
  );
}
