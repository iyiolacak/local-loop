import { createMachine } from "xstate"

export interface CommandFormProps {
  /** Callback fired when the user sends text */
  onSubmit: (value: string) => void;
  /** Placeholder for the textarea  */
  placeholder?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export type CommandMode =
  | { type: 'idle' }
  | { type: 'typing'; text: string }
  | { type: 'recording'; volume: number }
  | { type: 'submitting'; text: string }
  | { type: 'transcribing' }
  | { type: 'error'; message: string };

// The events that can happen. They describe ACTIONS, not desired states.
export type CommandEvent =
  | { type: 'TEXT_CHANGED'; text: string }
  | { type: 'PRIMARY_ACTION' }           // The ONE event for the main button.
  | { type: 'STOP_RECORDING_CANCEL' }
  | { type: 'VOLUME_TICK'; volume: number }
  | { type: 'TRANSCRIPTION_COMPLETE'; text: string } // Event for when transcription succeeds 
  | { type: 'SUBMIT_COMPLETE' }                      // Event for when text submission succeeds
  | { type: 'ACTION_FAILED'; message: string };       // A single failure event for any async action

export type CommandDispatch = (e: CommandEvent) => void;

export const commandMachine = createMachine<CommandMode, CommandEvent>({
  id: "command",
  initial: "idle",

  context: {
    text: "",
    
  }
  states: {

  }
})