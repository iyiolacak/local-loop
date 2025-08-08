// FILE: src/components/CommandForm/useCommandMachine.ts
import { useMachine } from "@xstate/react";
import { useMemo, useCallback } from "react";
import { commandMachine } from "./command.machine";

export function useCommandMachine() {
  const [state, send] = useMachine(commandMachine);

  const { text, errorMessage } = state.context;

  const isIdle = state.matches("idle");
  const isTyping = state.matches("typing");
  const isRecording = state.matches("recording");
  const isSubmitting = state.matches("submitting");
  const isTranscribing = state.matches("transcribing");
  const hasError = state.matches("error");

  const isBusy = isSubmitting || isTranscribing;
  const canSubmit = isTyping && text.trim().length > 0;

  // UI event wrappers — keep JSX layers dumb
  const onChange = useCallback((value: string) => send({ type: "TEXT_CHANGED", value }), [send]);
  const startRecording = useCallback(() => send({ type: "RECORD" }), [send]);
  const stopRecording = useCallback(() => send({ type: "STOP_RECORDING", Blob }), [send]);
  const cancelRecording = useCallback(() => send({ type: "CANCEL_RECORDING" }), [send]);
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
      // derived
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
    ]
  );
}

