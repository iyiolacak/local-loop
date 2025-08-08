import { useState, useRef, useCallback, useEffect } from "react";

interface UseVoiceRecorderProps {
  onStop: (audioBlob: Blob) => void; // called only when stop(save=true) and blob has data
  onError?: (err: Error) => void;    // optional
  onStart?: () => void;              // optional
  preferredMimeTypes?: string[];     // optional override
  timesliceMs?: number | null;       // optional; null => one chunk on stop
}

type Status = "idle" | "starting" | "recording" | "error";

function pickMimeType(preferred?: string[]) {
  const candidates =
    preferred && preferred.length
      ? preferred
      : [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/ogg;codecs=opus",
          "audio/ogg",
          "audio/mp4", // Safari sometimes supports this
        ];
  for (const t of candidates) {
    // Some browsers throw if you pass an unsupported mimeType to ctor
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(t)) return t;
  }
  return ""; // let browser choose default
}

export function useVoiceRecorder({
  onStop,
  onError,
  onStart,
  preferredMimeTypes,
  timesliceMs = null,
}: UseVoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Refs for disposables
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const suppressNextBlobRef = useRef(false);

  const clearRAF = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const stopTracks = (stream: MediaStream | null) => {
    stream?.getTracks().forEach((t) => {
      try {
        t.stop();
      } catch {}
    });
  };

  const disposeAudioGraph = async () => {
    clearRAF();
    try {
      sourceRef.current?.disconnect();
    } catch {}
    try {
      analyserRef.current?.disconnect();
    } catch {}
    sourceRef.current = null;
    analyserRef.current = null;

    // Close context to release device on iOS
    const ctx = ctxRef.current;
    ctxRef.current = null;
    if (ctx && ctx.state !== "closed") {
      try {
        await ctx.close();
      } catch {}
    }
  };

  const cleanupAll = useCallback(async () => {
    try {
      // Stop recorder without emitting blob
      const rec = recorderRef.current;
      recorderRef.current = null;
      if (rec && rec.state !== "inactive") {
        suppressNextBlobRef.current = true; // make sure onstop won't fire to consumer
        try {
          rec.stop();
        } catch {}
      }
      await disposeAudioGraph();
      stopTracks(streamRef.current);
    } finally {
      streamRef.current = null;
      chunksRef.current = [];
      setVolume(0);
      setIsRecording(false);
      setStatus("idle");
    }
  }, []);

  const start = useCallback(async () => {
    if (isRecording || status === "starting") return;
    setStatus("starting");
    setError(null);

    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Media devices API not available in this environment.");
      }

      // 1) Ask for mic
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2) Build audio graph for live volume meter
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      // iOS may require resume() on user gesture; if already running, no-op
      try {
        // It’s fine to await; resume is fast when not needed
        // @ts-ignore
        await ctx.resume?.();
      } catch {}
      ctxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        analyser.getByteTimeDomainData(data);
        // Compute a simple normalized amplitude (0..1)
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += Math.abs(data[i] - 128);
        setVolume(Math.min(1, sum / data.length / 50));
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);

      // 3) Build recorder
      const mimeType = pickMimeType(preferredMimeTypes);
      const rec =
        mimeType && MediaRecorder.isTypeSupported?.(mimeType)
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);

      chunksRef.current = [];
      suppressNextBlobRef.current = false;

      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || mimeType || "audio/webm" });
        const shouldEmit = !suppressNextBlobRef.current && blob.size > 0;
        chunksRef.current = [];
        if (shouldEmit) {
          try {
            onStop(blob);
          } catch (err) {
            onError?.(err as Error);
          }
        }
      };

      rec.onerror = (e: any) => {
        const err = e?.error instanceof Error ? e.error : new Error("Recorder error");
        setStatus("error");
        setIsRecording(false);
        onError?.(err);
      };

      recorderRef.current = rec;

      // 4) Start recording
      if (typeof timesliceMs === "number" && timesliceMs > 0) {
        rec.start(timesliceMs); // emit chunks periodically
      } else {
        rec.start(); // one chunk; we’ll gather on stop
      }

      onStart?.();
      setIsRecording(true);
      setStatus("recording");
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err.message);
      setStatus("error");
      setIsRecording(false);
      onError?.(err);
      // best effort cleanup if stream partially created
      await cleanupAll();
    }
  }, [cleanupAll, isRecording, onError, onStart, preferredMimeTypes, status, timesliceMs, onStop]);

  const stop = useCallback(
    async (save: boolean) => {
      // If not recording, nothing to do
      if (!isRecording && status !== "recording" && status !== "starting") return;

      const rec = recorderRef.current;
      // We always stop the recorder to free the mic; we just suppress blob if !save
      suppressNextBlobRef.current = !save;

      try {
        if (rec && rec.state !== "inactive") {
          await new Promise<void>((resolve) => {
            const done = () => resolve();
            // Make sure we resolve after onstop has fired
            const prevOnStop = rec.onstop;
            rec.onstop = (ev: Event) => {
              try {
                prevOnStop?.(ev as any);
              } finally {
                resolve();
              }
            };
            try {
              rec.stop();
            } catch {
              resolve();
            }
          });
        }
      } finally {
        await disposeAudioGraph();
        stopTracks(streamRef.current);
        streamRef.current = null;
        recorderRef.current = null;
        setIsRecording(false);
        setStatus("idle");
        setVolume(0);
      }
    },
    [isRecording, status]
  );

  // Unmount cleanup
  useEffect(() => {
    return () => {
      cleanupAll();
    };
  }, [cleanupAll]);

  return {
    start,
    stop,                // call stop(true) to emit blob, stop(false) to cancel
    cancel: () => stop(false),
    isRecording,
    status,
    volume,
    error,
  };
}
