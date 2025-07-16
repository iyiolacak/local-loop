// contexts/VoiceRecorderContext.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useWaveSurferRecorder, RecorderApi } from "@/app/"
/* -------------------------------------------------------------------------- */
/* Context Types                                                              */
/* -------------------------------------------------------------------------- */
type RecorderState = Pick<
  RecorderApi,
  "status" | "isRecording" | "isPaused" | "progress" | "url"
>;
interface RecorderActions
  extends Pick<
    RecorderApi,
    "start" | "stop" | "pause" | "resume" | "destroy"
  > {
  /** hand WaveSurfer the element it should draw into */
  registerContainer: (el: HTMLElement | null) => void;
}

const StateCtx  = createContext<RecorderState | null>(null);
const ActionCtx = createContext<RecorderActions | null>(null);

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */
export function VoiceRecorderProvider({
  children,
  waveColor             = "rgb(200,0,200)",
  progressColor         = "rgb(100,0,100)",
  scrollingWaveform     = false,
  continuousWaveform    = true,
  continuousWaveformDuration = 30,
}: {
  children: ReactNode;
  waveColor?: string;
  progressColor?: string;
  scrollingWaveform?: boolean;
  continuousWaveform?: boolean;
  continuousWaveformDuration?: number;
}) {
  /* container is provided later by any consumer */
  const [container, setContainer] = useState<HTMLElement | string | null>(null);

  /* instantiate the hook once—container can change later                  */
  const recorder = useWaveSurferRecorder({
    container: container ?? "__placeholder__", // updated via registerContainer
    waveColor,
    progressColor,
    scrollingWaveform,
    continuousWaveform,
    continuousWaveformDuration,
  });

  /* memoised selectors to avoid needless re‑renders                       */
  const state = useMemo<RecorderState>(
    () => ({
      status      : recorder.status,
      isRecording : recorder.isRecording,
      isPaused    : recorder.isPaused,
      progress    : recorder.progress,
      url         : recorder.url,
    }),
    [
      recorder.status,
      recorder.isRecording,
      recorder.isPaused,
      recorder.progress,
      recorder.url,
    ]
  );

  const actions = useMemo<RecorderActions>(
    () => ({
      start: recorder.start,
      stop : recorder.stop,
      pause: recorder.pause,
      resume: recorder.resume,
      destroy: recorder.destroy,
      registerContainer: (el) => {
        if (el) setContainer(el);
      },
    }),
    [
      recorder.start,
      recorder.stop,
      recorder.pause,
      recorder.resume,
      recorder.destroy,
    ]
  );

  return (
    <StateCtx.Provider value={state}>
      <ActionCtx.Provider value={actions}>{children}</ActionCtx.Provider>
    </StateCtx.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Typed hooks                                                                */
/* -------------------------------------------------------------------------- */
export const useVoiceRecorderState = () => {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error("useVoiceRecorderState must be inside VoiceRecorderProvider");
  return ctx;
};

export const useVoiceRecorderActions = () => {
  const ctx = useContext(ActionCtx);
  if (!ctx) throw new Error("useVoiceRecorderActions must be inside VoiceRecorderProvider");
  return ctx;
};
