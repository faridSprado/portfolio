import { create } from "zustand"
import { defaultPortfolioContent } from "@/data/defaultContent"
import { fetchPortfolioContent } from "@/lib/api/content"
import type { PortfolioContent, PortfolioContentState } from "@/types"

const CONTENT_CACHE_KEY = "portfolio-content-cache-v1"

function readCachedContent(): PortfolioContent | null {
  try {
    const raw = window.localStorage.getItem(CONTENT_CACHE_KEY)
    return raw ? (JSON.parse(raw) as PortfolioContent) : null
  } catch {
    return null
  }
}

function writeCachedContent(content: PortfolioContent) {
  try {
    window.localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(content))
  } catch {
    // Ignore storage errors.
  }
}

export const usePortfolioContentStore = create<PortfolioContentState>((set) => {
  const cachedContent =
    typeof window !== "undefined" ? readCachedContent() : null

  return {
    content: cachedContent,
    isLoading: !cachedContent,
    error: null,

    setContent: (content) => {
      writeCachedContent(content)
      set({ content, error: null })
    },

    loadContent: async () => {
      set({ isLoading: !cachedContent, error: null })

      try {
        const content = await fetchPortfolioContent()
        writeCachedContent(content)
        set({ content, isLoading: false, error: null })
      } catch (error) {
        set({
          content: cachedContent ?? defaultPortfolioContent,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "No se pudo cargar el contenido remoto",
        })
      }
    },
  }
})