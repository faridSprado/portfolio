import { useRef, useEffect, useState, useCallback } from "react";
import { useChatStore } from "@/store/chatStore";
import { usePortfolioContentStore } from "@/store/contentStore";
import { ChatBubble } from "../../molecules/ChatBubble/ChatBubble";
import { ChatInput } from "../../molecules/ChatInput/ChatInput";
import { LanguageConstellation } from "@/components/molecules/LanguageConstellation";
import {
  PanelLeft,
  Mail,
  Sparkles,
  Code2,
  BrainCircuit,
  GraduationCap,
  ArrowRight,
  Cpu,
} from "lucide-react";
import {
  contactSchema,
  emailSchema,
  messageSchema,
  nameSchema,
} from "@/lib/contactValidation";
import { sendContactEmail } from "@/lib/api/contact";
import { streamChatMessage } from "@/lib/api/chat";
import {
  contactAskEmail,
  contactAskMessage,
  contactFlowIntro,
  contactSuccessMessage,
  contactSendErrorMessage,
} from "@/data/contact";
import { sendProjectMessages, sendExperienceMessages } from "@/lib/chatHelpers";
import { simulateTypingDelay } from "@/lib/utils";
import heroAvatar from "@/assets/avatar-4.png";
import type { PortfolioContent } from "@/types";

interface WelcomeScreenProps {
  onProjects: () => void;
  onExperience: () => void;
  onContact: () => void;
  onPrompt: (prompt: string) => void;
  avatarSrc?: string;
  avatarAlt?: string;
  content: PortfolioContent;
}

function WelcomeScreen({
  onProjects,
  onExperience,
  onContact,
  onPrompt,
  avatarSrc,
  avatarAlt,
  content,
}: WelcomeScreenProps) {
  const quickPrompts = [
    {
      label: "Presentación ejecutiva detallada",
      value: "Preséntame a Farid de forma ejecutiva y detallada para un reclutador de proyectos.",
    },
    {
      label: "Ruta de enfoque personal sobre la IA",
      value:
        "Explícame la ruta de enfoque personal de Farid sobre inteligencia artificial y qué tipo de oportunidades busca.",
    },
    {
      label: "Valor diferencial",
      value:
        "¿Qué hace diferente a Farid frente a otros perfiles junior de tecnología?",
    },
  ];

  const cards = [
    {
      icon: <GraduationCap className="h-5 w-5" />,
      label: "Base",
      title: content.profile.highlights[0] ?? "Ingeniería Multimedia",
      text: "Criterio técnico y creativo para construir experiencias digitales completas.",
    },
    {
      icon: <BrainCircuit className="h-5 w-5" />,
      label: "Foco",
      title: content.profile.highlights[1] ?? "Inteligencia Artificial",
      text: "RAG, asistentes inteligentes, automatización y modelos generativos.",
    },
    {
      icon: <Code2 className="h-5 w-5" />,
      label: "Producto",
      title: content.profile.highlights[2] ?? "Fullstack + UX",
      text: "Interfaz, backend, APIs y narrativa de producto para ideas que se pueden usar.",
    },
  ];

  const resolvedAvatarSrc = avatarSrc ?? heroAvatar;
  const resolvedAvatarAlt = avatarAlt ?? content.profile.avatarAlt;
  const nameParts = content.profile.name.trim().split(/\s+/);
  const heroFirstLine = nameParts.slice(0, 2).join(" ") || content.profile.shortName;
  const heroSecondLine = nameParts.slice(2).join(" ");

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8 scrollbar-thin">
      <div className="mx-auto flex min-h-full w-full max-w-7xl items-center">
        <div className="grid w-full gap-4 xl:grid-cols-[minmax(0,1fr)_390px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="aurora-card rounded-[2rem] p-5 sm:p-7 lg:p-8">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary sm:text-xs sm:tracking-[0.22em]">
                <Sparkles className="h-3.5 w-3.5" />
                Portfolio evolutivo con asistente de IA
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-center">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Hola, soy
                  </p>
                  <h1 className="mt-2 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl xl:text-6xl">
                    <span className="gradient-text block whitespace-normal">
                      {heroFirstLine}
                    </span>
                    {heroSecondLine && (
                      <span className="block whitespace-normal text-foreground">
                        {heroSecondLine}
                      </span>
                    )}
                  </h1>

                  <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                    {content.profile.intro}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={onProjects}
                      className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:scale-[1.02] hover:bg-primary/90"
                    >
                      Ver proyectos
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={onExperience}
                      className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/70 px-5 py-3 text-sm font-bold text-foreground transition hover:bg-secondary"
                    >
                      Trayectoria profesional
                    </button>
                    <button
                      onClick={onContact}
                      className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/70 px-5 py-3 text-sm font-bold text-foreground transition hover:bg-secondary"
                    >
                      <Mail className="h-4 w-4" />
                      Contacto
                    </button>
                  </div>
                </div>

                <div className="mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-[2rem] border border-border bg-secondary glow-ring sm:h-40 sm:w-40 lg:mx-0 lg:justify-self-end xl:h-44 xl:w-44">
                  <img
                    src={resolvedAvatarSrc}
                    alt={resolvedAvatarAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {cards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-[1.25rem] border border-border bg-card/45 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                        {card.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                          {card.label}
                        </p>
                        <h3 className="mt-1 text-sm font-black text-foreground">
                          {card.title}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {card.text}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1">
            <LanguageConstellation languages={content.languageEcosystem} compact />

            <div className="aurora-card rounded-[1.5rem] p-4">
              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <Cpu className="h-4 w-4 text-primary" />
                  Preguntas rápidas
                </div>
                <div className="flex flex-col gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt.label}
                      onClick={() => onPrompt(prompt.value)}
                      className="neon-suggestion rounded-2xl border border-border bg-card/50 px-4 py-3 text-left text-sm font-semibold text-foreground transition hover:border-primary/30"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function ChatInterface() {
  const {
    messages,
    addMessage,
    isTyping,
    sidebarOpen,
    toggleSidebar,
    setTyping,
    contactFlowStep,
    contactData,
    setContactFlowStep,
    setContactData,
    resetContactFlow,
    startContactFlow,
    currentSection,
    setCurrentSection,
    startStreamingMessage,
    appendToStreamingMessage,
    markMessageAsError,
  } = useChatStore();
  const content = usePortfolioContentStore((state) => state.content);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string>("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const sendStreamingMessage = useCallback(
    (message: string) => {
      setTyping(true);
      const messageId = startStreamingMessage("");

      streamChatMessage(message, (chunk) => {
        appendToStreamingMessage(messageId, chunk);
      })
        .catch((error: Error) => {
          console.error("Chat API error:", error);
          markMessageAsError(messageId);
          const errorMsg =
            error.message.includes("Failed to fetch") ||
            error.message.includes("net::")
              ? "\n\nNo pude conectar con el backend. Revisa que la API esté activa e intenta de nuevo."
              : "\n\nNo pude generar la respuesta. Revisa la API key del modelo en el backend e intenta de nuevo.";
          appendToStreamingMessage(messageId, errorMsg);
        })
        .finally(() => {
          setTyping(false);
        });
    },
    [
      setTyping,
      startStreamingMessage,
      appendToStreamingMessage,
      markMessageAsError,
    ],
  );

  const handleSend = (input: string) => {
    addMessage({ role: "user", content: input });

    if (contactFlowStep !== null && currentSection === "contact") {
      switch (contactFlowStep) {
        case "name": {
          const result = nameSchema.safeParse(input);
          if (result.success) {
            setContactData({ name: result.data });
            simulateTypingDelay(setTyping, () => {
              addMessage({
                role: "assistant",
                content: contactAskEmail(result.data),
                contentType: "contact",
              });
              setContactFlowStep("email");
            });
          } else {
            simulateTypingDelay(setTyping, () => {
              addMessage({
                role: "assistant",
                content:
                  result.error.issues[0]?.message ?? "El nombre es inválido.",
                contentType: "contact",
              });
            });
          }
          break;
        }
        case "email": {
          const result = emailSchema.safeParse(input);
          if (result.success) {
            setContactData({ email: result.data });
            simulateTypingDelay(setTyping, () => {
              addMessage({
                role: "assistant",
                content: contactAskMessage,
                contentType: "contact",
              });
              setContactFlowStep("message");
            });
          } else {
            simulateTypingDelay(setTyping, () => {
              addMessage({
                role: "assistant",
                content:
                  result.error.issues[0]?.message ?? "El email es inválido.",
                contentType: "contact",
              });
            });
          }
          break;
        }
        case "message": {
          const result = messageSchema.safeParse(input);
          if (result.success) {
            setContactData({ consulta: result.data });
            const finalData = {
              name: contactData.name ?? "",
              email: contactData.email ?? "",
              consulta: result.data,
            };
            const finalParse = contactSchema.safeParse(finalData);
            if (!finalParse.success) {
              simulateTypingDelay(setTyping, () => {
                addMessage({
                  role: "assistant",
                  content:
                    finalParse.error.issues[0]?.message ??
                    "Hay campos inválidos.",
                  contentType: "contact",
                });
              });
              break;
            }
            setTyping(true);
            sendContactEmail(finalParse.data)
              .then((emailResult) => {
                addMessage({
                  role: "assistant",
                  content: emailResult.success
                    ? contactSuccessMessage
                    : contactSendErrorMessage,
                  contentType: "contact",
                });
              })
              .catch(() => {
                addMessage({
                  role: "assistant",
                  content: contactSendErrorMessage,
                  contentType: "contact",
                });
              })
              .finally(() => {
                setTyping(false);
                resetContactFlow();
              });
          } else {
            simulateTypingDelay(setTyping, () => {
              addMessage({
                role: "assistant",
                content:
                  result.error.issues[0]?.message ?? "El mensaje es inválido.",
                contentType: "contact",
              });
            });
          }
          break;
        }
      }
    } else {
      if (contactFlowStep !== null && currentSection !== "contact")
        resetContactFlow();
      setLastUserMessage(input);
      sendStreamingMessage(input);
    }
  };

  const handlePrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const handleRetry = () => {
    if (lastUserMessage) sendStreamingMessage(lastUserMessage);
  };

  const hasMessages = messages.length > 0;

  if (!content) {
  return null;
}

  const handleProjectsSuggestion = () =>
    sendProjectMessages(addMessage, setTyping, content.projects);
  const handleExperienceSuggestion = () =>
    sendExperienceMessages(addMessage, setTyping, content.experiences);
  const handleContactSuggestion = () => {
    simulateTypingDelay(setTyping, () => {
      addMessage({
        role: "assistant",
        content: contactFlowIntro,
        contentType: "contact",
      });
      setCurrentSection("contact");
      startContactFlow();
    });
  };

  return (
    <main className="flex h-screen w-full min-w-0 flex-col relative">
      <header className="z-20 mx-3 mt-3 flex h-16 flex-shrink-0 items-center rounded-[1.4rem] border border-border/70 bg-card/70 px-3 shadow-sm backdrop-blur-xl sm:mx-5 sm:px-5">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="mr-2 rounded-2xl border border-border bg-background/70 p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            aria-label="Abrir menú"
            aria-expanded={sidebarOpen}
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        )}
        <a
          className="min-w-0 flex-1 truncate text-sm font-black text-foreground sm:text-base"
          href={content.site.social.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content.profile.name}
        </a>
        <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary sm:flex">
          <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_14px_hsl(var(--primary))]" />
          {content.profile.status}
        </div>
      </header>

      {hasMessages ? (
        <div className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin sm:px-5">
          <div className="mx-auto w-full max-w-5xl space-y-3">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                onRetry={message.hasError ? handleRetry : undefined}
              />
            ))}

            {isTyping && (
              <div className="flex justify-start px-2 py-2">
                <div className="aurora-card rounded-[1.35rem] px-5 py-4">
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        Asistente IA
                      </p>
                      <div className="mt-1 flex gap-1.5">
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-primary"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-primary"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-primary"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : (
        <WelcomeScreen
          onProjects={handleProjectsSuggestion}
          onExperience={handleExperienceSuggestion}
          onContact={handleContactSuggestion}
          onPrompt={handlePrompt}
          avatarSrc={heroAvatar}
          avatarAlt={content.profile.avatarAlt}
          content={content}
        />
      )}

      <ChatInput onSend={handleSend} disabled={isTyping} />
    </main>
  );
}
