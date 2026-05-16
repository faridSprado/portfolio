import { CheckCircle2, Loader2 } from "lucide-react"
import type { BackendWakeupStatus } from "@/hooks/useBackendWakeup"

interface BackendWakeupNoticeProps {
  status: BackendWakeupStatus
  visible: boolean
}

export function BackendWakeupNotice({ status, visible }: BackendWakeupNoticeProps) {
  if (!visible) return null

  const isReady = status === "ready"

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 sm:bottom-6 sm:right-6 sm:left-auto sm:w-full sm:translate-x-0">
      <div className="aurora-card rounded-2xl border border-border/80 bg-card/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            {isReady ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-black text-foreground">
              {isReady ? "Copiloto listo" : "Despertando el copiloto..."}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {isReady
                ? "El backend ya está respondiendo."
                : "El backend gratuito puede tardar unos segundos si estuvo inactivo."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
