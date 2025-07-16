import { cn } from "@/lib/utils";
import React from "react";
import { TooltipTrigger } from "../ui/tooltip";
import { Tooltip, TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip";
import { Button } from "../ui/button";
import { Microphone, Send, Trash } from "iconoir-react/solid";
import { AnimatedIconSwitcher } from "./AnimatedIconSwitcher";
import { Loader2 } from "lucide-react";
import { ArrowUp, Lock } from "iconoir-react/regular";

interface ActionButtonProps {
  hasText: boolean;
  tooltipMain: string;
  onSend: () => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | undefined>;
  destroyRecording: () => void;
  status: string;
  isRecording?: boolean;
  mmss?: string;
  onMouseEnter?: () => void;
  onTouchStart?: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  hasText,
  tooltipMain,
  onSend,
  startRecording,
  stopRecording,
  destroyRecording,
  status,
  isRecording = false,
  mmss,
  onMouseEnter,
  onTouchStart,
}) => {
  /* ---------------------------------------------------------------------
   * Click handler (single source of truth)
   * -------------------------------------------------------------------*/
  const handleClick = () => {
    if (isRecording) {
      // Stop → async save logic lives outside (parent decides what to do)
      stopRecording();
      return;
    }

    if (hasText) {
      onSend();
      return;
    }

    // Otherwise: start recording
    startRecording();
  };

  /* ---------------------------------------------------------------------
   * Styling
   * -------------------------------------------------------------------*/
  const mainButtonClass = cn(
    "absolute right-2 top-2 z-30 flex h-10 w-14 items-center justify-center rounded-md bg-product p-0 text-background text-xl shadow-lg transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-product/90 active:scale-90 group hover:w-20",
    {
      "bg-red-600": isRecording,
      "bg-product": !isRecording,
    }
  );

  /* ---------------------------------------------------------------------
   * Render
   * -------------------------------------------------------------------*/
  return (
    <TooltipProvider>
    <Tooltip delayDuration={120}>
      <TooltipTrigger asChild>
        {isRecording ? (
          <div className="absolute right-2 top-2 z-30 flex items-center gap-x-2">
            <Button
              className={mainButtonClass}
              onClick={handleClick}
              aria-label="Send recording"
            >
              <Send strokeWidth={2} />
            </Button>
            <Button
              type="button"
              onClick={destroyRecording}
              className="bg-red-600 hover:bg-red-700 active:scale-90 transition-all duration-150 ease-in-out"
              aria-label="Delete recording"
            >
              <Trash strokeWidth={2} />
            </Button>
            {/* Optional timer */}
            {mmss && (
              <span className="font-mono text-xs text-muted-foreground">
                {mmss}
              </span>
            )}
          </div>
        ) : (
          <Button
            type="button"
            onClick={handleClick}
            disabled={status === "loading"}
            aria-label={hasText ? "Send message" : "Record voice note"}
            className={mainButtonClass}
            onMouseEnter={onMouseEnter}
            onTouchStart={onTouchStart}
          >
            <AnimatedIconSwitcher
              show={hasText}
              libraryLoadingIcon={{
                isLoading: status === "loading",
                loadingSpinner: (
                  <span className="animate-spin">
                    <Loader2
                      strokeWidth={2}
                      width={24}
                      height={24}
                      className="animate-spin"
                    />
                  </span>
                ),
              }}
              enterIcon={
                <ArrowUp
                  width={36}
                  height={36}
                  className="size-5"
                  strokeWidth={3}
                />
              }
              exitIcon={
                <Microphone
                  width={36}
                  height={36}
                  className="size-5"
                  strokeWidth={2}
                />
              }
            />
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent
        side="right"
        align="end"
        className="max-w-[260px] rounded-lg px-4 py-3 text-sm leading-snug shadow-lg"
      >
        <p className="mb-1.5 flex items-center gap-x-1 font-medium text-md">
          <Lock strokeWidth={2} /> {tooltipMain}
        </p>
        <p className="text-xs font-medium text-muted-foreground">
          *Routed only to the OpenAI ChatGPT API you already use.
          <br /> Everything else stays on your device.
        </p>
      </TooltipContent>
    </Tooltip>
    </TooltipProvider>
  );
};