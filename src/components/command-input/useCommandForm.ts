import { useWaveSurferRecorder } from "@/app/hooks/useWaveSurferRecorder";
import React, { useCallback, useEffect, useState } from "react";
import { CommandFormProps } from "./types";
import { preloadWaveSurfer } from "./lazyWavesurfer";

export function useCommandForm({
  onSubmit,
  placeholder = "Describe what you want to build or record a voice note...",
}: CommandFormProps) {
  const [text, setText] = useState("");
  const hasText = text.trim().length > 0;

  // --- START OF FIX ---
  // 1. Create state to hold the DOM node for the visualizer.
  const [visualizerContainer, setVisualizerContainer] = useState<HTMLDivElement | null>(null);

  // 2. Create a "callback ref". React calls this function with the DOM node
  //    when the ref is attached. We then save that node to our state.
  const visualizerRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setVisualizerContainer(node);
    }
  }, []); // Empty array ensures this callback is stable.

  // 3. Pass the stateful container to the recorder hook.
  //    This hook will now re-run when visualizerContainer changes from null to a real element.
  const recorder = useWaveSurferRecorder({
    container: visualizerContainer,
  });
  // --- END OF FIX ---

  useEffect(() => {
    preloadWaveSurfer();
  }, []);

  const handleSubmit = useCallback(() => {
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

  const handleStopRecording = (save: boolean) => {
    if (save) {
      recorder.stop();
    } else {
      recorder.destroy();
    }
  };

  return {
    text,
    setText,
    hasText,
    tooltipMain,
    handleSubmit,
    placeholder,
    visualizerRef, // We still pass the ref down to the component
    recorder,
    handleStopRecording,
  };
}