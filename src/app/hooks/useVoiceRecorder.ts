import { useState, useRef, useCallback, useEffect } from "react";

interface UseVoiceRecorderProps {
  onStop: (audioBlob: Blob) => void;
}

class DisposableStream {
  private stream: MediaStream;

  constructor(stream: MediaStream) {
    this.stream = stream;
  }

  stop() {
    this.stream.getTracks().forEach((track) => track.stop());
  }
}

class DisposableAudioNodes {
  private context: AudioContext;
  private analyser: AnalyserNode;
  private source: MediaStreamAudioSourceNode;
  private frameId?: number;

  constructor(stream: MediaStream, private onVolume: (v: number) => void) {
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 512;
    this.source = this.context.createMediaStreamSource(stream);
    this.source.connect(this.analyser);
    this.startVolumeLoop();
  }

  private startVolumeLoop() {
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    const loop = () => {
      this.analyser.getByteTimeDomainData(data);
      const sum = data.reduce((acc, val) => acc + Math.abs(val - 128), 0);
      this.onVolume(Math.min(1, sum / data.length / 50));
      this.frameId = requestAnimationFrame(loop);
    };
    loop();
  }

  dispose() {
    if (this.frameId !== undefined) {
      cancelAnimationFrame(this.frameId);
    }
    this.source.disconnect();
    this.analyser.disconnect();
    if (this.context.state !== "closed") {
      this.context.close().catch((e) => {
        console.error("Error closing AudioContext", e);
      });
    }
  }
}

class DisposableRecorder {
  private recorder: MediaRecorder;
  private chunks: Blob[] = [];

  constructor(stream: MediaStream, private onStop: (b: Blob) => void) {
    this.recorder = new MediaRecorder(stream);
    this.recorder.ondataavailable = (event) => {
      this.chunks.push(event.data);
    };
    this.recorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: "audio/webm" });
      this.onStop(blob);
    };
  }

  start() {
    this.chunks = [];
    this.recorder.start();
  }

  stop() {
    this.recorder.stop();
  }
}

export function useVoiceRecorder({ onStop }: UseVoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<"idle" | "recording" | "error">("idle");
  const [volume, setVolume] = useState(0);

  const streamDispRef = useRef<DisposableStream | null>(null);
  const audioDispRef = useRef<DisposableAudioNodes | null>(null);
  const recDispRef = useRef<DisposableRecorder | null>(null);

  const cleanup = useCallback(() => {
    audioDispRef.current?.dispose();
    streamDispRef.current?.stop();
    audioDispRef.current = null;
    streamDispRef.current = null;
    recDispRef.current = null;
    setVolume(0);
    setStatus("idle");
  }, []);

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamDispRef.current = new DisposableStream(stream);
        audioDispRef.current = new DisposableAudioNodes(stream, setVolume);
        recDispRef.current = new DisposableRecorder(stream, (blob) => {
          onStop(blob);
          setIsRecording(false);
        });

        recDispRef.current.start();
        setStatus("recording");
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
        setStatus("error");
        setIsRecording(false);
      });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [isRecording, cleanup, onStop]);

  const start = useCallback(() => {
    if (!isRecording) {
      setIsRecording(true);
    }
  }, [isRecording]);

  const stop = useCallback(
    (save: boolean) => {
      if (!isRecording) return;

      if (save) {
        recDispRef.current?.stop();
      } else {
        cleanup();
      }
      setIsRecording(false);
    },
    [isRecording, cleanup]
  );

  return { start, stop, isRecording, status, volume };
}
