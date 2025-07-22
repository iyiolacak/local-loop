import React from "react";
import { CommandTextarea } from "./CommandInput";
import { TooltipProvider } from "../ui/tooltip";
import { ActionButton } from "./ActionButton";
import { useCommandForm } from "./useCommandForm";
import type { CommandFormProps } from "./types";
import { useTranslations } from "next-intl";

/**
 * Presentational component – Zero business logic. Swappable, theme‑able.
 */
export const CommandForm: React.FC<CommandFormProps> = (props) => {
  const t = useTranslations('CommandForm');
  const {
    text,
    setText,
    hasText,
    placeholder,
    tooltipMain,
    handleSubmit,
    recorder,
  } = useCommandForm(props);

  return (
    <TooltipProvider>
      <div className="relative flex w-full bg-background md:max-w-2xl">
        {/* Textarea */}
        <CommandTextarea
          value={text}
          isRecording={recorder.isRecording}
          onChange={(e) => setText(e.target.value)}
          onSubmit={handleSubmit}
          placeholder={recorder.isRecording ? t('listening') : placeholder}
          // Pad right to accommodate the widest state of the action button (w-28 = 7rem)
          className="relative z-10 dark:max-h-30 !max-h-40 pr-[7.5rem] dark:pr-[7.5rem]"        />

        {/* Primary Action Button */}
        <ActionButton
          hasText={hasText}
          tooltipMain={tooltipMain}
          onSend={handleSubmit}
          isRecording={recorder.isRecording}
          startRecording={recorder.start}
          stopRecording={recorder.stop}
          status={recorder.status}
          volume={recorder.volume}
        />
      </div>
    </TooltipProvider>
  );
};