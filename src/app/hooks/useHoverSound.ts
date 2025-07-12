// useHoverSound.ts
import { useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ *
 *  Module-level singletons:                                          *
 *  – ctx        : a single AudioContext (lazy-created)               *
 *  – bufferCash : Map<url, Promise<AudioBuffer>>                     *
 * ------------------------------------------------------------------ */
let ctx: AudioContext | null = null;
const bufferCache = new Map<string, Promise<AudioBuffer>>();

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function useHoverSound(
  opts: { url?: string; volume?: number; cooldownMs?: number } = {}
) {
  const { url = "/sfx/button_hover.wav", volume = 1, cooldownMs = 150 } = opts;

  const gainRef = useRef<GainNode | null>(null);
  const lastPlay = useRef(0);
  const bufferRef = useRef<AudioBuffer | null>(null);

  /* preload & cache — runs once per URL across the whole app */
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard
    const audioCtx = getCtx();

    // prime gain node once
    gainRef.current ??= (() => {
      const g = audioCtx.createGain();
      g.connect(audioCtx.destination);
      return g;
    })();
    gainRef.current.gain.value = volume;

    // use cached promise if available
    let bufferPromise = bufferCache.get(url);
    if (!bufferPromise) {
      bufferPromise = fetch(url)
        .then((r) => r.arrayBuffer())
        .then((data) => audioCtx.decodeAudioData(data));
      bufferCache.set(url, bufferPromise);
    }

    bufferPromise
      .then((buf) => {
        bufferRef.current = buf;
      })
      .catch((e) => console.error("[useHoverSound] preload failed:", e));
  }, [url, volume]);

  /* play callback */
  return useCallback(() => {
    const now = performance.now();
    if (
      !bufferRef.current ||
      now - lastPlay.current < cooldownMs ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const audioCtx = getCtx();
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});

    const src = audioCtx.createBufferSource();
    src.buffer = bufferRef.current;
    src.connect(gainRef.current!);
    src.start(0, 0.03); // skip first 30 ms click
    lastPlay.current = now;
  }, [cooldownMs]);
}
