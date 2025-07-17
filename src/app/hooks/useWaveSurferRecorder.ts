import { preloadWaveSurfer } from '@/components/command-input/lazyWavesurfer';
import { useCallback, useEffect, useRef, useState } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import type RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

export interface RecorderOptions {
  container: HTMLElement | null; // Can be null initially
  waveColor?: string;
  progressColor?: string;
  scrollingWaveform?: boolean;
  continuousWaveform?: boolean;
}

export interface RecorderApi {
  start: (deviceId?: string) => Promise<void>;
  stop: () => Promise<Blob | undefined>;
  pause: () => void;
  resume: () => void;
  // --- FIX 1: Add destroy to the API ---
  destroy: () => Promise<void>;
  status: 'idle' | 'loading' | 'ready' | { error: unknown };
  isRecording: boolean;
  isPaused: boolean;
  progress: number; // in ms
  url?: string;
}

export function useWaveSurferRecorder({
  container,
  waveColor = '#00e701', // Using the --product color from your CSS
  progressColor = 'rgba(0, 231, 1, 1)',
  scrollingWaveform = false,
  continuousWaveform = true,
}: RecorderOptions): RecorderApi {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | { error: unknown }>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string>();

  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const recorderRef = useRef<RecordPlugin | null>(null);

  useEffect(() => {
    if (!container) return;

    let isCancelled = false;
    setStatus('loading');

    preloadWaveSurfer().then(({ WaveSurfer, RecordPlugin }) => {
      if (isCancelled) return;

      waveSurferRef.current?.destroy();
      waveSurferRef.current = WaveSurfer.create({
        container,
        waveColor,
        progressColor,
        height: 48,
        barWidth: 3,
        barGap: 2,
        barRadius: 2,
      });

      recorderRef.current = waveSurferRef.current.registerPlugin(
        RecordPlugin.create({ renderRecordedAudio: false, scrollingWaveform, continuousWaveform })
      );

      recorderRef.current.on('record-progress', (time: number) => setProgress(time));
      recorderRef.current.on('record-end', (blob: Blob) => {
        const newUrl = URL.createObjectURL(blob);
        setUrl(newUrl);
        setIsRecording(false);
        setIsPaused(false);
        setProgress(0);
      });

      setStatus('ready');
    }).catch(err => {
      console.error('[useWaveSurferRecorder] load error →', err);
      setStatus({ error: err });
    });

    return () => {
      isCancelled = true;
      waveSurferRef.current?.destroy();
    };
  }, [container, waveColor, progressColor, scrollingWaveform, continuousWaveform]);
  
  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url]);

  const start = useCallback(async (deviceId?: string) => {
    if (recorderRef.current && status === 'ready') {
      await recorderRef.current.startRecording({ deviceId });
      setIsRecording(true);
      setIsPaused(false);
      setUrl(undefined);
    }
  }, [status]);

  const stop = useCallback(async () => {
    return recorderRef.current?.stopRecording();
  }, []);

  const pause = useCallback(() => {
    if (recorderRef.current?.isRecording()) {
      recorderRef.current.pauseRecording();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (recorderRef.current?.isPaused()) {
      recorderRef.current.resumeRecording();
      setIsPaused(false);
    }
  }, []);

  // --- FIX 2: Implement the destroy function ---
  const destroy = useCallback(async () => {
    if (!recorderRef.current) return;
    
    // Stop recording, which triggers 'record-end' and sets a URL.
    await recorderRef.current.stopRecording();
    
    // Immediately discard the URL and reset state.
    setUrl(undefined);
    setIsRecording(false);
    setIsPaused(false);
    setProgress(0);
  }, []);

  return { start, stop, pause, resume, destroy, status, isRecording, isPaused, progress, url };
}