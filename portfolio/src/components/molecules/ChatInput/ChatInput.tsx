import { useState, type FormEvent, useRef, useEffect } from "react"
import { ArrowUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  disabledMessage?: string
}

export function ChatInput({ onSend, disabled, disabledMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [message])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const placeholder = disabled && disabledMessage ? disabledMessage : "Pregúntale al asistente sobre perfil, proyectos, habilidades o contacto..."

  return (
    <footer className="mx-auto w-full max-w-5xl px-4 pb-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="aurora-card rounded-[1.6rem] p-2 transition focus-within:border-primary/30 focus-within:shadow-[0_0_45px_hsl(var(--primary)/0.16)]"
      >
        <div className="relative z-10 flex items-end gap-3">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary sm:flex">
            <Sparkles className="h-4 w-4" />
          </div>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            aria-disabled={disabled}
            rows={1}
            className="min-h-10 max-h-[180px] flex-1 resize-none bg-transparent px-2 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all",
              message.trim() && !disabled
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 hover:bg-primary/90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            )}
            aria-label="Enviar mensaje"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </form>
      <p className="mt-2 text-center text-[11px] font-medium text-muted-foreground">
        Asistente experimental con RAG sobre el perfil de Farid.
      </p>
    </footer>
  )
}
