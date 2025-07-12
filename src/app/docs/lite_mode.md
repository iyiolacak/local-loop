# 💡 Lite Mode for Local-Only Web Apps

This document outlines how to detect and adapt to low-end devices in a local-only React app, applying conditional UI logic to protect flow and performance.

---

## Goal

Gracefully disable or defer heavy UI features on underpowered devices while keeping the core input loop fast and responsive.

---

## Why This Matters

* Keeps performance silky on low-memory or low-core devices
* Preserves trust and responsiveness
* Avoids unintentional jank from animations or overlays

---

## Detection Logic

We use browser-native APIs:

* `navigator.hardwareConcurrency`: number of logical CPU cores
* `navigator.deviceMemory`: estimated RAM (in GB)
* `navigator.userAgent`: fallback check for old Android devices or known underperformers

### Detector Example (TypeScript)

```ts
export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false

  const cores = navigator.hardwareConcurrency || 2
  const rawMemory = navigator.deviceMemory
  const memory = typeof rawMemory === "number" ? rawMemory : 999
  const ua = navigator.userAgent.toLowerCase()

  const isLowCPU = cores <= 2
  const isLowMemory = memory <= 2
  const isOldAndroid = ua.includes("android") && !ua.includes("chrome")

  console.groupCollapsed("[LiteMode] Device Capability Check")
  console.log("• CPU cores:", cores)
  console.log("• RAM (GB):", rawMemory ?? "unknown")
  console.log("• UserAgent:", ua)
  console.log("• Low CPU:", isLowCPU)
  console.log("• Low Memory:", isLowMemory)
  console.log("• Old Android:", isOldAndroid)
  console.groupEnd()

  return isLowCPU || isLowMemory || isOldAndroid
}
```

---

## Hook Version: `useLiteMode()`

```ts
export function useLiteMode(): boolean {
  const [liteMode, setLiteMode] = useState(false)

  useEffect(() => {
    const result = isLowEndDevice()
    console.log(`[LiteMode] Device is ${result ? "LOW-END ⚠️" : "capable ✅"}`)
    setLiteMode(result)
  }, [])

  return liteMode
}
```

---

## Pattern to Use in JSX

```tsx
{liteMode ? null : <XPBlast />}
```

✅ This is **not** a double mount.
✅ React does not evaluate or render the component unless the condition is true.

---

## Scalable Wrapper Components

### `LiteOnly.tsx`

```tsx
const LiteOnly = ({ children }: { children: React.ReactNode }) => {
  const lite = useLiteMode()
  return lite ? null : <>{children}</>
}
```

Use as:

```tsx
<LiteOnly>
  <HeavyAnimation />
</LiteOnly>
```

---

## Better Alternatives?

For now, this is the cleanest and most scalable method:

* Uses **native browser signals**
* Uses **React best practices** (conditional rendering, not runtime flags)
* Avoids premature abstraction or runtime feature flags

If the app gets bigger:

* Consider global `LiteContext`
* Consider async `import()` with dynamic fallback
* Consider `requestIdleCallback` for deferred loading

But for current scale: **your setup is solid, proven, and lightweight.**

---

## Summary

| Step                    | Outcome                               |
| ----------------------- | ------------------------------------- |
| `isLowEndDevice()`      | Hard check for weak CPU/memory        |
| `useLiteMode()`         | Hook for React JSX logic              |
| `liteMode ? null : ...` | Efficient conditional rendering       |
| `<LiteOnly>`            | Clean wrapper pattern for optional UI |

This approach is safe, fast, and scalable for any local-first app that values responsiveness over visual excess on weaker hardware.
