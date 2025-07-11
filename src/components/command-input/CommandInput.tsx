"use client";

import * as React from "react";
import { Textarea as ShadTextarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

type Native = React.ComponentPropsWithoutRef<typeof ShadTextarea>;

export interface CommandTextareaProps
  extends Omit<Native, "value" | "defaultValue" | "onSubmit"> {
  value?: string;
  defaultValue?: string;
  onSubmit?: (value: string, e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  autoResize?: boolean;
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
    ...rest
  } = props;

  const innerRef = React.useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isComposing, setIsComposing] = React.useState(false);
  const controlled = valueProp !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const value = controlled ? valueProp! : internal;

  // Calculate line count and determine if we're in single-line mode
  const lineCount = value.split('\n').length;
  const isSingleLine = lineCount === 1 && value.length < 80;
  
  // Notion-like placeholder animation state
  const [placeholderVisible, setPlaceholderVisible] = React.useState(true);
  
  const resize = React.useCallback(() => {
    if (!autoResize || !innerRef.current) return;
    const el = innerRef.current;
    
    // Reset height to auto to get correct scrollHeight
    el.style.height = "auto";
    
    // Calculate new height
    const newHeight = el.scrollHeight;
    el.style.height = `${newHeight}px`;
  }, [autoResize]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      if (!controlled) setInternal(e.target.value);
      if (e.target.value) setPlaceholderVisible(false);
      resize();
    },
    [onChange, controlled, resize],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || isComposing) return;

      // Submit on Enter (without Shift)
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit?.(value, e);
      }
      // Add new line on Shift+Enter
      else if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        const textarea = innerRef.current;
        if (!textarea) return;
        
        const { selectionStart, selectionEnd } = textarea;
        const newValue = 
          value.substring(0, selectionStart) + 
          '\n' + 
          value.substring(selectionEnd);
        
        if (!controlled) setInternal(newValue);
        onChange?.({
          target: { value: newValue },
        } as React.ChangeEvent<HTMLTextAreaElement>);
        
        // Move cursor to new position
        setTimeout(() => {
          if (textarea) {
            textarea.selectionStart = selectionStart + 1;
            textarea.selectionEnd = selectionStart + 1;
          }
        }, 0);
      }
    },
    [onKeyDown, onSubmit, value, isComposing, controlled, onChange],
  );

  React.useImperativeHandle(
    forwardedRef,
    (): CommandTextareaHandle => ({
      focus: () => {
        innerRef.current?.focus();
        setIsFocused(true);
      },
      clear: () => {
        if (!controlled) setInternal("");
        setPlaceholderVisible(true);
        resize();
      },
      submit: () => onSubmit?.(value, {} as any),
      element: innerRef.current,
    }),
    [controlled, value, onSubmit, resize],
  );

  React.useLayoutEffect(() => {
    resize();
    if (value) setPlaceholderVisible(false);
  }, [value, resize]);

  return (
    <div className="relative w-full">
      <ShadTextarea
        ref={innerRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          dark:w-full dark:rounded-md dark:border-none dark:border-gray-600 dark:bg-input-dark dark:text-gray-100
          dark:outline-none dark:transition-all duration-200 ease-out dark:overflow-hidden
          dark:focus:border-product dark:focus:ring-1 dark:focus:ring-product
          dark:resize-none
          !min-h-24 !text-xl !font-medium !flex !justify-center !items-center
          ${isSingleLine ? "dark:text-lg" : "dark:text-base"}
          ${isSingleLine ? "dark:py-[9px]" : "dark:py-3"} 
          dark:px-3
          ${className}
        `}
        style={{
          minHeight: isSingleLine ? "auto" : "40px",
        }}
        {...rest}
      />

      {/* Notion-like floating placeholder */}
    </div>
  );
});

CommandTextarea.displayName = "CommandTextarea";