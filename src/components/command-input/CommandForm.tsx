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
    /** text */
    text,
    setText,
    hasText,
    placeholder,

    /** recorder */
    isRecording,
    progress,
    status,
    startRecording,
    stopRecording,
    destroyRecording,

    /** ui */
    tooltipMain,
    handleSubmit,
    waveSurferRef,
  } = useCommandForm(props);

  /** Format progress → mm:ss */
  const mmss = React.useMemo(() => {
    if (!isRecording) return "00:00";
    return new Date(progress).toISOString().substring(14, 19);
  }, [progress, isRecording]);

  return (
      <div className="relative flex w-full bg-background md:max-w-2xl">
        {/* Optional WaveSurfer visualisation */}
        {isRecording && (
          <div
            ref={waveSurferRef as React.RefObject<HTMLDivElement>}
            className="absolute left-2 top-2 h-10 w-10 rounded-md border bg-red-600/40"
          />
        )}

        {/* Textarea */}
        <CommandTextarea
          value={text}
          isRecording={isRecording}
          onChange={(e) => setText(e.target.value)}
          onSubmit={handleSubmit}
          placeholder={isRecording ? "" : placeholder}
          className="relative z-10 pr-20 dark:pr-20"
        />

        {/* Primary Action */}
        <ActionButton
          hasText={hasText}
          tooltipMain={tooltipMain}
          onSend={handleSubmit}
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          destroyRecording={destroyRecording}
          status={status as string}
          mmss={mmss}
          onMouseEnter={preloadWaveSurfer}
          onTouchStart={preloadWaveSurfer}
        />
      </div>
  );
};
