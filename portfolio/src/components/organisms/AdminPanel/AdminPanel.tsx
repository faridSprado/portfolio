import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Code2,
  Eye,
  KeyRound,
  Plus,
  Save,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";
import { defaultPortfolioContent } from "@/data/defaultContent";
import {
  fetchAdminPortfolioContent,
  savePortfolioContent,
} from "@/lib/api/content";
import { cn } from "@/lib/utils";
import { usePortfolioContentStore } from "@/store/contentStore";
import type { Experience, PortfolioContent, Project } from "@/types";

const SESSION_KEY = "portfolio_admin_secret";

type AdminTab = "profile" | "projects" | "experience" | "languages" | "json";

const tabs: Array<{ id: AdminTab; label: string; icon: typeof UserRound }> = [
  { id: "profile", label: "Perfil", icon: UserRound },
  { id: "projects", label: "Proyectos", icon: Code2 },
  { id: "experience", label: "Trayectoria", icon: Briefcase },
  { id: "languages", label: "Lenguajes", icon: Eye },
  { id: "json", label: "JSON", icon: Save },
];

function splitList(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(value: string[]): string {
  return value.join("\n");
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`;
}

function createProject(): Project {
  return {
    id: createId("project"),
    title: "Nuevo proyecto",
    description: "Describe el problema, tu solución, el stack y el resultado.",
    technologies: ["TypeScript", "Python"],
    repoUrl: "",
    projectUrl: "",
    images: [],
  };
}

function createExperience(): Experience {
  return {
    id: createId("experience"),
    company: "Nueva etapa",
    role: "Rol o formación",
    period: { start: "Inicio", end: "Fin" },
    description:
      "Describe qué hiciste, qué aprendiste y qué tecnologías usaste.",
    technologies: ["Producto", "IA"],
    companyUrl: "",
  };
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  placeholder?: string;
}

function TextField({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: TextFieldProps) {
  const inputClass =
    "mt-2 w-full rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10";

  return (
    <label className="block text-sm font-bold text-foreground">
      {label}
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={5}
          className={inputClass}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </label>
  );
}

export function AdminPanel() {
  const setGlobalContent = usePortfolioContentStore(
    (state) => state.setContent,
  );
  const [secret, setSecret] = useState(
    () => sessionStorage.getItem(SESSION_KEY) ?? "",
  );
  const [isUnlocked, setUnlocked] = useState(Boolean(secret));
  const [content, setContent] = useState<PortfolioContent>(
    defaultPortfolioContent,
  );
  const [tab, setTab] = useState<AdminTab>("profile");
  const [selectedProjectId, setSelectedProjectId] = useState(
    defaultPortfolioContent.projects[0]?.id ?? "",
  );
  const [selectedExperienceId, setSelectedExperienceId] = useState(
    defaultPortfolioContent.experiences[0]?.id ?? "",
  );
  const [jsonDraft, setJsonDraft] = useState(() =>
    JSON.stringify(defaultPortfolioContent, null, 2),
  );
  const [status, setStatus] = useState<{
    type: "idle" | "ok" | "error";
    text: string;
  }>({
    type: "idle",
    text: "",
  });

  const selectedProject = useMemo(
    () =>
      content.projects.find((project) => project.id === selectedProjectId) ??
      content.projects[0],
    [content.projects, selectedProjectId],
  );

  const selectedExperience = useMemo(
    () =>
      content.experiences.find(
        (experience) => experience.id === selectedExperienceId,
      ) ?? content.experiences[0],
    [content.experiences, selectedExperienceId],
  );

  useEffect(() => {
    setJsonDraft(JSON.stringify(content, null, 2));
  }, [content]);

  useEffect(() => {
    if (!isUnlocked || !secret) return;

    fetchAdminPortfolioContent(secret.trim())
      .then((remoteContent) => {
        setContent(remoteContent);
        setGlobalContent(remoteContent);
        setSelectedProjectId(remoteContent.projects[0]?.id ?? "");
        setSelectedExperienceId(remoteContent.experiences[0]?.id ?? "");
        setStatus({ type: "ok", text: "Contenido cargado." });
      })
      .catch(() => {
        setUnlocked(false);
        sessionStorage.removeItem(SESSION_KEY);
        setStatus({
          type: "error",
          text: "No se pudo validar el acceso privado.",
        });
      });
  }, [isUnlocked, secret, setGlobalContent]);

  const unlock = () => {
    const normalizedSecret = secret.trim();
    if (!normalizedSecret) {
      setStatus({ type: "error", text: "Ingresa el ADMIN_SECRET configurado en el backend." });
      return;
    }
    setSecret(normalizedSecret);
    sessionStorage.setItem(SESSION_KEY, normalizedSecret);
    setUnlocked(true);
  };

  const updateContent = (
    updater: (current: PortfolioContent) => PortfolioContent,
  ) => {
    setContent((current) => updater(current));
  };

  const save = async () => {
    try {
      const saved = await savePortfolioContent(content, secret.trim());
      setContent(saved);
      setGlobalContent(saved);
      setStatus({ type: "ok", text: "Cambios guardados y publicados." });
    } catch {
      setStatus({ type: "error", text: "No se pudieron guardar los cambios." });
    }
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonDraft) as PortfolioContent;
      setContent(parsed);
      setStatus({
        type: "ok",
        text: "JSON aplicado en el editor. Guarda para publicarlo.",
      });
    } catch {
      setStatus({ type: "error", text: "El JSON no es válido." });
    }
  };

  const addProject = () => {
    const project = createProject();
    updateContent((current) => ({
      ...current,
      projects: [...current.projects, project],
    }));
    setSelectedProjectId(project.id);
    setTab("projects");
  };

  const deleteProject = (id: string) => {
    updateContent((current) => ({
      ...current,
      projects: current.projects.filter((project) => project.id !== id),
    }));
    setSelectedProjectId(
      content.projects.find((project) => project.id !== id)?.id ?? "",
    );
  };

  const updateProject = (id: string, patch: Partial<Project>) => {
    updateContent((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === id ? { ...project, ...patch } : project,
      ),
    }));
  };

  const addExperience = () => {
    const experience = createExperience();
    updateContent((current) => ({
      ...current,
      experiences: [...current.experiences, experience],
    }));
    setSelectedExperienceId(experience.id);
    setTab("experience");
  };

  const deleteExperience = (id: string) => {
    updateContent((current) => ({
      ...current,
      experiences: current.experiences.filter(
        (experience) => experience.id !== id,
      ),
    }));
    setSelectedExperienceId(
      content.experiences.find((experience) => experience.id !== id)?.id ?? "",
    );
  };

  const updateExperience = (id: string, patch: Partial<Experience>) => {
    updateContent((current) => ({
      ...current,
      experiences: current.experiences.map((experience) =>
        experience.id === id ? { ...experience, ...patch } : experience,
      ),
    }));
  };

  if (!isUnlocked) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
        <section className="aurora-card w-full max-w-lg rounded-[2rem] p-8">
          <div className="relative z-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              Editor privado
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Ingresa tu clave de administración para actualizar perfil,
              proyectos, ruta y ecosistema técnico.
            </p>
            <TextField
              label="Contraseña de administrador:"
              value={secret}
              onChange={setSecret}
              placeholder="Contraseña aquí"
            />
            <button
              onClick={unlock}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground transition hover:bg-primary/90"
            >
              Entrar
            </button>
            {status.text && (
              <p className="mt-4 text-sm font-semibold text-destructive">
                {status.text}
              </p>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2 text-sm font-bold transition hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Ver portfolio
          </a>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-black">Panel de contenido</h1>
            <p className="text-xs text-muted-foreground">
              Edita, agrega, elimina y publica cambios sin tocar código.
            </p>
          </div>
          <button
            onClick={save}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-black text-primary-foreground transition hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            Guardar
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-3">
          <div className="aurora-card rounded-[1.5rem] p-4">
            <div className="relative z-10 space-y-2">
              {tabs.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition",
                      tab === item.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="aurora-card rounded-[1.5rem] p-4">
            <div className="relative z-10 flex items-start gap-3 text-sm">
              {status.type === "ok" ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
              ) : status.type === "error" ? (
                <XCircle className="mt-0.5 h-5 w-5 text-destructive" />
              ) : (
                <Eye className="mt-0.5 h-5 w-5 text-muted-foreground" />
              )}
              <p className="leading-6 text-muted-foreground">
                {status.text ||
                  "Los cambios se publican cuando presionas Guardar."}
              </p>
            </div>
          </div>
        </aside>

        <section className="aurora-card rounded-[2rem] p-5 sm:p-7">
          <div className="relative z-10 space-y-6">
            {tab === "profile" && (
              <div className="grid gap-5 lg:grid-cols-2">
                <TextField
                  label="Nombre completo"
                  value={content.profile.name}
                  onChange={(name) =>
                    updateContent((current) => ({
                      ...current,
                      profile: { ...current.profile, name },
                      site: { ...current.site, name },
                    }))
                  }
                />
                <TextField
                  label="Nombre corto"
                  value={content.profile.shortName}
                  onChange={(shortName) =>
                    updateContent((current) => ({
                      ...current,
                      profile: { ...current.profile, shortName },
                    }))
                  }
                />
                <TextField
                  label="Headline"
                  value={content.profile.headline}
                  onChange={(headline) =>
                    updateContent((current) => ({
                      ...current,
                      profile: { ...current.profile, headline },
                    }))
                  }
                />
                <TextField
                  label="Estado visible"
                  value={content.profile.status}
                  onChange={(statusValue) =>
                    updateContent((current) => ({
                      ...current,
                      profile: { ...current.profile, status: statusValue },
                    }))
                  }
                />
                <TextField
                  label="Intro principal"
                  value={content.profile.intro}
                  onChange={(intro) =>
                    updateContent((current) => ({
                      ...current,
                      profile: { ...current.profile, intro },
                    }))
                  }
                  textarea
                />
                <TextField
                  label="About conversacional"
                  value={content.about}
                  onChange={(about) =>
                    updateContent((current) => ({ ...current, about }))
                  }
                  textarea
                />
                <TextField
                  label="Highlights, uno por línea"
                  value={joinList(content.profile.highlights)}
                  onChange={(value) =>
                    updateContent((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        highlights: splitList(value),
                      },
                    }))
                  }
                  textarea
                />
                <TextField
                  label="Skills, una por línea"
                  value={joinList(content.profile.skills)}
                  onChange={(value) =>
                    updateContent((current) => ({
                      ...current,
                      profile: { ...current.profile, skills: splitList(value) },
                    }))
                  }
                  textarea
                />
              </div>
            )}

            {tab === "projects" && (
              <div className="grid gap-5 xl:grid-cols-[260px_1fr]">
                <div className="space-y-2">
                  <button
                    onClick={addProject}
                    className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-black text-primary-foreground"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar proyecto
                  </button>
                  {content.projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={cn(
                        "w-full rounded-2xl border px-3 py-3 text-left text-sm font-bold transition",
                        selectedProject?.id === project.id
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-card/50 hover:bg-secondary",
                      )}
                    >
                      {project.title}
                    </button>
                  ))}
                </div>

                {selectedProject && (
                  <div className="grid gap-5 lg:grid-cols-2">
                    <TextField
                      label="Título"
                      value={selectedProject.title}
                      onChange={(title) =>
                        updateProject(selectedProject.id, { title })
                      }
                    />
                    <TextField
                      label="ID"
                      value={selectedProject.id}
                      onChange={(id) => {
                        updateProject(selectedProject.id, { id });
                        setSelectedProjectId(id);
                      }}
                    />
                    <TextField
                      label="Repositorio"
                      value={selectedProject.repoUrl ?? ""}
                      onChange={(repoUrl) =>
                        updateProject(selectedProject.id, { repoUrl })
                      }
                    />
                    <TextField
                      label="Demo / URL"
                      value={selectedProject.projectUrl ?? ""}
                      onChange={(projectUrl) =>
                        updateProject(selectedProject.id, { projectUrl })
                      }
                    />
                    <TextField
                      label="Descripción"
                      value={selectedProject.description}
                      onChange={(description) =>
                        updateProject(selectedProject.id, { description })
                      }
                      textarea
                    />
                    <TextField
                      label="Tecnologías, una por línea"
                      value={joinList(selectedProject.technologies)}
                      onChange={(value) =>
                        updateProject(selectedProject.id, {
                          technologies: splitList(value),
                        })
                      }
                      textarea
                    />
                    <TextField
                      label="Imágenes, una URL/ruta por línea"
                      value={joinList(selectedProject.images)}
                      onChange={(value) =>
                        updateProject(selectedProject.id, {
                          images: splitList(value),
                        })
                      }
                      textarea
                    />
                    <button
                      onClick={() => deleteProject(selectedProject.id)}
                      className="inline-flex items-center justify-center gap-2 self-end rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-black text-destructive transition hover:bg-destructive/15"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar proyecto
                    </button>
                  </div>
                )}
              </div>
            )}

            {tab === "experience" && (
              <div className="grid gap-5 xl:grid-cols-[260px_1fr]">
                <div className="space-y-2">
                  <button
                    onClick={addExperience}
                    className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-black text-primary-foreground"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar etapa
                  </button>
                  {content.experiences.map((experience) => (
                    <button
                      key={experience.id}
                      onClick={() => setSelectedExperienceId(experience.id)}
                      className={cn(
                        "w-full rounded-2xl border px-3 py-3 text-left text-sm font-bold transition",
                        selectedExperience?.id === experience.id
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-card/50 hover:bg-secondary",
                      )}
                    >
                      {experience.role}
                    </button>
                  ))}
                </div>

                {selectedExperience && (
                  <div className="grid gap-5 lg:grid-cols-2">
                    <TextField
                      label="Rol"
                      value={selectedExperience.role}
                      onChange={(role) =>
                        updateExperience(selectedExperience.id, { role })
                      }
                    />
                    <TextField
                      label="Compañía / contexto"
                      value={selectedExperience.company}
                      onChange={(company) =>
                        updateExperience(selectedExperience.id, { company })
                      }
                    />
                    <TextField
                      label="Inicio"
                      value={selectedExperience.period.start}
                      onChange={(start) =>
                        updateExperience(selectedExperience.id, {
                          period: { ...selectedExperience.period, start },
                        })
                      }
                    />
                    <TextField
                      label="Fin"
                      value={selectedExperience.period.end}
                      onChange={(end) =>
                        updateExperience(selectedExperience.id, {
                          period: { ...selectedExperience.period, end },
                        })
                      }
                    />
                    <TextField
                      label="Referencia URL"
                      value={selectedExperience.companyUrl ?? ""}
                      onChange={(companyUrl) =>
                        updateExperience(selectedExperience.id, { companyUrl })
                      }
                    />
                    <TextField
                      label="Descripción"
                      value={selectedExperience.description}
                      onChange={(description) =>
                        updateExperience(selectedExperience.id, { description })
                      }
                      textarea
                    />
                    <TextField
                      label="Tecnologías/temas, uno por línea"
                      value={joinList(selectedExperience.technologies)}
                      onChange={(value) =>
                        updateExperience(selectedExperience.id, {
                          technologies: splitList(value),
                        })
                      }
                      textarea
                    />
                    <button
                      onClick={() => deleteExperience(selectedExperience.id)}
                      className="inline-flex items-center justify-center gap-2 self-end rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-black text-destructive transition hover:bg-destructive/15"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar etapa
                    </button>
                  </div>
                )}
              </div>
            )}

            {tab === "languages" && (
              <div className="space-y-5">
                <TextField
                  label="Ecosistema técnico"
                  value={content.languageEcosystem
                    .map((item) => `${item.name} :: ${item.use}`)
                    .join("\n")}
                  onChange={(value) =>
                    updateContent((current) => ({
                      ...current,
                      languageEcosystem: value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line) => {
                          const [name, ...rest] = line.split("::");
                          return {
                            name: name.trim(),
                            use:
                              rest.join("::").trim() ||
                              "Uso dentro del proyecto",
                          };
                        }),
                    }))
                  }
                  textarea
                  placeholder="TypeScript :: Frontend y tipos"
                />
                <p className="text-sm leading-7 text-muted-foreground">
                  Formato recomendado:{" "}
                  <code>Lenguaje :: Uso dentro del proyecto</code>. Esto
                  alimenta la tarjeta visual del inicio y el contexto del
                  asistente.
                </p>
              </div>
            )}

            {tab === "json" && (
              <div className="space-y-4">
                <textarea
                  value={jsonDraft}
                  onChange={(event) => setJsonDraft(event.target.value)}
                  className="min-h-[60vh] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                />
                <button
                  onClick={applyJson}
                  className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-black transition hover:bg-secondary"
                >
                  Aplicar JSON al editor
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
