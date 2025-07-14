import { cn } from "@/lib/utils";
import React from "react";
import { TooltipTrigger } from "../ui/tooltip";
import { Tooltip, TooltipContent } from "@radix-ui/react-tooltip";
import { Button } from "../ui/button";
import { Microphone, Send, Trash } from "iconoir-react/solid";
import { AnimatedIconSwitcher } from "./AnimatedIconSwitcher";
import { Loader2 } from "lucide-react";
import { ArrowUp, Lock } from "iconoir-react/regular";

/**
 * Internal: Single–responsibility component encapsulating the tooltip + button
 * so we can compose different buttons (e.g. GIF, file‑upload) without making
 * the parent component aware of their implementation details.
 */
interface ActionButtonProps {
  startRecording: (deviceId?: string) => Promise<void>;
  stopRecording: () => Promise<Blob | undefined>;
  destroyRecording: () => void;
  status: string;
  mmss: string;
  url?: string;
  hasText: boolean;
  tooltipMain: string;
  onClick: () => void;
  isRecording?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  hasText,
  tooltipMain,
  onClick,

  isRecording = false,
  startRecording,
  stopRecording,
  destroyRecording,
  status,
  mmss,
  url,
}) => {
  const onClickHandler = () => {
    const typingMode = !hasText;

    if (typingMode) {
      onClick();
    } else if (isRecording) {
      stopRecording().then((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          // Handle the URL (e.g., download, playback)
          console.log("Recording saved:", url);
        }
      });
    } else {
      startRecording();
    }
  };

  const mainButtonClass = cn(
    `"
          absolute right-2 top-2 z-30 flex h-10 w-14 items-center justify-center
          rounded-md bg-product p-0 text-background text-xl
          shadow-lg hover:bg-product/90 active:scale-90
          transition-all duration-150 ease-in-out
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2
          group hover:w-20
        "`,
    {
      "bg-red-600": isRecording,
      "bg-product": !isRecording,
    }
  );

  return (
    <Tooltip delayDuration={120}>
      <TooltipTrigger asChild>
        {isRecording ? (
          <div className="flex gap-x-2 items-center absolute right-2 top-2 z-30">
            <Button className={mainButtonClass} onClick={onClickHandler}>
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
          </div>
        ) : (
          <Button
            type="button"
            onClick={onClickHandler}
            disabled={status === "loading"}
            aria-label={hasText ? "Send message" : "Record voice note"}
            className={mainButtonClass}
          >
            <AnimatedIconSwitcher
              show={hasText}
              libraryLoadingIcon={{
                isLoading: status === "loading",
                loadingSpinner: (
                  <span className="animate-spin">
                    <Loader2 strokeWidth={2} width={24} height={24} className="animate-spin"/>
                  </span>
                ),
              }}
              enterIcon={
                <ArrowUp
                  width={36}
                  height={36}
                  className="transition-all size-5"
                  strokeWidth={3}
                />
              }
              exitIcon={
                isRecording ? (
                  <Button>
                    <Send strokeWidth={2} />
                  </Button>
                ) : (
                  <Microphone
                    width={36}
                    height={36}
                    className="transition-all size-5"
                    strokeWidth={2}
                  />
                )
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
        <p className="font-medium text-md flex text-end items-end mb-1.5">
          <Lock strokeWidth={2} />
          {tooltipMain}
        </p>
        <p className="text-xs text-muted-foreground font-medium">
          *Routed only to the OpenAI ChatGPT API you already use.
          <br />
          Otherwise, everything stays on your device.
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
