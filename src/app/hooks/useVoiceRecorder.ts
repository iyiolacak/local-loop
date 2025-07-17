// src/app/hooks/useVoiceRecorder.ts
import { useState, useRef, useCallback, useEffect } from "react";

interface UseVoiceRecorderProps {
  onStop: (audioBlob: Blob) => void;
}

export function useVoiceRecorder({ onStop }: UseVoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<"idle" | "recording" | "error">( "idle");
  const [volume, setVolume] = useState(0); // Audio level from 0 to 1

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // For volume analysis
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    // Stop the animation loop
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }
    setVolume(0);

    // Disconnect audio nodes
    sourceRef.current?.disconnect();
    analyserRef.current?.disconnect();

    // Close AudioContext
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(e => console.error("Error closing AudioContext", e));
    }

    // Stop all tracks on the stream
    streamRef.current?.getTracks().forEach((track) => track.stop());

    // Clear refs
    mediaRecorderRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // --- Volume Analysis Setup ---
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512; // Small size for performance
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(dataArray);
        const sum = dataArray.reduce((acc, val) => acc + Math.abs(val - 128), 0);
        setVolume(Math.min(1, sum / dataArray.length / 50)); // Normalize and scale
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // --- Media Recorder Setup ---
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        onStop(audioBlob);
        cleanup(); // Cleanup is now called after onStop
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus("recording");

    } catch (err) {
      console.error("Error starting recording:", err);
      setStatus("error");
      cleanup();
    }
  }, [isRecording, onStop, cleanup]);

  const stop = useCallback((save: boolean) => {
    if (!mediaRecorderRef.current) return;
    
    setIsRecording(false);
    setStatus("idle");
    
    if (save) {
      mediaRecorderRef.current.stop(); // This will trigger onstop, which calls onStop(blob) and then cleanup
    } else {
      // Manually stop the stream and then cleanup, bypassing ondataavailable/onstop
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      cleanup();
    }
  }, [cleanup]);

  useEffect(() => {
    // Ensure cleanup happens on unmount if a recording is in progress
    return () => {
        if (mediaRecorderRef.current) {
            stop(false);
        }
    }
  }, [stop]);

  return { start, stop, isRecording, status, volume };
}