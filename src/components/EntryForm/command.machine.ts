import { createMachine, assign } from "xstate";
import { submitText, transcribeAudio } from "./api";

// CONTEXT: The extended state (memory) of our machine.
interface CommandContext {
  text: string;
  errorMessage?: string;
  audioBlob?: Blob;
  lastOp: "submit" | "transcribe" | null;
}

// EVENTS
type TextChanged = { type: "TEXT_CHANGED"; value: string };
type Submit = { type: "SUBMIT" };
type RecordEvt = { type: "RECORD" };
type StopRecording = { type: "STOP_RECORDING", blob: Blob };
type CancelRecording = { type: "CANCEL_RECORDING" };
type Retry = { type: "RETRY" };
type Dismiss = { type: "DISMISS" };

export type CommandEvent =
  | TextChanged
  | Submit
  | RecordEvt
  | StopRecording
  | CancelRecording
  | Retry
  | Dismiss;

// THE MACHINE DEFINITION (XState v5-typed)
export const commandMachine = createMachine({
  types: {} as {
    context: CommandContext;
    events: CommandEvent;
  },

  id: "command",
  initial: "idle",
  context: {
    text: "",
    errorMessage: undefined,
    audioBlob: undefined,
    lastOp: null,
  },

  states: {
    idle: {
      on: {
        TEXT_CHANGED: {
          target: "typing",
          actions: assign({
            text: ({ event }) => event.value,
          }),
        },
        RECORD: "recording",
      },
    },

    typing: {
      // Bounce to idle if the text becomes empty.
      always: [
        {
          target: "idle",
          guard: ({ context }) => context.text.trim().length === 0,
        },
      ],
      on: {
        TEXT_CHANGED: {
          target: "typing",
          actions: assign({
            text: ({ event }) => event.value,
          }),
          guard: ({ event }) => event.type === "TEXT_CHANGED",
        },
        SUBMIT: {
          target: "submitting",
          guard: ({ context }) => context.text.trim().length > 0,
        },
        RECORD: "recording",
      },
    },

    recording: {
      on: {
        STOP_RECORDING: {
          target: "transcribing",
          actions: assign({
            audioBlob: ({ event }) => event,
          }),
        },
        CANCEL_RECORDING: "idle",
        TEXT_CHANGED: {
          // Allow typing while recording to immediately go back to typing
          target: "typing",
          actions: assign({ text: ({ event }) => event.value }),
        },
      },
    },

    submitting: {
      entry: assign({ lastOp: () => "submit" as const, errorMessage: () => undefined }),
      invoke: {
        id: "submitService",
        src: async ({ context }) => {
          await submitText(context.text);
        },
        onDone: {
          target: "idle",
          actions: assign({ text: () => "" }),
        },
        onError: {
          target: "error",
          actions: assign({
            errorMessage: ({ event }) =>
              (event as { error: unknown })?.error instanceof Error
                ? (event as { error: Error }).error.message
                : "The server could not process the request.",
          }),
        },
      },
    },

    transcribing: {
      entry: assign({ lastOp: () => "transcribe" as const, errorMessage: () => undefined }),
      invoke: {
        id: "transcribeService",
        src: async ({ context }) => {
          const blob = context.audioBlob;
          if (!blob) throw new Error("No audio to transcribe.");
          return transcribeAudio(blob);
        },
        onDone: {
          target: "typing",
          actions: assign({
            text: ({ event }) => (event as { output: string }).output,
          }),
        },
        onError: {
          target: "error",
          actions: assign({
            errorMessage: ({ event }) =>
              (event as { error: unknown })?.error instanceof Error
                ? (event as { error: Error }).error.message
                : "Transcription failed.",
          }),
        },
      },
    },

    error: {
      on: {
        // Retry the last failing side effect if possible
        RETRY: [
          {
            target: "submitting",
            guard: ({ context }) => context.lastOp === "submit" && context.text.trim().length > 0,
            actions: assign({ errorMessage: () => undefined }),
          },
          {
            target: "transcribing",
            guard: ({ context }) => context.lastOp === "transcribe" && !!context.audioBlob,
            actions: assign({ errorMessage: () => undefined }),
          },
          {
            target: "idle",
            actions: assign({ errorMessage: () => undefined }),
          },
        ],
        // Dismiss the error and return to a stable state based on current text
        DISMISS: [
          {
            target: "typing",
            guard: ({ context }) => context.text.trim().length > 0,
            actions: assign({ errorMessage: () => undefined }),
          },
          {
            target: "idle",
            actions: assign({ errorMessage: () => undefined }),
          },
        ],
        TEXT_CHANGED: {
          target: "typing",
          actions: assign({ text: ({ event }) => event.value, errorMessage: () => undefined }),
        },
      },
    },
  },
});