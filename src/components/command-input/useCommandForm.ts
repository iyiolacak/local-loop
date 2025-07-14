import { useWaveSurferRecorder } from "@/app/hooks/useWaveformRecorder";
import React from "react";
import { CommandFormProps } from "./types";
/**
 * Logic hook – keeps all stateful + imperative logic outside of the UI tree so
 * that the render layer stays declarative and easy to unit–test. By returning
 * a stable API we can later expose things like a slash–command menu, emoji
 * picker, or streaming feedback without touching the presentational code.
 */
export function useCommandForm({
  onSubmit,
  placeholder = "Animate the cats in GSAP",
  containerRef,
}: CommandFormProps) {
  const [text, setText] = React.useState("");

  const trimmed = React.useMemo(() => text.trim(), [text]);
  const hasText = trimmed.length > 0;

  // ---- event handlers ------------------------------------------------------
  const tooltipMain = hasText ? "Send privately*" : "Record privately*";

  // WaveSurfer integration
    const recorder = useWaveSurferRecorder({
      container: containerRef.current as HTMLElement,
      scrollingWaveform: true,
      continuousWaveform: true,
    });
  return {
    text,
    setText,
    hasText,
    tooltipMain,
    handleSubmit,
    placeholder,

    // WaveSurfer API
    ...recorder
  };
}
