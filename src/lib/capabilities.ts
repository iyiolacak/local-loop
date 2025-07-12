export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false

  const cores = navigator.hardwareConcurrency || 2
  const rawMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
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
