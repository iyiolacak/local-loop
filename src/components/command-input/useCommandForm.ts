import { useVoiceRecorder } from "@/app/hooks/useVoiceRecorder";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { CommandFormProps } from "./types";

export function useCommandForm({
  onSubmit,
  placeholder: defaultPlaceholder,
}: CommandFormProps) {
  const t = useTranslations('CommandForm');
  const [text, setText] = useState("");
  const hasText = text.trim().length > 0;

  const recorder = useVoiceRecorder({
    onStop: (audioBlob) => {
      // In a real application, you would send this blob to a speech-to-text API.
      // For now, we'll log it and create a playable URL for debugging.
      console.log("Recording stopped, blob created:", audioBlob);
      const url = URL.createObjectURL(audioBlob);
      console.log("Playable URL (can be opened in a new tab):", url);
    },
  });

  const handleSubmit = useCallback(() => {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    onSubmit?.(trimmedText);
    setText("");
  }, [text, onSubmit]);

  const placeholder = defaultPlaceholder || t('placeholder');

  const tooltipMain = hasText
    ? t('tooltipSend')
    : recorder.isRecording
    ? t('tooltipRecording')
    : t('tooltipRecord');

  return {
    text,
    setText,
    hasText,
    tooltipMain,
    handleSubmit,
    placeholder,
    recorder,
  };
}