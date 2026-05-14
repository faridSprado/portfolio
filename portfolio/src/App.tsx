import { useEffect, useMemo } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ChatInterface } from "./components/organisms/ChatInterface/ChatInterface";
import { Sidebar } from "./components/organisms/Sidebar/Sidebar";
import { AdminPanel } from "./components/organisms/AdminPanel";
import { useThemeStore } from "./store/chatStore";
import { usePortfolioContentStore } from "./store/contentStore";
import { tokenManager } from "./lib/auth/tokenManager";
import { SEO } from "./components/atoms";

function App() {
  const { theme } = useThemeStore();
  const loadContent = usePortfolioContentStore((state) => state.loadContent);
  const isAdminRoute = useMemo(() => window.location.pathname.startsWith("/admin"), []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    if (!isAdminRoute) tokenManager.initialize();
  }, [isAdminRoute]);

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
