import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Utility: mask an API key as "sk-…ABCD" (show only suffix) */
export function maskKey(key?: string | null, suffix = 4) {
  if (!key) return "—";
  const vis = key.slice(-Math.max(0, Math.min(suffix, key.length)));
  return `sk-…${vis}`;
}

/** Utility: first difference index + small context window */
export function firstDiff(a: string, b: string) {
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (a[i] !== b[i]) {
      const start = Math.max(0, i - 3);
      const end = Math.min(max, i + 4);
      return {
        index: i,
        left: a.slice(start, end),
        right: b.slice(start, end),
      };
    }
  }
  return null; // identical
}

/** Utility: Levenshtein distance (iterative DP, O(mn) but small strings are fine) */
export function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
}
