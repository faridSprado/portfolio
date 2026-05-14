import type { Experience } from "@/types"
import { ExternalLink, Calendar, Milestone } from "lucide-react"

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/12 text-accent">
          <Milestone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{experience.company}</p>
          <h3 className="mt-1 text-xl font-black tracking-tight text-foreground">{experience.role}</h3>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-3 py-1 text-xs font-bold text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {experience.period.start} - {experience.period.end}
          </div>
        </div>
      </div>

      <p className="text-sm leading-7 text-foreground/82">{experience.description}</p>

      <div className="flex flex-wrap gap-2">
        {experience.technologies.map((tech) => (
          <span key={tech} className="rounded-full border border-border bg-secondary/70 px-3 py-1.5 text-xs font-bold text-foreground/80">
            {tech}
          </span>
        ))}
      </div>

      {experience.companyUrl && (
        <a
          href={experience.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/70 px-3 py-2 text-xs font-black text-foreground transition hover:border-primary/30 hover:text-primary"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Ver referencia
        </a>
      )}
    </div>
  )
}
