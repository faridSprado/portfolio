import { useEffect, useMemo } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ChatInterface } from "./components/organisms/ChatInterface/ChatInterface";
import { Sidebar } from "./components/organisms/Sidebar/Sidebar";
import { AdminPanel } from "./components/organisms/AdminPanel";
import { BackendWakeupNotice } from "./components/molecules/BackendWakeupNotice";
import { useThemeStore } from "./store/chatStore";
import { usePortfolioContentStore } from "./store/contentStore";
import { useBackendWakeup } from "./hooks/useBackendWakeup";
import { tokenManager } from "./lib/auth/tokenManager";
import { SEO } from "./components/atoms";

function App() {
  const { theme } = useThemeStore();
  const loadContent = usePortfolioContentStore((state) => state.loadContent);
  const content = usePortfolioContentStore((state) => state.content);
  const isLoading = usePortfolioContentStore((state) => state.isLoading);
  const isAdminRoute = useMemo(() => window.location.pathname.startsWith("/admin"), []);

  const isWaitingForInitialContent = !content && isLoading;

  const backendWakeup = useBackendWakeup({
    enabled: !isAdminRoute && isWaitingForInitialContent,
    noticeDelayMs: 5_000,
    requestTimeoutMs: 8_000,
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    if (!isAdminRoute) tokenManager.initialize();
  }, [isAdminRoute]);

  if (isWaitingForInitialContent) {
    const isActuallyWaking = backendWakeup.showNotice && backendWakeup.status === "waking";

    return (
      <HelmetProvider>
        <SEO />
        <div className="app-shell grid-pattern flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
          <div className="aurora-card max-w-md rounded-[2rem] p-6 text-center">
            <div className="relative z-10">
              <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-2xl bg-primary/20" />
              <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">
                Preparando portfolio
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {isActuallyWaking
                  ? "Despertando el copiloto... El backend gratuito puede tardar unos segundos si estuvo inactivo."
                  : "Cargando la experiencia conversacional."}
              </p>
            </div>
          </div>
        </div>
        <BackendWakeupNotice status={backendWakeup.status} visible={backendWakeup.showNotice} />
      </HelmetProvider>
    );
  }

  if (!content) {
    return (
      <HelmetProvider>
        <SEO />
        <div className="app-shell grid-pattern flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
          <div className="aurora-card max-w-md rounded-[2rem] p-6 text-center">
            <div className="relative z-10">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">
                Portfolio no disponible
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                No se pudo cargar el contenido. Recarga la página o inténtalo nuevamente en unos segundos.
              </p>
            </div>
          </div>
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <SEO />
      {isAdminRoute ? (
        <AdminPanel />
      ) : (
        <div className="app-shell grid-pattern flex h-screen overflow-hidden bg-background text-foreground">
          <Sidebar />
          <ChatInterface />
        </div>
      )}
    </HelmetProvider>
  );
}

export default App;
