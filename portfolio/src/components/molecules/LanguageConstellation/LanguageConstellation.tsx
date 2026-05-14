import { Code2, Orbit } from "lucide-react"
import type { LanguageEntry } from "@/types"

interface LanguageConstellationProps {
  languages: LanguageEntry[]
  compact?: boolean
}

export function LanguageConstellation({ languages, compact = false }: LanguageConstellationProps) {
  const visibleLanguages = languages.slice(0, compact ? 8 : 12)

  return (
    <section className={`aurora-card rounded-[1.5rem] ${compact ? "p-4" : "p-5"}`}>
      <div className="relative z-10">
        <div className={compact ? "mb-3 flex items-center justify-between gap-3" : "mb-4 flex items-center justify-between gap-3"}>
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Orbit className="h-4 w-4 text-primary" />
            Ecosistema técnico
          </div>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
            Multi-stack
          </span>
        </div>

        <div className={compact ? "grid grid-cols-2 gap-2" : "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3"}>
          {visibleLanguages.map((language) => (
            <div
              key={language.name}
              className={compact
                ? "group rounded-2xl border border-border bg-card/50 p-2.5 transition hover:border-primary/30 hover:bg-secondary/60"
                : "group rounded-2xl border border-border bg-card/50 p-3 transition hover:border-primary/30 hover:bg-secondary/60"}
              title={language.use}
            >
              <div className={compact
                ? "mb-2 flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-105"
                : "mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-105"}
              >
                <Code2 className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs font-black text-foreground">{language.name}</p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-muted-foreground">{language.use}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
