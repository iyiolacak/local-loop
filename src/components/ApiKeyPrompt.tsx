"use client";

import React, { useEffect, useState, useCallback, ReactNode } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useApiKey } from "@/app/store/useApiKey";
import { useSfx } from "@/lib/sfx";
import { toast } from "sonner";

// Placeholder translation hook
interface TranslationFn {
  (key: string, options?: Record<string, unknown>): string;
}
const useT = (): TranslationFn => (key) => key;

export interface ApiKeyPromptProps {
  forceOpen?: boolean;
  children?: (injected: InjectedApiKeyPromptProps) => ReactNode;
  onClose?: () => void;
  disableAutoOpen?: boolean;
  hideDefaultChrome?: boolean;
  /** Optional YouTube URL to embed in the illustration pane */
  videoUrl?: string;
}

export interface InjectedApiKeyPromptProps {
  apiKey: string | null;
  setApiKey: (k: string) => void;
  clearApiKey: () => void;
  onboardingSkipped: boolean;
  setOnboardingSkipped: (v: boolean) => void;
  close: (opts?: { markSkipped?: boolean }) => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({
  forceOpen,
  children,
  onClose,
  disableAutoOpen,
  hideDefaultChrome,
  videoUrl,
}) => {
  const t = useT();
  const { play } = useSfx();
  const {
    apiKey,
    setApiKey,
    onboardingSkipped,
    setOnboardingSkipped,
    clearApiKey,
    hasApiKey,
  } = useApiKey();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
    } else if (!disableAutoOpen && !hasApiKey() && !onboardingSkipped) {
      setOpen(true);
    }
  }, [forceOpen, disableAutoOpen, hasApiKey, onboardingSkipped]);

  const handleInternalClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const injected: InjectedApiKeyPromptProps = {
    apiKey,
    setApiKey: (k: string) => {
      setApiKey(k.trim());
      toast.success(t("apiKey.saved"));
    },
    clearApiKey: () => {
      clearApiKey();
      toast.info(t("apiKey.cleared"));
    },
    onboardingSkipped,
    setOnboardingSkipped,
    close: ({ markSkipped } = {}) => {
      if (markSkipped) setOnboardingSkipped(true);
      handleInternalClose();
      play("click");
    },
  };

  if (!open) return null;

  // Determine YouTube embed source
  let embedSrc = videoUrl ?? "https://www.youtube.com/watch?t=22&v=bK5MQr6CXc8";
  try {
    const urlObj = new URL(embedSrc);
    const vid = urlObj.searchParams.get("v");
    if (vid) embedSrc = `https://www.youtube.com/embed/${vid}`;
  } catch {
    // leave embedSrc as-is if parsing fails
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        if (!v) handleInternalClose();
      }}
    >
      <DrawerContent className="p-0 m-0 border-none w-full h-[100dvh] max-w-none bg-background overflow-hidden">
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 flex flex-col overflow-auto">
            {children ? (
              children(injected)
            ) : (
              <div className="flex flex-1 flex-col md:flex-row w-full h-full">
                <div className="hidden md:flex min-w-1/2 h-full items-center justify-center relative">
                  {/* Plain iframe YouTube embed */}
                  <iframe
                    src={embedSrc}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute w-5/6 h-5/6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md"
                    title="YouTube video"
                  />
                </div>
                <div className="flex w-full pt-12 pl-4">
                  <div className="text-start">
                    <h1 className="text-2xl md:text-4xl font-bold text-foreground">
                      Connect your API key to use privately
                    </h1>
                    <p className="text-muted-foreground mt-2 md:text-lg">
                      Locally Loop runs entirely in your browser — no accounts,
                      no servers, no tracking.<br/> For privacy peace of mind, you can
                      connect your own AI key.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {!hideDefaultChrome && (
            <div className="w-full p-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => injected.close({ markSkipped: true })}
              >
                {t("actions.skip")}
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ApiKeyPrompt;
