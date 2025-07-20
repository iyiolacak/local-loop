"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import { Lock } from "iconoir-react/regular";

// ---------------------------------------------------------------------------
// Local Storage Key & Default Preferences
// ---------------------------------------------------------------------------
const LS_KEY = "ll:userPrefs" as const;
interface UserPrefs {
  model: "openai" | "google-gemini-2.5-flash";
  saveVoice: boolean;
  shareDiagnostics: boolean;
}
const DEFAULT_PREFS: UserPrefs = {
  model: "openai",
  saveVoice: false,
  shareDiagnostics: false,
};

const loadPrefs = (): UserPrefs => {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
};

const savePrefs = (prefs: UserPrefs) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(prefs));
  } catch {}
};

export default function PrivacySettings() {
  const [prefs, setPrefs] = useState<UserPrefs>(loadPrefs);

  // Auto-save preferences with a slight debounce
  useEffect(() => {
    const id = setTimeout(() => savePrefs(prefs), 200);
    return () => clearTimeout(id);
  }, [prefs]);


  return (
    <div className="mx-auto max-w-2xl p-6 space-y-10">
      <div>
        <h1 className="text-4xl font-bold">Privacy & Transparency</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-wrap">
          Locally Loop is a <strong>privacy-first</strong> productivity app. There are <em>no</em> backend
          servers, accounts, or analytics. All your data, sessions, logs, and audio,<br/>stays &ldquo;on
          device&rdquo; until you choose to share.<br className="mb-2"/>Only the text you type, plus a minimal context
          snippet, goes directly from your browser to the LLM provider you select.
        </p>
      </div>

      {/* Model Provider */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Lock /> Model Provider
          </CardTitle>
          <CardDescription className="text-base">
            Choose where your prompts are processed. Select OpenAI for hosted inference or point to your
            own self-hosted LLM endpoint to keep everything under your control.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={prefs.model}
            onValueChange={(v) =>
              setPrefs({ ...prefs, model: v as UserPrefs["model"] })
            }
          >
            <SelectTrigger id="model" className="w-full  dark:bg-background text-base">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI GPT‑4o</SelectItem>
              <SelectItem value="selfHosted">Google Gemini 2.5 Flash</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Voice Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Voice Input</CardTitle>
          <CardDescription className="text-base">
            Control what happens to raw audio recordings after transcription. On opt-in voice records are stored locally for listening them again later.<br/>If you want to see your records in your timeline(on device), opt it in
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label className="text-base">Keep Original Audio</Label>
          <Switch
            checked={prefs.saveVoice}
            onCheckedChange={(v) => setPrefs({ ...prefs, saveVoice: v })}
            aria-label="Toggle audio retention"
          />
        </CardContent>
      </Card>

      {/* Diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Diagnostics</CardTitle>
          <CardDescription className="text-base">
            Share anonymous logs to help. No personal data is included and helps developers improve this project. Default: Off. 
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label className="text-base">Enable Crash Reports</Label>
          <Switch
            checked={prefs.shareDiagnostics}
            onCheckedChange={(v) => setPrefs({ ...prefs, shareDiagnostics: v })}
            aria-label="Toggle crash reports"
          />
        </CardContent>
      </Card>

      <Separator />
      <p className="text-center text-base">
        No servers. No telemetry. Full privacy. Always local.
      </p>
    </div>
  );
}
