// src/components/command-input/useCommandForm.ts
import { useVoiceRecorder } from "@/app/hooks/useVoiceRecorder";
import { useCallback, useState } from "react";
import { CommandFormProps } from "./types";

export function useCommandForm({
  onSubmit,
  placeholder = "Describe what you want to build or record a voice note...",
}: CommandFormProps) {
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

  const tooltipMain = hasText
    ? "Send to assistant"
    : recorder.isRecording
    ? "Recording your voice..."
    : "Record a voice note";

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