"use client";

import React from "react";
import { CommandTextarea } from "./CommandInput";
import { TooltipProvider } from "../ui/tooltip";
import { ActionButton } from "./ActionButton";
import { CommandFormProps } from "./types";
import { preloadWaveSurfer } from "./lazyWavesurfer";
import { useCommandForm } from "./useCommandForm";

/**
 * Presentational component – Zero business logic. Swappable, theme‑able.
 */
export const CommandForm: React.FC<CommandFormProps> = (props) => {
  const {
    text,
    setText,
    hasText,
    placeholder,
    tooltipMain,
    handleSubmit,
    visualizerRef,
    recorder,
    handleStopRecording,
  } = useCommandForm(props);

  const mmss = React.useMemo(() => {
    if (!recorder.isRecording) return null;
    return new Date(recorder.progress).toISOString().substring(14, 19);
  }, [recorder.progress, recorder.isRecording]);

  return (
    <div className="relative flex w-full bg-background md:max-w-2xl">
      {/* 
        The visualizer div. The ref is attached here.
        It's always in the DOM, making the ref stable.
        We use CSS to show/hide it.
      */}
      <div
        ref={visualizerRef}
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
        style={{ opacity: recorder.isRecording ? 1 : 0 }}
      />

      {/* Textarea */}
      <CommandTextarea
        value={text}
        isRecording={recorder.isRecording}
        onChange={(e) => setText(e.target.value)}
        onSubmit={handleSubmit}
        placeholder={recorder.isRecording ? "" : placeholder}
        className="relative z-10 dark:max-h-30 pr-20 dark:pr-20"
      />

      {/* Primary Action */}
      <ActionButton
        hasText={hasText}
        tooltipMain={tooltipMain}
        onSend={handleSubmit}
        isRecording={recorder.isRecording}
        startRecording={recorder.start}
        stopRecording={() => handleStopRecording(true)} // Stop and save
        destroyRecording={() => handleStopRecording(false)} // Stop and discard
        status={typeof recorder.status === "string" ? recorder.status : "error"}
        mmss={mmss || ""}
        onMouseEnter={preloadWaveSurfer}
        onTouchStart={preloadWaveSurfer}
      />
    </div>
  );
};
