// FILE: src/components/CommandForm/useCommandMachine.ts
"use client";

import { useMachine } from "@xstate/react";
import { useMemo, useCallback } from "react";
import { commandMachine } from "./command.machine";
import { useVoiceRecorder } from "@/app/hooks/useVoiceRecorder";
import { useOverlayGate } from "./useOverlayGate";

export function useCommandMachine() {
  const [state, send] = useMachine(commandMachine);

  // --- state/context flags from the machine
  const { text, errorMessage } = state.context;
  const isIdle = state.matches("idle");
  const isTyping = state.matches("typing");
  const isRecording = state.matches("recording");
  // Keep overlay tied strictly to "hold" (recording). Change to || isBusy if you want.
  const overlayActive = useOverlayGate(isRecording, 80);
  const isSubmitting = state.matches("submitting");
  const isTranscribing = state.matches("transcribing");
  const hasError = state.matches("error");
  const isBusy = isSubmitting || isTranscribing;
  const canSubmit = isTyping && text.trim().length > 0;

  // --- recorder: wire onStop to feed blob back into the machine
  const recorder = useVoiceRecorder({
    onStop: (blob: Blob) => {
      // When the physical recording stops (and we chose to save),
      // push the real blob to the machine so it can transcribe.
      send({ type: "STOP_RECORDING", blob });
    },
  });

  // --- UI event wrappers — keep views dumb
  const onChange = useCallback(
    (value: string) => send({ type: "TEXT_CHANGED", value }),
    [send]
  );

  const startRecording = useCallback(async () => {
    // Start mic capture first so UX shows recording immediately,
    // then move the machine into 'recording' state.
    send({ type: "RECORD" });
    try {
      await recorder.start();
    } catch (err) {
      // revert machine state if recorder fails
      console.error("Recorder failed to start:", err);
      send({ type: "CANCEL_RECORDING" });
      throw err; // re-throw to propagate error
    }
  }, [recorder, send]);

  const stopRecording = useCallback(async () => {
    // Stop and SAVE: recorder.onStop will emit the blob and we’ll send STOP_RECORDING there.
    await recorder.stop(true);
    // No send() here; onStop() above will handle it after blob is ready.
  }, [recorder]);

  const cancelRecording = useCallback(async () => {
    // Stop WITHOUT saving a blob
    await recorder.stop(false);
    send({ type: "CANCEL_RECORDING" });
  }, [recorder, send]);

  const submit = useCallback(() => send({ type: "SUBMIT" }), [send]);
  const retry = useCallback(() => send({ type: "RETRY" }), [send]);
  const dismissError = useCallback(() => send({ type: "DISMISS" }), [send]);

  return useMemo(
    () => ({
      state,
      send,
      // context
      text,
      errorMessage,
      // derived flags
      isIdle,
      isTyping,
      isRecording,
      isSubmitting,
      isTranscribing,
      hasError,
      isBusy,
      canSubmit,
      // UI-facing handlers
      onChange,
      startRecording,
      stopRecording,
      cancelRecording,
      submit,
      retry,
      dismissError,
      // expose overlay for the view
      overlayActive,
      // recorder telemetry for UI (optional)
      volume: recorder.volume ?? 0,
      recorderStatus: recorder.status,
      recorderIsRecording: recorder.isRecording,
    }),
    [
      state,
      send,
      text,
      errorMessage,
      isIdle,
      isTyping,
      isRecording,
      isSubmitting,
      isTranscribing,
      hasError,
      isBusy,
      canSubmit,
      onChange,
      startRecording,
      stopRecording,
      cancelRecording,
      submit,
      retry,
      dismissError,
      // expose overlay for the view
      overlayActive,
      recorder.volume,
      recorder.status,
      recorder.isRecording,
    ]
  );
}
