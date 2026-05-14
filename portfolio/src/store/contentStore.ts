import { create } from "zustand"
import { defaultPortfolioContent } from "@/data/defaultContent"
import { fetchPortfolioContent } from "@/lib/api/content"
import type { PortfolioContentState } from "@/types"

export const usePortfolioContentStore = create<PortfolioContentState>((set) => ({
  content: null,
  isLoading: true,
  error: null,

  setContent: (content) => set({ content, error: null }),

  loadContent: async () => {
    set({ isLoading: true, error: null })
    try {
      const content = await fetchPortfolioContent()
      set({ content, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "No se pudo cargar el contenido remoto",
      })
    }
  },
}))
