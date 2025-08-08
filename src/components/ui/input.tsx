"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSfx } from "@/lib/sfx";

export type InputProps = React.ComponentProps<"input">;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onFocus, ...props }, ref) => {
    const { play } = useSfx();

    const handleFocus: React.FocusEventHandler<HTMLInputElement> = e => {
      onFocus?.(e);
      play("punchy_tap");
    };

    return (
      <input
        ref={ref}
        {...props}
        onFocus={handleFocus}
        data-slot="input"
        className={cn(
          // Match CommandTextarea visual language:
          "relative z-10 flex h-12 w-full min-w-0 rounded-md bg-input-dark border-none px-3 py-3 text-gray-100 shadow-xs transition-all duration-200 ease-out",
          "selection:bg-primary selection:text-primary-foreground",
          "focus:border-product focus:ring-1 focus:ring-product focus:outline-none focus-visible:ring-2 ring-product outline-product focus-visible:ring-product",
          // File input styling:
          "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-lg file:font-medium",
          // Placeholder & disabled:
          "placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-lg",
          className
        )}
        type={props.type}
      />
    );
  }
);

Input.displayName = "Input";
