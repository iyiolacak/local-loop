import { useCallback, useEffect, useRef, useState } from "react"

export interface AudioOptions {
  fftSize?: 256 | 512 | 1024 | 2048              // power-of-2 only
  smoothing?: number                              // 0 … 1 – temporal averaging
}

export function useAudioRecorder({ fftSize = 1024, smoothing = 0.8 }: AudioOptions = {}) {
  const [isRecording, setRecording] = useState(false)
  const analyserRef = useRef<AnalyserNode | null>(null)

  /* start / stop ----------------------------------------------------------- */
  const start = useCallback(async () => {
    if (isRecording) return
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const ctx = new AudioContext()
    const source = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = fftSize
    analyser.smoothingTimeConstant = smoothing
    source.connect(analyser)
    analyserRef.current = analyser
    setRecording(true)
  }, [isRecording, fftSize, smoothing])

  const stop = useCallback(() => {
    analyserRef.current?.context?.close()
    analyserRef.current = null
    setRecording(false)
  }, [])

  /* expose ----------------------------------------------------------------- */
  const getTimeDomain = useCallback(() => {
    const analyser = analyserRef.current
    if (!analyser) return null
    const buf = new Uint8Array(analyser.fftSize)
    analyser.getByteTimeDomainData(buf)
    return buf
  }, [])

  const getFrequency = useCallback(() => {
    const analyser = analyserRef.current
    if (!analyser) return null
    const buf = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(buf)
    return buf
  }, [])

  /* clean-up on unmount ----------------------------------------------------- */
  useEffect(() => stop, [stop])

  return { isRecording, start, stop, getTimeDomain, getFrequency }
}
