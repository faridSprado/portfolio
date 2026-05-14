import { useState } from "react"
import type { Project } from "@/types"
import { ExternalLink, Github, Maximize2, ArrowUpRight, Code2 } from "lucide-react"
import { ImageModal } from "@/components/atoms"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [modalImage, setModalImage] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary">
            <Code2 className="h-3.5 w-3.5" />
            Proyecto
          </div>
          <h3 className="text-xl font-black tracking-tight text-foreground">{project.title}</h3>
        </div>
        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition hover:scale-105"
            aria-label="Abrir proyecto"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>

      <p className="text-sm leading-7 text-foreground/82">{project.description}</p>

      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border bg-secondary/70 px-3 py-1.5 text-xs font-bold text-foreground/80"
          >
            {tech}
          </span>
        ))}
      </div>

      {project.images.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1 pt-1 scrollbar-thin">
          {project.images.map((img, index) => (
            <button key={index} className="group relative shrink-0 overflow-hidden rounded-2xl border border-border" onClick={() => setModalImage(img)}>
              <img
                src={img}
                alt={`${project.title} preview ${index + 1}`}
                className="h-40 w-auto object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45 opacity-0 transition group-hover:opacity-100">
                <Maximize2 className="h-6 w-6 text-white" />
              </div>
            </button>
          ))}
        </div>
      )}

      {(project.repoUrl ?? project.projectUrl) && (
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/70 px-3 py-2 text-xs font-black text-foreground transition hover:border-primary/30 hover:text-primary"
            >
              <Github className="h-3.5 w-3.5" />
              Repositorio
            </a>
          )}
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/70 px-3 py-2 text-xs font-black text-foreground transition hover:border-primary/30 hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ver proyecto
            </a>
          )}
        </div>
      )}

      <ImageModal src={modalImage || ""} alt={`${project.title} preview`} isOpen={!!modalImage} onClose={() => setModalImage(null)} />
    </div>
  )
}
