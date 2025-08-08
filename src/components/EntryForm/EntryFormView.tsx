"use client";

import * as React from "react";
import type { useCommandMachine } from "./useCommandMachine";
import { ActionButton } from "./ActionButton";
import { EntryTextarea } from "./EntryTextarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CommandMachine = ReturnType<typeof useCommandMachine>;

interface EntryFormViewProps {
  machine: CommandMachine;
}

export function EntryFormView({ machine }: EntryFormViewProps) {
  const {
    text,
    onChange,
    errorMessage,
    isRecording,
    isBusy,
    canSubmit,
    hasError,
    startRecording,
    stopRecording,
    cancelRecording,
    submit,
    retry,
    dismissError,
  } = machine;

  const isDisabled = isBusy || isRecording;
  const placeholder = isRecording ? "Listening…" : "Type a command…";

  const handleSubmit = React.useCallback(() => {
    if (canSubmit) submit();
  }, [canSubmit, submit]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative flex w-full bg-background md:max-w-2xl">
        <EntryTextarea
          value={text}
          onValueChange={onChange}
          onSubmit={() => handleSubmit()}
          readOnly={isDisabled}
          placeholder={placeholder}
          aria-busy={isBusy}
          className={cn(
            "relative z-10",
            isRecording &&
              "text-transparent placeholder:text-gray-500 cursor-default caret-transparent"
          )}
        />

        <ActionButton
          isRecording={isRecording}
          isBusy={isBusy}
          canSubmit={canSubmit}
          onRecord={startRecording}
          onStop={stopRecording}
          onSubmit={handleSubmit}
          onCancel={cancelRecording}
        />
      </div>

      {hasError && (
        <div className="mt-3 pl-1 text-sm text-red-600 space-y-2">
          <p>
            <span className="font-semibold">Error:</span> {errorMessage}
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={retry} className="font-semibold">
              Retry
            </Button>
            <Button size="sm" variant="ghost" onClick={dismissError} className="font-semibold">
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
