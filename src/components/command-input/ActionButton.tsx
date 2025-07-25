// src/components/command-input/ActionButton.tsx
import { cn } from "@/lib/utils";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Microphone, Send } from "iconoir-react/solid";
import { ArrowUp, Lock, Trash } from "iconoir-react/regular";
import { AnimatePresence, motion } from "framer-motion";
// Import your SFX hooks
import { useHoverClickSounds } from "@/lib/sfx";

interface ActionButtonProps {
  hasText: boolean;
  tooltipMain: string;
  onSend: () => void;
  startRecording: () => void;
  stopRecording: (save: boolean) => void;
  status: "idle" | "recording" | "error";
  isRecording: boolean;
  volume: number;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  hasText,
  tooltipMain,
  onSend,
  startRecording,
  stopRecording,
  status,
  isRecording,
  volume,
}) => {
  // Determine which icon to show in the primary button and a stable key for animation
  const PrimaryIcon = isRecording ? Send : hasText ? ArrowUp : Microphone;
  const primaryIconKey = isRecording ? "stop" : hasText ? "send" : "mic";

  // Initialize the hover and click sound hooks
  const sfx = useHoverClickSounds();

  const handlePrimaryAction = () => {
    if (isRecording) {
      // For stopping recording, we want a 'click' sound, not necessarily tied to a specific Radix state change.
      // We can trigger it here directly or rely on the underlying component's click handler.
      // For this custom button, we'll trigger it explicitly.
      sfx.onClick(); // Play click sound
      stopRecording(true); // Stop and Save
    } else if (hasText) {
      sfx.onClick(); // Play click sound
      onSend();
    } else {
      sfx.switch(); // Play click sound
      startRecording();
    }
  };

  return (
    <div className="absolute right-2 top-2 z-30 flex h-10 items-center justify-end gap-x-2">
      {/* Cancel Button: Appears on the left during recording */}
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
                {/* This Button component should already have SFX integrated */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => stopRecording(false)}
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

      {/* Primary Button: Always visible, morphs based on state */}
      <motion.div
        layout
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <motion.button
              onClick={handlePrimaryAction}
              onMouseEnter={sfx.onMouseEnter} // Add hover sound
              // We've moved the sfx.onClick() call into handlePrimaryAction
              disabled={status !== "idle" && !isRecording}
              aria-label={tooltipMain}
              className={cn(
                "group relative cursor-pointer flex h-10 items-center justify-center rounded-lg bg-product p-0 text-xl text-background shadow-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-product/90 active:scale-95"
              )}
              animate={{ width: hasText && !isRecording ? "5rem" : "3.5rem" }} // 80px or 56px
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Pulsing glow effect */}
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

              {/* Icon switcher with smooth vertical cross-fade */}
              <div className="relative z-10 flex h-6 w-6 items-center justify-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={primaryIconKey}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <PrimaryIcon strokeWidth={2.5} className="h-5 w-5" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className="max-w-[260px] px-4 py-3 text-sm font-medium"
          >
            <p className="flex mb-1.5 items-center gap-x-0.5 text-md font-medium">
              <Lock strokeWidth={2} /> {tooltipMain}
            </p>
            <p className="text-xs text-muted-foreground">
              *Processed by your chosen model.<br/>All else stays in-browser.{" "}
            </p>
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </div>
  );
};