"use client";

import React from "react";
import { CommandTextarea } from "./CommandInput";
import { Button } from "../ui/button";
import { ArrowUp, Lock } from "iconoir-react/regular";
import { Microphone } from "iconoir-react/solid";
import { AnimatedIconSwitcher } from "./AnimatedIconSwitcher";

/* shadcn/ui tooltip */
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";

/**
 * Public API ----------------------------------------------------------------
 */
export interface CommandFormProps {
  /** Callback fired when the user sends text */
  onSubmit: (value: string) => void;
  /** Optional callback fired when voice input is requested */
  onVoice?: () => void;
  /** Placeholder for the textarea  */
  placeholder?: string;
}

/**
 * Logic hook – keeps all stateful + imperative logic outside of the UI tree so
 * that the render layer stays declarative and easy to unit–test. By returning
 * a stable API we can later expose things like a slash–command menu, emoji
 * picker, or streaming feedback without touching the presentational code.
 */
export function useCommandForm({
  onSubmit,
  onVoice,
  placeholder = "Animate the cats in GSAP",
}: CommandFormProps) {
  const [text, setText] = React.useState("");

  const trimmed = React.useMemo(() => text.trim(), [text]);
  const hasText = trimmed.length > 0;

  // ---- event handlers ------------------------------------------------------
  const handleSubmit = React.useCallback(
    (payload?: string) => {
      const value = (payload ?? text).trim();
      if (!value) return;
      onSubmit(value);
      setText("");
    },
    [text, onSubmit]
  );

  const handleVoiceOrSubmit = React.useCallback(() => {
    if (hasText) {
      handleSubmit();
    } else {
      onVoice?.();
    }
  }, [hasText, handleSubmit, onVoice]);

  const tooltipMain = hasText ? "Send privately*" : "Record privately*";

  return {
    text,
    setText,
    hasText,
    tooltipMain,
    handleSubmit,
    handleVoiceOrSubmit,
    placeholder,
  };
}

/**
 * Presentational component – Zero business logic. Swappable, themeable.
 */
export const CommandForm: React.FC<CommandFormProps> = (props) => {
  const {
    text,
    setText,
    hasText,
    tooltipMain,
    handleSubmit,
    handleVoiceOrSubmit,
    placeholder,
  } = useCommandForm(props);

  type VoiceRecordingPermission =
    | "denied"
    | "granted"
    | "prompting"
    | "error"
    | "shouldAskSometime";
  type VoiceRecording = {
    permissionRequest: VoiceRecordingPermission;
    recording: boolean;
  };

  const [voiceRecording, setVoiceRecording] = React.useState<VoiceRecording>({
    permissionRequest: "shouldAskSometime",
    recording: false,
  });

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative flex w-full max-w-2xl">
        {/* Text input ------------------------------------------------------- */}
        {voiceRecording.permissionRequest != "prompting" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <span className="text-sm text-muted-foreground">
              Requesting microphone access...
            </span>
          </div>
        )
          }
        <CommandTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onSubmit={handleSubmit}
          placeholder={placeholder}
          className="dark:pr-20"
        />

        {/* Action button ---------------------------------------------------- */}
        <ActionButton
          hasText={hasText}
          tooltipMain={tooltipMain}
          onClick={handleVoiceOrSubmit}
        />
      </div>
    </TooltipProvider>
  );
};

/**
 * Internal: Single–responsibility component encapsulating the tooltip + button
 * so we can compose different buttons (e.g. GIF, file‑upload) without making
 * the parent component aware of their implementation details.
 */
interface ActionButtonProps {
  hasText: boolean;
  tooltipMain: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  hasText,
  tooltipMain,
  onClick,
}) => (
  <Tooltip delayDuration={120}>
    <TooltipTrigger asChild>
      <Button
        type="button"
        onClick={onClick}
        aria-label={hasText ? "Send message" : "Record voice note"}
        className="
          absolute right-2 top-2 flex h-10 w-14 items-center justify-center
          rounded-md bg-product p-0 text-background text-xl
          shadow-lg hover:bg-product/90 active:scale-90
          transition-all duration-150 ease-in-out
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2
          group hover:w-20
        "
      >
        <AnimatedIconSwitcher
          show={hasText}
          enterIcon={
            <ArrowUp
              width={36}
              height={36}
              className="transition-all size-5"
              strokeWidth={3}
            />
          }
          exitIcon={
            <Microphone
              width={36}
              height={36}
              className="transition-all size-5"
              strokeWidth={2}
            />
          }
        />
      </Button>
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
        * Routed only to the OpenAI ChatGPT API you already use.
        <br />
        Otherwise, everything stays on your device.
      </p>
    </TooltipContent>
  </Tooltip>
);
