"use client"

import * as React from "react"
import { CommandTextarea } from "./CommandInput"
import { Button } from "../ui/button"
import { Send, Mic } from "lucide-react"

interface CommandFormProps {
  onSubmit: (value: string) => void
  onVoice?: () => void               // optional mic handler
  placeholder?: string
}

export const CommandForm: React.FC<CommandFormProps> = ({
  onSubmit,
  onVoice,
  placeholder = "Animate the cats in GSAP",
}) => {
  const [text, setText] = React.useState("")

  /* ⇢ submit helper ------------------------------------------------------- */
  const handleSubmit = (value: string) => {
    const v = value.trim()
    if (!v) return
    onSubmit(v)
    setText("")
  }

  const handleButtonClick = () => {
    if (text.trim()) {
      handleSubmit(text)
    } else {
      onVoice?.()                // invoke mic flow if supplied
    }
  }

  /* ---------------------------------------------------------------------- */
  return (
    <div className="relative flex w-full max-w-2xl">
      {/* Command textarea (controlled) */}
      <CommandTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        className="pr-14"            /* space for button */
      />

      {/* Solid pill action button */}
      <Button
        type="button"
        onClick={handleButtonClick}
        disabled={!text.trim() && !onVoice}
        className="
          absolute right-2 top-2 h-9 w-9 rounded-full p-0
          bg-product text-background text-xl
          shadow-lg hover:bg-product/90 active:scale-95
          transition focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2
        "
        aria-label={text.trim() ? "Send" : "Record voice note"}
      >
        {text.trim() ? (
          <Send className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
    </div>
  )
}
