import { useWaveSurferRecorder } from "@/app/hooks/useWaveSurferRecorder";
import React from "react";
import { CommandFormProps } from "./types";

export function useCommandForm({
  onSubmit,
  placeholder = "Describe what you want to build or record a voice note...",
}: CommandFormProps) {
  const [text, setText] = React.useState("");
  const hasText = text.trim().length > 0;

  // This ref will be attached to the visualizer div in the component
  const visualizerRef = React.useRef<HTMLDivElement>(null);

  // The recorder is fully self-contained within this component's logic
  const recorder = useWaveSurferRecorder({
    container: visualizerRef.current,
  });

  const handleSubmit = React.useCallback(() => {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    onSubmit?.(trimmedText);
    setText("");
  }, [text, onSubmit]);

  const tooltipMain = hasText
    ? "Send to assistant"
    : recorder.isRecording
    ? "Stop recording"
    : "Record a voice note";
  
  // A helper to handle stopping vs. destroying a recording
  const handleStopRecording = (save: boolean) => {
    if (save) {
      recorder.stop(); // This will trigger 'record-end' and save the URL
    } else {
      // To "destroy", we just stop without saving and reset state
      recorder.stop().then(() => {
         // Manually reset state if needed, though stop() already does most of this
      });
    }
  };

  return {
    text,
    setText,
    hasText,
    tooltipMain,
    handleSubmit,
    placeholder,
    visualizerRef, // Pass the ref object down
    recorder,      // Pass the whole recorder API down
    handleStopRecording,
  };
}