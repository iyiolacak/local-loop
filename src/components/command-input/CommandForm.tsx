"use client";

import React, { useRef } from "react";
import { CommandTextarea } from "./CommandInput";
 
/* shadcn/ui tooltip */
import { AnimatePresence, motion } from "framer-motion";
import { useWaveSurferRecorder } from "@/app/hooks/useWaveformRecorder";
import { preloadWaveSurfer } from "./lazyWavesurfer";
import { TooltipProvider } from "../ui/tooltip";
import { ActionButton } from "./ActionButton";
import { CommandFormProps } from "./types";
import { useCommandForm } from "./useCommandForm";

/**
 * Public API ----------------------------------------------------------------
 */

/**
 * Presentational component – Zero business logic. Swappable, themeable.
 */
export const CommandForm: React.FC<CommandFormProps> = (props) => {
  const {
    waveSurferRef,
    text,
    setText,
    hasText,
    tooltipMain,
    handleSubmit,
    placeholder,

    isRecording,
    status,
    progress,
    url,
    start,
    stop,
    destroy,
  } = useCommandForm(props);

  /* Helpers */
  const mmss = new Date(progress).toISOString().substring(14, 19);

  return (
    <TooltipProvider delayDuration={300}>
      {/* Define mode(record or typing(including no text)) */}
      <div className="relative bg-background flex w-full md:max-w-2xl">
        <div
          className="absolute top-2 left-2 bg-red-600/40 border rounded-md"
        />
        <CommandTextarea
          value={text}
          isRecording={isRecording}
          onChange={(e) => setText(e.target.value)}
          onSubmit={handleSubmit}
          placeholder={isRecording ? "" : placeholder}
          className="dark:pr-20 relative z-10"
        />

        {/* Action button ---------------------------------------------------- */}
        <ActionButton
          isRecording={isRecording}
          hasText={hasText}
          tooltipMain={tooltipMain}
          onClick={() => {}}
          onMouseEnter={preloadWaveSurfer}
          onTouchStart={preloadWaveSurfer}
          waveSurferRef={waveSurferRef} 
          isRecording={isRecording}
          startRecording={start}
          stopRecording={stop}
          destroyRecording={destroy}
          status={status as string}
          mmss={mmss}
          url={url}
        />
      </div>
    </TooltipProvider>
  );
};

// TODO
// You're absolutely right to question the logic—there **are several major problems** that fundamentally break the intended flow of your `CommandForm`. Let’s go through the **most critical issues**, brutally and constructively:

// ---

// ### 🔥 **1. Broken Separation of Concerns: `useCommandForm` returns `containerRef`, but it doesn’t actually declare it**

// In your hook:

// ```ts
// const containerRef = useRef<HTMLDivElement>(null);
// ```

// This `ref` is **not returned**, but it’s used in the `CommandForm` component:

// ```ts
// const {
//   containerRef, // ❌ not returned from the hook
//   ...
// } = useCommandForm(props);
// ```

// ### ✅ Fix:

// You must **return `containerRef` from `useCommandForm`**, otherwise it will be `undefined`, causing `useWaveSurferRecorder` to break.

// ---

// ### 🔥 **2. `onClick` in `<ActionButton />` does nothing, always noop**

// You're passing `onClick={() => {}}` from `CommandForm`, and then doing:

// ```ts
// if (typingMode) {
//   onClick(); // noop
// }
// ```

// Yet the logic here implies you're trying to **submit a message**, but that’s *never called*.

// ### ✅ Fix:

// Pass the actual `handleSubmit` function:

// ```tsx
// <ActionButton
//   ...
//   onClick={handleSubmit} // ✅ real action, not noop
// />
// ```

// And your logic in `ActionButton` should be flipped:

// ```tsx
// if (hasText) {
//   onClick(); // ✅ send text
// } else if (isRecording) {
//   stopRecording().then(...)
// } else {
//   startRecording();
// }
// ```

// ---

// ### 🔥 **3. `AnimatedIconSwitcher` logic is broken due to misused `exitIcon`**

// You are conditionally rendering a `<Button>` inside `exitIcon`, which is already inside a button.

// ```tsx
// exitIcon={
//   isRecording ? (
//     <Button> {/* ❌ nested button – invalid DOM */}
//       <Send strokeWidth={2} />
//     </Button>
//   ) : (
//     <Microphone ... />
//   )
// }
// ```

// Nested buttons are **invalid HTML** and will create weird behavior in React DOM and accessibility.

// ### ✅ Fix:

// Just pass the icon itself:

// ```tsx
// exitIcon={
//   isRecording ? (
//     <Send strokeWidth={2} />
//   ) : (
//     <Microphone width={36} height={36} className="transition-all size-5" strokeWidth={2} />
//   )
// }
// ```

// ---

// ### ⚠️ **4. `startRecording` assumes DOM ref is ready during render**

// `useWaveSurferRecorder` receives:

// ```ts
// container: containerRef.current as HTMLElement
// ```

// This may be **null on initial render**.

// ### ✅ Fix:

// Make `useWaveSurferRecorder` resilient or wrap it with a guard (`useEffect` + conditional init), or refactor it to accept a ref and observe `ref.current` becoming available.

// ---

// ### ⚠️ **5. You check `!hasText` to determine "typing mode", but that logic is reversed**

// Your current logic:

// ```ts
// const typingMode = !hasText;

// if (typingMode) {
//   onClick(); // what you're calling when there is NO text
// }
// ```

// That means you're treating **no input** as "typing mode", and **text presence** as "recording mode"—the **opposite** of what you'd want.

// ### ✅ Fix:

// Use meaningful boolean names:

// ```ts
// const isTyping = hasText; // ✅ user is typing if they entered text

// if (isTyping) {
//   onClick(); // send text
// } else if (isRecording) {
//   ...
// }
// ```

// ---

// ### ⚠️ **6. Misuse of `isRecording` in `AnimatedIconSwitcher` conditions**

// This is subtle, but you already gate the entire `ActionButton`'s render tree by `isRecording`, so having a nested switch inside `AnimatedIconSwitcher` creates **redundant/conflicting UI logic**.

// ---

// ## 🧠 Summary – TL;DR Brutal Verdict

// | Issue                                        | Description                    | Severity    |
// | -------------------------------------------- | ------------------------------ | ----------- |
// | ❌ `containerRef` not returned                | Your recorder won’t work       | 🔥 Critical |
// | ❌ `onClick` does nothing                     | Text submit never fires        | 🔥 Critical |
// | ❌ Button inside button                       | DOM invalidation               | 🔥 Critical |
// | ⚠️ DOM not ready for recording               | Breaks `useWaveSurferRecorder` | ⚠️ Major    |
// | ⚠️ `hasText` logic inverted                  | Wrong behavior flow            | ⚠️ Major    |
// | ⚠️ Redundant logic in `AnimatedIconSwitcher` | Minor design issue             | ⚠️ Minor    |

// ---

// ## ✅ Suggested Next Steps

// * Return `containerRef` from `useCommandForm`
// * Pass `handleSubmit` to `ActionButton`
// * Fix the logic of `hasText` vs recording
// * Avoid nested buttons
// * Add guard for DOM availability in `useWaveSurferRecorder`

// If you want, I can refactor the most problematic parts into a working version that’s closer to your intended flow. Want that?
