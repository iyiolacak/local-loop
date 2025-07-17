import { cn } from "@/lib/utils";
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  const handleClick = () => {
    if (isRecording) {
      // This is the "Stop & Save" action
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

  const mainButtonClass = cn(
    "absolute right-2 top-2 z-30 flex h-10 w-14 items-center justify-center rounded-md bg-product p-0 text-background text-xl shadow-lg transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-product/90 active:scale-90 group hover:w-20"
  );

  return (
    <TooltipProvider>
      {isRecording ? (
        // -- Polished UI to match the reference image --
        <div className="absolute right-3 top-2 z-30 flex h-10 items-center justify-end gap-x-3">
          
          {/* Timer */}
          {mmss && (
            <span className="font-mono text-base font-medium text-red-500 tabular-nums">
              {mmss}
            </span>
          )}

          {/* Cancel (Trash) Button - styled to be subtle */}
          <Tooltip delayDuration={120}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={destroyRecording}
                aria-label="Cancel recording"
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <Trash strokeWidth={2} className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Cancel Recording</p></TooltipContent>
          </Tooltip>

          {/* Stop & Save (Send) Button */}
          <Tooltip delayDuration={120}>
            <TooltipTrigger asChild>
              <Button
                className="h-10 w-12 rounded-lg bg-product text-background shadow-lg transition-transform active:scale-90 hover:bg-product/90"
                onClick={handleClick} // Calls stopRecording
                aria-label="Stop and save recording"
              >
                <Send strokeWidth={2.5} className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Stop & Save</p></TooltipContent>
          </Tooltip>
        </div>
      ) : (
        // -- Default Idle UI (unchanged logic, minor style consistency) --
        <Tooltip delayDuration={120}>
          <TooltipTrigger asChild>
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
                      <Loader2 strokeWidth={2} width={24} height={24} />
                    </span>
                  ),
                }}
                enterIcon={<ArrowUp className="size-5" strokeWidth={3} />}
                exitIcon={<Microphone className="size-5" strokeWidth={2} />}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className="max-w-[260px] rounded-lg px-4 py-3 text-sm font-medium text-gray-100 bg-background shadow-lg"
          >
            <p className="mb-1.5 flex items-center gap-x-1.5 font-semibold">
              <Lock strokeWidth={2} /> {tooltipMain}
            </p>
            <p className="text-xs text-muted-foreground">
              *Routed only to the OpenAI ChatGPT API you already use. Everything
              else stays on your device.
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </TooltipProvider>
  );
};