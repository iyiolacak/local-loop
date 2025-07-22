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
import { useTranslations } from "next-intl";

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
  const t = useTranslations('SettingsPage');

  // Auto-save preferences with a slight debounce
  useEffect(() => {
    const id = setTimeout(() => savePrefs(prefs), 200);
    return () => clearTimeout(id);
  }, [prefs]);


  return (
    <div className="mx-auto max-w-2xl p-6 space-y-10">
      <div>
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-wrap"
           dangerouslySetInnerHTML={{ __html: t.raw('description') }} />
      </div>

      {/* Model Provider */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Lock /> {t('modelProvider.title')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('modelProvider.description')}
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
              <SelectValue placeholder={t('modelProvider.selectPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">{t('modelProvider.openai')}</SelectItem>
              <SelectItem value="selfHosted">{t('modelProvider.gemini')}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Voice Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('voiceInput.title')}</CardTitle>
          <CardDescription className="text-base"
                           dangerouslySetInnerHTML={{ __html: t.raw('voiceInput.description') }} />
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label className="text-base">{t('voiceInput.keepAudio')}</Label>
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
          <CardTitle className="text-2xl">{t('diagnostics.title')}</CardTitle>
          <CardDescription className="text-base">
            {t('diagnostics.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label className="text-base">{t('diagnostics.enableCrashReports')}</Label>
          <Switch
            checked={prefs.shareDiagnostics}
            onCheckedChange={(v) => setPrefs({ ...prefs, shareDiagnostics: v })}
            aria-label="Toggle crash reports"
          />
        </CardContent>
      </Card>

      <Separator />
      <p className="text-center text-base">
        {t('footer')}
      </p>
    </div>
  );
}
