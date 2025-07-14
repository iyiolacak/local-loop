import { useEffect, useRef, useState } from 'react'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'
import { useWaveSurferRecorder } from '../hooks/useWaveformRecorder'
import { ActionButton } from '@/components/command-input/CommandForm'

export const RecorderDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [devices, setDevices]     = useState<MediaDeviceInfo[]>([])
  const [deviceId, setDeviceId]   = useState<string>('')

  const {
    status, isRecording, isPaused, progress, url,
    start, stop, pause, resume,
  } = useWaveSurferRecorder({
    container: containerRef.current as HTMLElement,
    scrollingWaveform : false,
    continuousWaveform: true,
  })

  /* Populate mic list once */
  useEffect(() => {
    RecordPlugin.getAvailableAudioDevices().then(setDevices)
  }, [])

  /* Helpers */
  const mmss = new Date(progress).toISOString().substring(14, 19)

  return (
    <div className="space-y-4">
      {/* live waveform */}
      <div ref={containerRef} className="absolute z-30 h-32 border rounded-md" />

      {/* controls */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={deviceId}
          onChange={e => setDeviceId(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">System default</option>
          {devices.map(d => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || d.deviceId}
            </option>
          ))}
        </select>

        <button
          className="btn"
          onClick={() => (isRecording || isPaused) ? stop() : start(deviceId)}
          disabled={status === 'loading'}
        >
          {isRecording || isPaused ? 'Stop' : 'Record'}
        </button>

        {isRecording && !isPaused && (
          <button onClick={pause}  className="btn">Pause</button>
        )}
        {isPaused && (
          <button onClick={resume} className="btn">Resume</button>
        )}

        <span className="tabular-nums w-[4ch]">{mmss}</span>
      </div>

      {/* playback & download */}
      {url && (
        <div className="space-x-2">
          <audio src={url} controls className="inline-block" />
          <a href={url} download="recording.webm" className="text-blue-600 underline">
            Download
          </a>
        </div>
      )}

      {/* optional: ActionButton integration */}
      <ActionButton
        voiceRecording={!isRecording}
        hasText={false}
        tooltipMain="Record a voice note"
        onClick={() => (isRecording || isPaused) ? stop() : start(deviceId)}
      />
    </div>
  )
}
