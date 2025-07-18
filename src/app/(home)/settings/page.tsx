"use client";

// Privacy & Transparency Settings Page (v3)
// -----------------------------------------
// Typography bump: larger font sizes and relaxed line‑height for easier reading.
// (Based on Nielsen‑Norman readability guidelines.)

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// localStorage helpers ------------------------------------------------
const LS_KEY = "ll:userPrefs" as const; // Specific key for user preferences
interface UserPrefs {
  model: string;
  saveVoice: boolean;
  shareDiagnostics: boolean;
}
const DEFAULT_PREFS: UserPrefs = {
  model: "OpenAI GPT‑4o",
  saveVoice: true,
  shareDiagnostics: false,
};

const loadPrefs = (): UserPrefs => {
  if (typeof window === "undefined") return DEFAULT_PREFS; // Ensure client-side only
  try {
    const raw = localStorage.getItem(LS_KEY);
    // Merge loaded prefs with defaults to ensure all keys are present
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch (error) {
    console.error("Failed to load preferences from localStorage:", error);
    return DEFAULT_PREFS; // Return defaults on error
  }
};

const savePrefs = (prefs: UserPrefs) => {
  if (typeof window === "undefined") return; // Ensure client-side only
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error("Failed to save preferences to localStorage:", error);
  }
};

export default function PrivacySettings() {
  // Initialize state by trying to load from localStorage immediately on client-side.
  // This avoids a flicker where DEFAULT_PREFS are shown before useEffect updates.
  const [prefs, setPrefs] = useState<UserPrefs>(() => loadPrefs());
  const [confirmReset, setConfirmReset] = useState(false);

  // Debounce saving preferences to localStorage whenever `prefs` change
  useEffect(() => {
    const id = setTimeout(() => savePrefs(prefs), 150);
    return () => clearTimeout(id); // Cleanup on unmount or re-render
  }, [prefs]);

  // Handler for the reset action
  const handleReset = () => {
    if (typeof window === 'undefined') return; // Ensure client-side operation
    try {
      localStorage.removeItem(LS_KEY); // Crucial: Only remove our specific key, not everything
      setPrefs(DEFAULT_PREFS); // Immediately update UI to default state
      setConfirmReset(false); // Close the dialog
      // A small delay for visual feedback, then hard reload for a fresh application state
      setTimeout(() => window.location.reload(), 300);
    } catch (error) {
      console.error("Failed to reset Local Loop preferences:", error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 p-6 md:p-12"> {/* Reduced vertical spacing */}
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Privacy & Transparency
      </h1>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-muted-foreground"> {/* Standardized text-lg */}
        Locally Loop executes <span className="font-semibold">100%</span> in your browser. We transmit
        <em> only the input and minimal context you provide</em> to your chosen
        model for a reply. No accounts, no hidden sync.
      </p>

      {/* Model Provider ------------------------------------------------*/}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Model Provider</CardTitle> {/* Standardized CardTitle size */}
          <CardDescription className="leading-relaxed text-sm md:text-base"> {/* Standardized CardDescription */}
            Decide which model processes your text. The data shown above is the
            only payload that ever leaves your device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base"> {/* Standardized Label size */}
            Provider
          </p>
          <Select
            value={prefs.model}
            onValueChange={(v) => setPrefs({ ...prefs, model: v })}
          >
            <SelectTrigger id="model" className="mt-3 w-full text-base">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent className="text-base">
              <SelectItem value="OpenAI GPT‑4o">OpenAI GPT‑4o (default)</SelectItem>
              <SelectItem value="Anthropic Claude‑3">Anthropic Claude‑3</SelectItem>
              <SelectItem value="Local LLM (browser)">Local LLM (browser)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Voice Notes ---------------------------------------------------*/}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Voice Notes</CardTitle>
          <CardDescription className="leading-relaxed text-sm md:text-base">
            Control what happens to raw audio after transcription.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4 md:gap-6"> {/* Adjusted responsive gap */}
          <div className="space-y-1">
            <p className="font-medium text-base">Keep original audio</p> {/* Standardized text size */}
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
              Uncheck to auto‑delete audio once transcribed — saves disk, boosts
              privacy.
            </p>
          </div>
          <Switch
            checked={prefs.saveVoice}
            onCheckedChange={(v) => setPrefs({ ...prefs, saveVoice: v })}
            aria-label="Toggle save voice"
          />
        </CardContent>
      </Card>

      {/* Diagnostics ---------------------------------------------------*/}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Diagnostics</CardTitle>
          <CardDescription className="leading-relaxed text-sm md:text-base">
            Share anonymous crash logs to improve Local Loop. Default: off.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4 md:gap-6"> {/* Adjusted responsive gap */}
          <div className="space-y-1">
            <p className="font-medium text-base">Share crash reports</p> {/* Standardized text size */}
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
              Contains <em>no</em> personal data — just stack traces & performance.
            </p>
          </div>
          <Switch
            checked={prefs.shareDiagnostics}
            onCheckedChange={(v) =>
              setPrefs({ ...prefs, shareDiagnostics: v })
            }
            aria-label="Toggle diagnostics"
          />
        </CardContent>
      </Card>

      {/* Reset Section -------------------------------------------------*/}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-xl">Reset Local Loop</CardTitle>
          <CardDescription className="leading-relaxed text-sm md:text-base">
            Need a fresh start? This will delete all user preferences and stored
            data in this browser. This does <strong className="font-bold">not</strong> improve privacy
            (nothing lives outside your device) — it simply erases your local progress.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-base"> {/* Standardized button text size */}
                Start Over
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl">
                  Reset Local Loop?
                </DialogTitle>
                <DialogDescription className="leading-relaxed text-base">
                  This will delete every session, XP, and preference stored
                  locally. It is <em>irreversible</em> and only useful if you want to
                  reboot your flow from zero.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setConfirmReset(false)}
                  className="text-base"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReset}
                  className="text-base"
                >
                  Yes, reset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <Separator />
      <p className="text-center text-sm md:text-base leading-relaxed text-muted-foreground">
        Built for flow — engineered for privacy.
      </p>
    </div>
  );
}