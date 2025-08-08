// src/components/command-input/ActionButton.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Microphone, Send } from "iconoir-react/solid";
import { ArrowUp, Lock, Trash } from "iconoir-react/regular";
import { AnimatePresence, motion } from "framer-motion";
import { useHoverClickSounds } from "@/lib/sfx";
import { useTranslations } from "next-intl";

export interface ActionButtonProps {
  isRecording: boolean;
  isBusy: boolean;
  canSubmit: boolean;

  onRecord: () => void;
  onStop: () => void;    // stop & save (transcribe)
  onCancel: () => void;  // cancel recording
  onSubmit: () => void;

  tooltipMain?: string;
  volume?: number;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  isRecording,
  isBusy,
  canSubmit,
  onRecord,
  onStop,
  onCancel,
  onSubmit,
  tooltipMain,
  volume = 0,
  className,
}) => {
  const sfx = useHoverClickSounds();

  // Resolve current visual mode
  const mode: "busy" | "stop" | "submit" | "record" = isBusy
    ? "busy"
    : isRecording
    ? "stop"
    : canSubmit
    ? "submit"
    : "record";

    const t = useTranslations("CommandForm");

    {/*
          "tooltipSend": "Send privately to model*",
    "tooltipRecording": "Recording... saved locally*",
    "tooltipRecord": "Record a private voice note*",
    "listening": "Listening..."

      */}
    tooltipMain = tooltipMain || (mode === "busy"
      ? t("tooltipBusy")
      : mode === "stop"
      ? t("tooltipRecording")
      : mode === "submit"
      ? t("tooltipSend")
      : t("tooltipRecord")
    )
  const handlePrimaryAction = () => {
    if (isBusy) return;
    sfx.onClick();
    if (mode === "record") onRecord();
    else if (mode === "stop") onStop();
    else if (mode === "submit") onSubmit();
  };

  // Choose icon by mode
  const PrimaryIcon =
    mode === "busy" ? null : mode === "stop" ? Send : mode === "submit" ? ArrowUp : Microphone;

  const primaryIconKey =
    mode === "busy" ? "busy" : mode === "stop" ? "stop" : mode === "submit" ? "send" : "mic";

  return (
    <div className={cn("absolute right-2 top-2 z-30 flex h-10 items-center justify-end gap-x-2", className)}>
      {/* Cancel (only during recording) */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            layout
            initial={{ opacity: 0, x: 30, scale: 0.7 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.7 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <Tooltip delayDuration={150}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    sfx.onClick();
                    onCancel();
                  }}
                  className="h-10 w-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Cancel recording"
                >
                  <Trash strokeWidth={2} className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Cancel Recording</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary button */}
      <motion.div layout transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}>
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <motion.button
              onClick={handlePrimaryAction}
              onMouseEnter={sfx.onMouseEnter}
              disabled={isBusy}
              aria-label={tooltipMain}
              className={cn(
                "group relative flex h-10 items-center justify-center rounded-lg bg-product p-0 text-xl text-background shadow-lg",
                "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "hover:bg-product/90 active:scale-95"
              )}
              animate={{ width: !isRecording && canSubmit ? "5rem" : "3.5rem" }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Pulsing glow while recording */}
              <AnimatePresence>
                {isRecording && (
                  <motion.span
                    className="absolute inset-0 z-0 rounded-lg bg-white/30"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: 1 + volume * 1.5, opacity: 1 }}
                    exit={{ scale: 1, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  />
                )}
              </AnimatePresence>

              {/* Spinner when busy, otherwise icon with switch animation */}
              <div className="relative z-10 flex h-6 w-6 items-center justify-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {mode === "busy" ? (
                    <motion.svg
                      key="spinner"
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25" />
                      <path
                        d="M22 12a10 10 0 0 1-10 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  ) : (
                    <motion.div
                      key={primaryIconKey}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {PrimaryIcon && <PrimaryIcon strokeWidth={2.5} className="h-5 w-5" />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          </TooltipTrigger>

          <TooltipContent
            side="top"
            align="center"
            className="max-w-[260px] px-4 py-3 bg-[#f7fff7] text-sm font-medium"
          >
            <p className="flex mb-1.5 items-center gap-x-0.5 text-md font-medium">
              <Lock strokeWidth={2} /> {tooltipMain}
            </p>
            <p className="text-xs text-muted-foreground">
              *Processed by your chosen model.<br />All else stays in-browser.
            </p>
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </div>
  );
};
