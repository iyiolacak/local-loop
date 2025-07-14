"use client";

import * as React from "react";
import { Textarea as ShadTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface CommandTextareaProps
  extends Omit<TextareaProps, "value" | "defaultValue" | "onSubmit"> {
  value?: string;
  defaultValue?: string;
  onSubmit?: (value: string, e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  autoResize?: boolean;
  voiceRecording: boolean;
}

export interface CommandTextareaHandle {
  focus: () => void;
  clear: () => void;
  submit: () => void;
  element: HTMLTextAreaElement | null;
}

export const CommandTextarea = React.forwardRef<
  CommandTextareaHandle,
  CommandTextareaProps
>((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onChange,
    onKeyDown,
    onSubmit,
    autoResize = true,
    className,
    voiceRecording,
    ...rest
  } = props;

  const innerRef = React.useRef<HTMLTextAreaElement>(null);
  const [isComposing, setIsComposing] = React.useState(false);
  const controlled = valueProp !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const value = controlled ? valueProp! : internal;
  // Check text line amount so, if it is a long structured text, make sure experience is more compact and power-user friendly
  
  const resize = React.useCallback(() => {
    if (!autoResize || !innerRef.current) return;
    const el = innerRef.current;
    
    // Reset height to auto to get correct scrollHeight
    el.style.height = "auto";
    // Calculate new height and set it
    el.style.height = `${el.scrollHeight}px`;
  }, [autoResize]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      if (!controlled) setInternal(e.target.value);
      resize();
    },
    [onChange, controlled, resize],
  );

    // Clip-path polygon animates from a small shape at bottom-right to full rectangle

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || isComposing) return;

      // Submit on Enter without Shift
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit?.(value, e);
      }
      // Allow Shift+Enter for new lines
      else if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        const textarea = innerRef.current;
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        // Insert newline at cursor position
        const newValue = 
          value.substring(0, start) + 
          '\n' + 
          value.substring(end);
        
        if (!controlled) setInternal(newValue);
        onChange?.({
          target: { value: newValue },
        } as React.ChangeEvent<HTMLTextAreaElement>);
        
        // Move cursor after inserted newline
        requestAnimationFrame(() => {
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = start + 1;
        });
      }
    },
    [onKeyDown, onSubmit, value, isComposing, controlled, onChange],
  );

  React.useImperativeHandle(
    forwardedRef,
    (): CommandTextareaHandle => ({
      focus: () => innerRef.current?.focus(),
      clear: () => {
        if (!controlled) setInternal("");
        resize();
      },
      submit: () => onSubmit?.(value, {} as any),
      element: innerRef.current,
    }),
    [controlled, value, onSubmit, resize],
  );

  React.useLayoutEffect(resize, [value, resize]);

  return (
    <ShadTextarea
      ref={innerRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => setIsComposing(false)}
      className={cn(`
        relative z-10 w-full rounded-md border-none bg-input-dark text-gray-100
        focus:border-product focus:ring-1 focus:ring-product
        resize-none py-3 px-3 pr-12 overflow-hidden
        dark:text-lg md:dark:text-xl dark:font-medium
        !h-14 dark:max-h-40 overflow-y-auto
        transition-all duration-200 ease-out
        ${className}
      `,{"dark:text-input-dark placeholder:text-input-dark cursor-default": voiceRecording})}
      style={{ minHeight: "40px" }}
      {...rest}
      />
  );
});

CommandTextarea.displayName = "CommandTextarea";