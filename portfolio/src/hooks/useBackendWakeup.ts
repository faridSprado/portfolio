import { useEffect, useState } from "react"
import { pingBackendHealth } from "@/lib/api/health"

export type BackendWakeupStatus = "idle" | "checking" | "waking" | "ready"

interface UseBackendWakeupOptions {
  enabled?: boolean
  /**
   * Show the wakeup notice only if the backend/content request is still pending
   * after this delay. Normal latency should never show the notice.
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
  maxAttempts = 8,
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
    let noticeWasShown = false

    setStatus("checking")
    setShowNotice(false)

    const noticeTimer = window.setTimeout(() => {
      if (cancelled) return
      noticeWasShown = true
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

            if (noticeWasShown) {
              window.setTimeout(() => {
                if (!cancelled) setShowNotice(false)
              }, 900)
            } else {
              setShowNotice(false)
            }

            return
          }
        } catch {
          // Do not show false "down" states. This hook is only a wakeup helper.
        } finally {
          window.clearTimeout(timeout)
        }

        if (cancelled) return

        if (attempt < maxAttempts) {
          await sleep(retryDelayMs)
        }
      }

      // If health never confirms, stop showing the notice instead of claiming the
      // backend is down. The real user actions/chat already handle API errors.
      if (!cancelled) {
        window.clearTimeout(noticeTimer)
        setStatus("idle")
        setShowNotice(false)
      }
    }

    void runWakeup()

    return () => {
      cancelled = true
      window.clearTimeout(noticeTimer)
    }
  }, [enabled, maxAttempts, noticeDelayMs, requestTimeoutMs, retryDelayMs])

  return { status, showNotice }
}
