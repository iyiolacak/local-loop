/**
 * A singleton dynamic-import helper that guarantees **exactly one**
 * network fetch for WaveSurfer + RecordPlugin, no matter how many callers.
 */
import type WaveSurferType   from 'wavesurfer.js'
import type RecordPluginType from 'wavesurfer.js/dist/plugins/record.esm.js'

let loadPromise:
  | Promise<{ WaveSurfer: typeof WaveSurferType; RecordPlugin: typeof RecordPluginType }>
  | undefined

export function preloadWaveSurfer() {
  if (loadPromise) return loadPromise           // cache hit

  loadPromise = Promise.all([
    import('wavesurfer.js'),
    import('wavesurfer.js/dist/plugins/record.esm.js'),
  ]).then(([w, r]) => ({
    WaveSurfer   : w.default as typeof WaveSurferType,
    RecordPlugin : r.default as typeof RecordPluginType,
  }))

  return loadPromise
}
