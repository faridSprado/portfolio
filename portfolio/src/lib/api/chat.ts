import type { SidebarSectionId } from "@/types"
import { tokenManager } from "@/lib/auth/tokenManager"

interface ChatRequest {
  message: string
  section?: SidebarSectionId | null
}

interface ChatResponse {
  response: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000" : "/api")

export async function sendChatMessage(
  message: string,
  section?: SidebarSectionId | null
): Promise<ChatResponse> {
  const token = await tokenManager.getAccessToken()
  const body: ChatRequest = { message }
  
  // Only include section if it's a valid value (not null/undefined)
  if (section) {
    body.section = section
  }

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Stream chat messages from /chat endpoint.
 * Uses Server-Sent Events (SSE) streaming with multi-line data support.
 */
export async function streamChatMessage(
  message: string,
  onChunk: (content: string) => void
): Promise<void> {
  const token = await tokenManager.getAccessToken()
  
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`)
  }

  if (!response.body) {
    throw new Error("Response body is null")
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  const processEvent = (event: string) => {
    const payload = event
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.replace(/^data:/, ""))
      .join("\n")

    if (payload && payload !== "[DONE]") {
      onChunk(payload)
    }
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        buffer += decoder.decode()
        if (buffer.trim()) processEvent(buffer)
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split(/\r?\n\r?\n/)
      buffer = events.pop() ?? ""
      events.forEach(processEvent)
    }
  } finally {
    reader.releaseLock()
  }
}
