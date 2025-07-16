import { preloadWaveSurfer } from '@/components/command-input/lazyWavesurfer'
import { useCallback, useEffect, useRef, useState } from 'react'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
export interface RecorderOptions {
  /* WaveSurfer container (HTMLElement or selector) */
  container: HTMLElement | string
  /* Visual tweaks (safe defaults) */
  waveColor?            : string
  progressColor?        : string
  /* Record-plugin options we want to expose */
  scrollingWaveform?    : boolean
  continuousWaveform?   : boolean
  continuousWaveformDuration?: number
}

export interface RecorderApi {
  /* imperative commands */
  start                : (deviceId?: string) => Promise<void>
  stop                 : () => Promise<Blob | undefined>
  pause                : () => void
  resume               : () => void
  destroy              : () => void
  /* reactive state */
  status               : 'idle' | 'loading' | 'ready' | { error: unknown }
  isRecording          : boolean
  isPaused             : boolean
  progress             : number          // ms
  url?                 : string
  /* escape hatch */
  instance?            : import('wavesurfer.js').default | null
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */
export function useWaveSurferRecorder({
  container,
  waveColor             = 'rgb(200,0,200)',
  progressColor         = 'rgb(100,0,100)',
  scrollingWaveform     = false,
  continuousWaveform    = true,
  continuousWaveformDuration = 30,
}: RecorderOptions): RecorderApi {
  const [status     , setStatus     ] = useState<
    'idle' | 'loading' | 'ready' | { error: unknown }
  >('idle')
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused   , setIsPaused   ] = useState(false)
  const [progress   , setProgress   ] = useState(0)            // ms
  const [url        , setUrl        ] = useState<string>()

  /* 3rd-party refs kept outside React diff cycle */
  const waveSurferRef = useRef<import('wavesurfer.js').default | null>(null)
  const recorderRef   = useRef<any>(null)        // RecordPlugin’s TS defs lag behind

  /* ---------------------------------------------------------------------- */
  /* Ensure the libs are loaded + the instances exist                       */
  /* ---------------------------------------------------------------------- */
  const ensureReady = useCallback(async () => {
    if (status === 'ready') return
    if (status === 'loading') {
      await preloadWaveSurfer()                 // wait for whoever started loading
      return
    }

    try {
      setStatus('loading')
      const { WaveSurfer, RecordPlugin } = await preloadWaveSurfer()

      /* Tear down any previous instance – e.g., if caller changed options   */
      waveSurferRef.current?.destroy()

      waveSurferRef.current = WaveSurfer.create({
        container,
        waveColor,
        progressColor,
      })

      recorderRef.current = waveSurferRef.current?.registerPlugin(
        RecordPlugin.create({
          renderRecordedAudio      : false,
          scrollingWaveform,
          continuousWaveform,
          continuousWaveformDuration,
        }),
      )

      /* Events ----------------------------------------------------------- */
      recorderRef.current.on('record-progress', (t: number) => setProgress(t))

      recorderRef.current.on('record-end', (blob: Blob) => {
        setUrl(URL.createObjectURL(blob))
        setIsRecording(false)
        setIsPaused(false)
        setProgress(0)
      })

      setStatus('ready')
    } catch (err) {
      setStatus({ error: err })
      console.error('[useWaveSurferRecorder] load error →', err)
    }
  }, [
    status,
    container,
    waveColor,
    progressColor,
    scrollingWaveform,
    continuousWaveform,
    continuousWaveformDuration,
  ])

  /* ---------------------------------------------------------------------- */
  /* Public API                                                             */
  /* ---------------------------------------------------------------------- */
  const start = useCallback(async (deviceId?: string) => {
    await ensureReady()
    await recorderRef.current?.startRecording({ deviceId })
    setIsRecording(true)
    setIsPaused(false)
    setUrl(undefined)
  }, [ensureReady])

  const stop = useCallback(async () => {
    if (!recorderRef.current) return
    const blob: Blob | undefined = await recorderRef.current.stopRecording()
    return blob
  }, [])

  const pause  = useCallback(() => {
    recorderRef.current?.pauseRecording()
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    recorderRef.current?.resumeRecording()
    setIsPaused(false)
  }, [])

  const destroy = useCallback(() => {
    waveSurferRef.current?.destroy()
    waveSurferRef.current = null
  }, [])

  /* Clean up on unmount --------------------------------------------------- */
  useEffect(() => destroy, [destroy])

  return {
    /* imperative */
    start, stop, pause, resume, destroy,
    /* reactive   */
    status, isRecording, isPaused, progress, url,
    /* low-level  */
    instance: waveSurferRef.current,
  }
}
