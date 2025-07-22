import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ApiKeyStore {
  apiKey: string | null;
  onboardingSkipped: boolean; // Flag to know if the user explicitly skipped the onboarding prompt
  setApiKey: (key: string | null) => void;
  setOnboardingSkipped: (skipped: boolean) => void;
  clearApiKey: () => void;
  hasApiKey: () => boolean;
}

export const useApiKey = create<ApiKeyStore>()(
  persist(
    (set, get) => ({
      apiKey: null,
      onboardingSkipped: false, // Default to false, so prompt shows on first load
      setApiKey: (key) => set({ apiKey: key }),
      setOnboardingSkipped: (skipped) => set({ onboardingSkipped: skipped }),
      clearApiKey: () => set({ apiKey: null }),
      hasApiKey: () => !!get().apiKey,
    }),
    {
      name: 'll:api-key-storage', // unique name for localStorage
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      version: 1, // A version number for migrations if schema changes
    }
  )
);
