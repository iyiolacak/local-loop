import { useWaveSurferRecorder } from "@/app/hooks/waveformRecorderContext";
import React from "react";
import { CommandFormProps } from "./types";

/**
 * Logic hook – keeps all stateful + imperative logic outside of the UI tree so
 * that the render layer stays declarative and easy to unit‑test.
 */
export function useCommandForm({
  onSubmit,
  placeholder = "Animate the cats in GSAP",
  containerRef,
}: CommandFormProps) {
  /* -----------------------------------------------------------------------
   * Text state
   * ---------------------------------------------------------------------*/
  const [text, setText] = React.useState("");
  const trimmed = text.trim();
  const hasText = trimmed.length > 0;

  /* -----------------------------------------------------------------------
   * Recorder – WaveSurfer wrapper
   * ---------------------------------------------------------------------*/
  const {
    isRecording,
    start: startRecording,
    stop: stopRecording,
    destroy: destroyRecording,
    progress,
    status,
    waveSurferRef,
  } = useWaveSurferRecorder({
    container: containerRef?.current ?? undefined,
    scrollingWaveform: true,
    continuousWaveform: true,
  });

  /* -----------------------------------------------------------------------
   * Submit handler (memoised)
   * ---------------------------------------------------------------------*/
  const handleSubmit = React.useCallback(() => {
    if (!hasText) return;
    onSubmit?.(trimmed);
    setText("");
  }, [hasText, trimmed, onSubmit]);

  /* -----------------------------------------------------------------------
   * UI helpers
   * ---------------------------------------------------------------------*/
  const tooltipMain = hasText
    ? "Send privately*"
    : isRecording
    ? "Stop recording"
    : "Record privately*";

  return {
    text,
    setText,
    hasText,
    tooltipMain,
    handleSubmit,
    placeholder,

    /* recorder api */
    isRecording,
    progress,
    status,
    startRecording,
    stopRecording,
    destroyRecording,
    waveSurferRef,
  } as const;
}