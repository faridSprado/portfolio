import { cn } from "@/lib/utils"
import type { Message } from "@/types"
import { User, RefreshCw, Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatBubbleProps {
  message: Message
  onRetry?: () => void
}

export function ChatBubble({ message, onRetry }: ChatBubbleProps) {
  const isUser = message.role === "user"
  const hasRichContent = message.richContent !== undefined

  return (
    <div className={cn("flex w-full px-2 py-2", isUser ? "justify-end" : "justify-start")}>
      <article
        className={cn(
          "max-w-[92%] overflow-hidden rounded-[1.4rem] border shadow-sm backdrop-blur-xl sm:max-w-[78%]",
          isUser
            ? "border-primary/35 bg-primary text-primary-foreground shadow-primary/15"
            : "aurora-card text-foreground"
        )}
      >
        <div className={cn("relative z-10 flex gap-3 p-4 sm:p-5", isUser && "flex-row-reverse text-right")}>
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-sm font-black",
              isUser
                ? "bg-primary-foreground text-primary"
                : "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            )}
          >
            {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          </div>

          <div className={cn("min-w-0 flex-1", isUser ? "text-right" : "text-left")}>
            <p
              className={cn(
                "mb-1 text-xs font-black uppercase tracking-[0.18em]",
                isUser ? "text-primary-foreground/75" : "text-muted-foreground"
              )}
            >
              {isUser ? "Usuario" : "Asistente IA"}
            </p>
            {hasRichContent ? (
              <div className={cn("leading-relaxed", isUser ? "text-primary-foreground" : "text-foreground/90")}>{message.richContent}</div>
            ) : (
              <div
                className={cn(
                  "prose prose-sm max-w-none prose-p:mb-2 prose-p:last:mb-0",
                  isUser
                    ? "text-primary-foreground prose-p:text-primary-foreground prose-strong:text-primary-foreground prose-code:text-primary-foreground"
                    : "text-foreground/90 prose-p:text-foreground/90 prose-strong:text-foreground dark:prose-invert"
                )}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-7">{children}</p>,
                    ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 text-left">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 text-left">{children}</ol>,
                    li: ({ children }) => <li className="leading-7">{children}</li>,
                    strong: ({ children }) => <strong className="font-black">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    a: ({ href, children }) => (
                      <a href={href} className={cn("font-bold underline underline-offset-4", isUser ? "text-primary-foreground hover:text-primary-foreground/85" : "text-primary hover:text-primary/80")} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                    code: ({ children }) => (
                      <code className={cn("rounded-lg px-1.5 py-0.5 font-mono text-sm", isUser ? "bg-primary-foreground/15 text-primary-foreground" : "bg-secondary text-primary")}>
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className={cn("mb-2 overflow-x-auto rounded-2xl border p-4 text-left", isUser ? "border-primary-foreground/20 bg-primary-foreground/10" : "border-border bg-secondary/70")}>
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
            {message.hasError && onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive transition hover:bg-destructive/15"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}
