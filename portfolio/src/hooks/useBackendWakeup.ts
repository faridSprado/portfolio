import { useEffect, useState } from "react"
import { pingBackendHealth } from "@/lib/api/health"

export type BackendWakeupStatus = "idle" | "waking" | "ready" | "error"

interface UseBackendWakeupOptions {
  enabled?: boolean
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
  noticeDelayMs = 900,
  requestTimeoutMs = 4_000,
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
    let noticeWasShown = false
    let readyHideTimer: number | undefined

    const revealWakeupNotice = () => {
      if (cancelled) return
      noticeWasShown = true
      setStatus("waking")
      setShowNotice(true)
    }

    const noticeTimer = window.setTimeout(revealWakeupNotice, noticeDelayMs)

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

            readyHideTimer = window.setTimeout(() => {
              if (!cancelled) setShowNotice(false)
            }, noticeWasShown ? 1_500 : 0)

            return
          }
        } catch {
          if (cancelled) return
        } finally {
          window.clearTimeout(timeout)
        }

        if (cancelled) return

        revealWakeupNotice()

        if (attempt < maxAttempts) {
          await sleep(retryDelayMs)
        }
      }

      if (!cancelled) {
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
