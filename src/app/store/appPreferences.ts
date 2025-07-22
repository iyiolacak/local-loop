import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type OnboardingStatus = "skipped" | "done" | "prompt";

interface AppSettingsStore {
  // ONBOARDING - Generally includes prompting API key
  onboardingStatus: OnboardingStatus;
  setOnboardingStatus: (status: OnboardingStatus) => void;

  // API KEY
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  clearApiKey: () => void;
  hasApiKey: () => boolean;

  // LANGUAGE
  language: string;
  setLanguage: (lang: string) => void;
}

const createLanguageSlice: StateCreator<
  AppSettingsStore,
  [],
  [],
  Pick<AppSettingsStore, "language" | "setLanguage">
> = (set) => ({
  language: "en",
  setLanguage: () => set((state) => ({ language: state.language })),
});

const useAppSettings = create<AppSettingsStore>()(
  persist(
    (set, get, ...a) => ({
      onboardingStatus: "prompt",
      setOnboardingStatus: (status) => set({ onboardingStatus: status }),

      apiKey: null,
      setApiKey: (key) => set({ apiKey: key }),
      clearApiKey: () => set({ apiKey: null }),
      hasApiKey: () => get().apiKey !== null,

      ...createLanguageSlice(set, get, ...a),
    }),
    {
      name: "ll:app-settings", // key in localStorage
    }
  )
);
