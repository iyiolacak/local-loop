// FILE: src/components/CommandForm/EntryFormView.tsx
"use client";

import * as React from "react";
import type { useCommandMachine } from "./useCommandMachine";
import { ActionButton } from "./ActionButton";
import { EntryTextarea } from "./EntryTextarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormCover } from "./FormCover";

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
    overlayActive,          // <-- new
  } = machine;

  const isDisabled = isBusy || isRecording;
  const placeholder = isRecording ? "Listening…" : "Type a command…";
  const handleSubmit = React.useCallback(() => { if (canSubmit) submit(); }, [canSubmit, submit]);

  // Make the underlying row inert while overlay blocks it (prevents focus/AT leaks)
  const rowRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    if (overlayActive) {
      (el as any).inert = true;
      el.setAttribute("aria-hidden", "true");
      return () => {
        delete (el as any).inert;
        el.removeAttribute("aria-hidden");
      };
    }
  }, [overlayActive]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div ref={rowRef} className="relative flex w-full bg-background md:max-w-2xl rounded-xl overflow-hidden">
        {/* Content stays unchanged; overlay will sit on top when active */}
        <EntryTextarea
          value={text}
          onValueChange={onChange}
          onSubmit={() => handleSubmit()}
          readOnly={isDisabled}
          placeholder={placeholder}
          aria-busy={isBusy}
          className={cn(
            "relative z-10 flex-1",
            isRecording && "text-transparent placeholder:text-gray-500 cursor-default caret-transparent"
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

        {/* The brand cover; no buttons visible while active */}
        <FormCover
          active={overlayActive}
          label="Listening…"
          className="bg-primary"   // or: "bg-gradient-to-br from-primary to-primary/90"
        />
      </div>

      {hasError && (
        <div className="mt-3 pl-1 text-sm text-red-600 space-y-2">
          <p><span className="font-semibold">Error:</span> {errorMessage}</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={retry} className="font-semibold">Retry</Button>
            <Button size="sm" variant="ghost" onClick={dismissError} className="font-semibold">Dismiss</Button>
          </div>
        </div>
      )}
    </div>
  );
}
