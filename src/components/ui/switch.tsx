"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"
// Import the SFX hooks
import { useHoverClickSounds, useSfx } from "@/lib/sfx"

function Switch({
  className,
  onCheckedChange, // Destructure onCheckedChange
  onMouseEnter,    // Destructure onMouseEnter
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const { play } = useSfx() // For direct play (e.g., onCheckedChange)
  const sfx = useHoverClickSounds() // For generalized hover/click behavior (e.g., onMouseEnter)

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      // Apply SFX for hover
      onMouseEnter={(e) => {
        sfx.onMouseEnter()
        onMouseEnter?.(e) // Call original prop if it exists
      }}
      // Apply SFX for click/state change
      onCheckedChange={(checked) => {
        play("switch_2") // Play click sound when the switch state changes
        onCheckedChange?.(checked) // Call original prop if it exists
      }}
      className={cn(
        // General styling for the track:
        //  - Border matches SelectTrigger
        //  - Shadow matches SelectTrigger
        //  - Focus ring matches SelectTrigger
        "peer inline-flex shrink-0 items-center cursor-pointer border border-input shadow-xs transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",

        // Sizing (large, blocky):
        //  - Increased height and width
        //  - Blocky rounding
        "h-7 hover:ring-2 hover:ring-product w-14 rounded-sm",

        // Colors:
        //  - Checked state background matches SelectItem's checked background
        //  - Unchecked state background matches SelectTrigger's background
        "data-[state=checked]:bg-product data-[state=unchecked]:bg-input-dark",

        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Thumb styling:
          //  - Pointer events none (Radix handles interactivity on root)
          //  - Blocky rounding
          //  - Ring-0 (no internal ring)
          //  - Smooth transform transition
          "pointer-events-none block rounded-sm ring-0 transition-transform",

          // Thumb size:
          //  - Increased size to fit proportionally in larger track
          "h-5 w-7",

          // Thumb color:
          //  - Assumes 'background' is a light color for contrast against dark track
          "bg-background",

          // Thumb position and color when unchecked:
          //  - 'translate-x-[2px]' gives 2px padding on the left when unchecked.
          "data-[state=unchecked]:translate-x-[2px] data-[state=unchecked]:bg-white/90",

          // Thumb position when checked:
          //  - 'translate-x-[26px]' gives 2px padding on the right when checked.
          //    (Calculated as: Track Width (56px) - Thumb Width (28px) - Desired Right Padding (2px) = 26px)
          "data-[state=checked]:translate-x-[26px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }