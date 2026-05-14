import { create } from "zustand"
import type { ChatState, ThemeState } from "../types"

// Fallback for browsers that don't support crypto.randomUUID
const generateId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  // Fallback: generate a UUID-like string
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const initialContactData = { name: undefined, email: undefined, consulta: undefined }

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,
  sidebarOpen: true,
  contactFlowStep: null,
  contactData: { ...initialContactData },
  currentSection: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        },
      ],
    })),

  setTyping: (typing) => set({ isTyping: typing }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  startContactFlow: () => set({ contactFlowStep: "name", contactData: { ...initialContactData } }),

  setContactFlowStep: (step) => set({ contactFlowStep: step }),

  setContactData: (data) =>
    set((state) => ({ contactData: { ...state.contactData, ...data } })),

  resetContactFlow: () =>
    set({ contactFlowStep: null, contactData: { ...initialContactData } }),

  clearMessages: () => set({ messages: [] }),

  setCurrentSection: (section) => set({ currentSection: section }),

  // Streaming message actions
  startStreamingMessage: (content: string) => {
    const id = generateId()
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id,
          role: "assistant" as const,
          content,
          timestamp: new Date(),
        },
      ],
    }))
    return id
  },

  appendToStreamingMessage: (id: string, content: string) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content: msg.content + content } : msg
      ),
    }))
  },

  markMessageAsError: (id: string) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, hasError: true } : msg
      ),
    }))
  },
}))

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (typeof window !== "undefined" && localStorage.getItem("theme") === "light") ? "light" : "dark",

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark"
      localStorage.setItem("theme", next)
      document.documentElement.classList.toggle("dark", next === "dark")
      return { theme: next }
    }),

  setTheme: (theme) => {
    localStorage.setItem("theme", theme)
    document.documentElement.classList.toggle("dark", theme === "dark")
    set({ theme })
  },
}))
