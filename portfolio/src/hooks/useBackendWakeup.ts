import { useEffect, useState } from "react"
import { pingBackendHealth } from "@/lib/api/health"

export type BackendWakeupStatus = "idle" | "checking" | "waking" | "ready" | "error"

interface UseBackendWakeupOptions {
  enabled?: boolean
  /**
   * The notice should not appear for normal network latency.
   * It is shown only when the backend takes longer than this value.
   */
  noticeDelayMs?: number
  requestTimeoutMs?: number
  retryDelayMs?: number
  maxAttempts?: number
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export function useBackendWakeup({
  enabled = true,
  noticeDelayMs = 5_000,
  requestTimeoutMs = 8_000,
  retryDelayMs = 3_500,
  maxAttempts = 12,
}: UseBackendWakeupOptions = {}) {
  const [status, setStatus] = useState<BackendWakeupStatus>("idle")
  const [showNotice, setShowNotice] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setStatus("idle")
      setShowNotice(false)
      return
    }

    let cancelled = false
    let shouldShowWakeupNotice = false
    let readyHideTimer: number | undefined

    setStatus("checking")
    setShowNotice(false)

    const noticeTimer = window.setTimeout(() => {
      if (cancelled) return
      shouldShowWakeupNotice = true
      setStatus("waking")
      setShowNotice(true)
    }, noticeDelayMs)

    async function runWakeup() {
      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        const controller = new AbortController()
        const timeout = window.setTimeout(() => controller.abort(), requestTimeoutMs)

        try {
          const isHealthy = await pingBackendHealth(controller.signal)

          if (cancelled) return

          if (isHealthy) {
            window.clearTimeout(noticeTimer)
            setStatus("ready")

            // If the backend answered before noticeDelayMs, never show a popup.
            // If the notice was already visible, briefly confirm readiness and hide it.
            if (shouldShowWakeupNotice) {
              readyHideTimer = window.setTimeout(() => {
                if (!cancelled) setShowNotice(false)
              }, 1_200)
            } else {
              setShowNotice(false)
            }

            return
          }
        } catch {
          if (cancelled) return
        } finally {
          window.clearTimeout(timeout)
        }

        if (cancelled) return

        if (shouldShowWakeupNotice) {
          setStatus("waking")
          setShowNotice(true)
        }

        if (attempt < maxAttempts) {
          await sleep(retryDelayMs)
        }
      }

      if (!cancelled) {
        window.clearTimeout(noticeTimer)
        setStatus("error")
        setShowNotice(true)
      }
    }

    void runWakeup()

    return () => {
      cancelled = true
      window.clearTimeout(noticeTimer)
      if (readyHideTimer) window.clearTimeout(readyHideTimer)
    }
  }, [enabled, maxAttempts, noticeDelayMs, requestTimeoutMs, retryDelayMs])

  return { status, showNotice }
}
