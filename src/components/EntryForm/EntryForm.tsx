"use client";
import * as React from "react";
import { useCommandMachine } from "./useCommandMachine";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EntryFormView } from "./EntryFormView";

export function EntryForm() {
  const machine = useCommandMachine();
  return (
    <TooltipProvider>
      <EntryFormView machine={machine} />
    </TooltipProvider>
  );
}

