/* ------------------------------------------------------------------
 *  select.tsx  —  Radix Select with global SFX (Howler / use‑sound)
 * ------------------------------------------------------------------
 *
 *  ➜  Requires:
 *      – @radix-ui/react-select
 *      – lucide-react
 *      – tailwind‑merge `cn` helper
 *      – "@/lib/sfx"  (see previous step)
 *  ➜  Wrap your root layout in <SfxProvider> once.
 * ----------------------------------------------------------------*/

"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useHoverClickSounds, useSfx } from "@/lib/sfx"
import { NavArrowDown, NavArrowUp } from "iconoir-react/solid"

/* ------------------------------------------------------------------
 *  ROOT + SIMPLE SUB‑COMPONENTS
 * ----------------------------------------------------------------*/

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectLabel(props: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", props.className)}
      {...props}
    />
  )
}

function SelectSeparator(
  props: React.ComponentProps<typeof SelectPrimitive.Separator>
) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", props.className)}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------
 *  TRIGGER  (hover / click sounds)
 * ----------------------------------------------------------------*/

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentProps<typeof SelectPrimitive.Trigger> & { size?: "sm" | "default" }
>(function SelectTrigger(
  { className, children, size = "default", onMouseEnter, onClick, ...props },
  ref
) {
  const sfx = useHoverClickSounds() // { onMouseEnter, onClick }

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      /* Combine caller‑supplied handlers with our SFX */
      onMouseEnter={e => {
        sfx.onMouseEnter()
        onMouseEnter?.(e)
      }}
      onClick={e => {
        sfx.onClick()
        onClick?.(e)
      }}
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "data-[placeholder]:text-muted-foreground \
        focus-visible:border-ring focus-visible:ring-ring/50 \
        aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 \
        aria-invalid:border-destructive dark:bg-input-dark transition-color dark:hover:text-background dark:hover:bg-product \
        relative z-10 flex w-fit items-center justify-between gap-2 \
        rounded-md border-none bg-transparent px-4 py-3 text-lg whitespace-nowrap \
        shadow-xs transition-[color,box-shadow,border-radius] outline-none \
        focus-visible:ring-[3px] \
        cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 \
        *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex \
        *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 \
        [&_svg]:pointer-events-none [&_svg]:shrink-0 \
        [&_svg:not([class*='size-'])]:size-4 group",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <div className="px-2 py-1 bg-background rounded-sm ">
        <NavArrowDown className="size-4 text-product" />
        </div>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = "SelectTrigger"

/* ------------------------------------------------------------------
 *  CONTENT  (dropdown body + scroll buttons)
 * ----------------------------------------------------------------*/

function SelectContent(
  { className, children, position = "popper", ...props }:
  React.ComponentProps<typeof SelectPrimitive.Content>
) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-input-dark text-white \
          data-[state=open]:animate-in data-[state=closed]:animate-out \
          data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 \
          data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 \
          data-[state=closed]:slide-out-to-top-2 data-[state=closed]:slide-out-to-bottom-2 \
          data-[state=closed]:slide-out-to-left-2 data-[state=closed]:slide-out-to-right-2 \
          relative z-50 max-h-(--radix-select-content-available-height) \
          min-w-[var(--radix-select-trigger-width)] origin-(--radix-select-content-transform-origin) \
          overflow-x-hidden overflow-y-auto rounded-sm border-none shadow-md",
          // Added translate-y-1 back for the desired gap/slide-from-behind effect
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn("p-1", position === "popper" && "w-full scroll-my-1")}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/* ------------------------------------------------------------------
 *  ITEM  (each option in list)
 * ----------------------------------------------------------------*/

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentProps<typeof SelectPrimitive.Item>
>(function SelectItem(
  { className, children, onPointerDown, onMouseEnter, ...props },
  ref
) {
  const { play } = useSfx()

  return (
    <SelectPrimitive.Item
      ref={ref}
      onMouseEnter={e => {
        play("hover")
        onMouseEnter?.(e)
      }}
      onPointerDown={e => {
        play("click")
        onPointerDown?.(e)
      }}
      data-slot="select-item"
      className={cn(
        "data-[state=checked]:bg-product data-[state=checked]:text-background \
        focus:bg-accent focus:text-accent-foreground \
        relative flex w-full cursor-pointer items-center gap-2 \
        rounded-sm py-2 pr-8 pl-2 text-lg outline-none select-none transition-all \
        hover:pl-4 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 \
        [&_svg]:pointer-events-none [&_svg]:shrink-0 \
        [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = "SelectItem"

/* ------------------------------------------------------------------
 *  SCROLL BUTTONS
 * ----------------------------------------------------------------*/

function SelectScrollUpButton(
  props: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>
) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("flex cursor-pointer items-center justify-center py-1", props.className)}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton(
  props: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>
) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("flex cursor-default items-center justify-center py-1", props.className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

/* ------------------------------------------------------------------
 *  EXPORTS  (tree‑shakable)
 * ----------------------------------------------------------------*/

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}