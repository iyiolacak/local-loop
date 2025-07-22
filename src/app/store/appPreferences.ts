import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

// --- Slice Interfaces ---

interface OnboardingSlice {
  onboardingStatus: "skipped" | "done" | "prompt";
  setOnboardingStatus: (status: "skipped" | "done" | "prompt") => void;
}

interface ApiKeySlice {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  clearApiKey: () => void;
  hasApiKey: () => boolean;
}

interface LocaleSlice {
  locale: string;
  setLocale: (locale: string) => void;
}

// --- Combined AppSettingsStore Type ---

type AppSettingsStore = OnboardingSlice & ApiKeySlice & LocaleSlice;

// --- Individual Slice Creators ---

const createOnboardingSlice: StateCreator<AppSettingsStore, [], [], OnboardingSlice> = (set) => ({
  onboardingStatus: "prompt",
  setOnboardingStatus: (status) => set({ onboardingStatus: status }),
});

const createApiKeySlice: StateCreator<AppSettingsStore, [], [], ApiKeySlice> = (set, get) => ({
  apiKey: null,
  setApiKey: (key) => set({ apiKey: key }),
  clearApiKey: () => set({ apiKey: null }),
  hasApiKey: () => get().apiKey !== null,
});

const createLocaleSlice: StateCreator<AppSettingsStore, [], [], LocaleSlice> = (set) => ({
  locale: "en",
  setLocale: (locale: string) => set({ locale }),
});

// --- Main AppSettings Store ---

export const useAppSettings = create<AppSettingsStore>()(
  persist(
    (...a) => ({
      ...createOnboardingSlice(...a),
      ...createApiKeySlice(...a),
      ...createLocaleSlice(...a),
    }),
    {
      name: "ll:app-settings", // key in localStorage
    }
  )
);