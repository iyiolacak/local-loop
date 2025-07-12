"use client"

import * as React from "react"
import { CommandTextarea } from "./CommandInput"
import { Button } from "../ui/button"
import { ArrowUp, Lock } from "iconoir-react/regular"
import { Microphone } from "iconoir-react/solid"
import { AnimatedIconSwitcher } from "./AnimatedIconSwitcher"

/* shadcn/ui tooltip */
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip"

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

  /* submit helper */
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
      onVoice?.()
    }
  }

  /* one tooltip for both modes */
  const tooltipMain = text.trim()
    ? "Send privately*"
    : "Record privately*"

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative flex w-full max-w-2xl">
        {/* Main input */}
        <CommandTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onSubmit={handleSubmit}
          placeholder={placeholder}
          className="pr-14"
        />

        {/* Button wrapped in a TooltipTrigger */}
        <Tooltip delayDuration={120}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={handleButtonClick}
              aria-label={text.trim() ? "Send message" : "Record voice note"}
              className="
                absolute right-2 top-2 flex h-10 w-14 items-center justify-center
                rounded-md bg-product p-0 text-background text-xl
                shadow-lg hover:bg-product/90 active:scale-95
                transition-all duration-150 ease-in-out
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-ring focus-visible:ring-offset-2
                group hover:w-20
              "
            >
              <AnimatedIconSwitcher
                show={!!text.trim()}
                enterIcon={
                  <ArrowUp width={36} height={36} className="transition-all size-5" strokeWidth={3} />
                }
                exitIcon={
                  <Microphone width={36} height={36} className="transition-all size-5" strokeWidth={2} />
                }
              />
            </Button>
          </TooltipTrigger>

          {/* Polished, multiline tooltip */}
          <TooltipContent
            side="right"
            align="end"
            className="max-w-[260px] rounded-lg px-4 py-3 text-sm leading-snug shadow-lg"
          >
            <p className="font-medium text-md flex text-end items-end mb-1.5"><Lock strokeWidth={2}/>{tooltipMain}</p>
            <p className="text-xs text-muted-foreground font-medium
            ">
              * Routed only to the OpenAI ChatGPT API you already use.<br/>Otherwise, everything stays on your device.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
