"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useRef,
  FormEvent,
} from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useApiKey } from "@/app/store/useApiKey";
import { useSfx } from "@/lib/sfx";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ApiKeyForm from "./ApiKeyForm";
import Image from "next/image";

interface TranslationFn {
  (key: string, options?: Record<string, unknown>): string;
}
const useT = (): TranslationFn => (key) => key;

export interface ApiKeyPromptProps {
  forceOpen?: boolean;
  onClose?: () => void;
  disableAutoOpen?: boolean;
  hideDefaultChrome?: boolean;
}

export const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({
  forceOpen,
  onClose,
  disableAutoOpen,
  hideDefaultChrome,
}) => {
  const t = useT();
  const { play } = useSfx();
  const {
    apiKey,
    setApiKey,
    clearApiKey,
    hasApiKey,
    onboardingSkipped,
    setOnboardingSkipped,
  } = useApiKey();

  const [open, setOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open drawer
  useEffect(() => {
    if (forceOpen) setOpen(true);
    else if (!disableAutoOpen && !hasApiKey() && !onboardingSkipped)
      setOpen(true);
  }, [forceOpen, disableAutoOpen, hasApiKey, onboardingSkipped]);

  // Auto-focus input
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Delay-show pane

  const close = useCallback(
    (skip = false) => {
      if (skip) setOnboardingSkipped(true);
      setOpen(false);
      onClose?.();
      play("click");
    },
    [onClose, play, setOnboardingSkipped]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError(t("Please enter a valid API key."));
      return;
    }
    setApiKey(inputValue.trim());
    toast.success(t("API key saved!"));
    close();
  };

  if (!open) return null;

  // Video embed URL
  const embedUrl = "https://www.youtube.com/embed/bK5MQr6CXc8?autoplay=1";

  return (
    <Drawer open={open} onOpenChange={(v) => !v && close(true)}>
      <DrawerTitle className="text-center text-2xl font-semibold">
        {t("Enter your OpenAI API Key")}
      </DrawerTitle>
      <DrawerContent className="w-full h-screen p-3 m-0 bg-background overflow-hidden">
        <div className="flex h-full">
          {/* 
            Split pane UX: 
            The left pane (image/video) animates in after a delay to visually guide users on how to get an API key.
            The right pane contains the form for entering the API key.
          */}
          {/* IMAGE/VIDEO PANE */}
          <div
            className="hidden md:flex items-center group justify-center relative overflow-hidden cursor-pointer"
            onClick={() => setShowVideo(true)}
          >
            {(
              <>
                {!showVideo ? (
                  <>
                  <div className="min-w-full flex flex-1 h-5/6 relative rounded-3xl overflow-hidden">

                    <Image
                      src="/pictures/get_api_key.png"
                      alt="How to get an API key"
                      className="relative w-full blur-xs h-full rounded-3xl object-cover"
                      width={500}
                      height={500}
                      />
                    <div className="absolute inset-0 rounded-3xl w-full h-full bg-black/30 bg-opacity-40 flex items-center justify-center">
                      <p className="text-white group-hover:underline text-nowrap text-xl md:text-2xl font-medium">
                        See how to get an OpenAI API in 1 minute
                      </p>
                    </div>
                      </div>
                  </>
                ) : (
                  <iframe
                    src={embedUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-5/6 h-5/6"
                    title="tutorial video"
                  />
                )}
              </>
            )}
          </div>

          {/* FORM PANE */}
          <div
            className="flex flex-col flex-1 justify-center items-center p-8 overflow-auto"
          >
            <ApiKeyForm onSuccess={() => {}} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ApiKeyPrompt;
