import { tokenManager } from "@/lib/auth/tokenManager"

interface ContactEmailData {
  name: string
  email: string
  consulta: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000" : "/api")

export async function sendContactEmail(data: ContactEmailData) {
  const token = await tokenManager.getAccessToken()
  
  try {
    const response = await fetch(`${API_BASE_URL}/sendEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Contact API error:", error)
      return { success: false, error }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error("Error sending contact:", error)
    return { success: false, error }
  }
}
