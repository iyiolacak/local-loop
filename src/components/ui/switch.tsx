"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // General styling for the track:
        //  - Border matches SelectTrigger
        //  - Shadow matches SelectTrigger
        //  - Focus ring matches SelectTrigger
        "peer inline-flex shrink-0 items-center shadow-xs transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",

        // Sizing (large, blocky):
        //  - Increased height and width
        //  - Blocky rounding
        "h-7 w-14 rounded-sm",

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
          "h-5.5 w-7",

          // Thumb color:
          //  - Assumes 'background' is a light color for contrast against dark track
          "bg-background",

          // Thumb position:
          //  - 'translate-x-[2px]' gives 2px padding on the left when unchecked.
          //  - 'translate-x-[26px]' gives 2px padding on the right when checked.
          //    (Calculated as: Track Width (48px) - Thumb Width (20px) - Desired Right Padding (2px) = 26px)
          "data-[state=unchecked]:translate-x-[2px] data-[state=unchecked]:bg-white/90",
          "data-[state=checked]:translate-x-[26px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }