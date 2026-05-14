const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000" : "/api")
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || "portfolio-client"
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET || "dev-secret-change-in-production"

class TokenManager {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private expiresAt: number = 0
  private isRefreshing: boolean = false
  private refreshPromise: Promise<void> | null = null
  private requestQueue: Array<(token: string) => void> = []
  private initialized: boolean = false

  constructor() {
    this.loadRefreshToken()
  }

  async initialize(): Promise<void> {
    if (this.initialized) return
    
    const refreshToken = this.getRefreshToken()
    if (refreshToken) {
      try {
        await this.refreshAccessToken()
      } catch {
        this.clearTokens()
      }
    } else {
      await this.getAccessToken()
    }
    this.initialized = true
  }

  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.expiresAt = Date.now() + expiresIn * 1000
    localStorage.setItem("refresh_token", refreshToken)
  }

  getAccessTokenSync(): string | null {
    return this.accessToken
  }

  async getAccessToken(): Promise<string> {
    if (!this.accessToken || this.isExpiringSoon()) {
      await this.refreshAccessToken()
    }
    return this.accessToken!
  }

  private isExpiringSoon(): boolean {
    if (!this.accessToken || !this.expiresAt) return true
    const fiveMinutes = 5 * 60 * 1000
    return Date.now() + fiveMinutes >= this.expiresAt
  }

  private getRefreshToken(): string | null {
    if (this.refreshToken) return this.refreshToken
    return localStorage.getItem("refresh_token")
  }

  async refreshAccessToken(): Promise<void> {
    const currentRefreshToken = this.getRefreshToken()
    if (!currentRefreshToken) {
      await this.fetchNewTokens()
      return
    }

    if (this.isRefreshing && this.refreshPromise) {
      await this.refreshPromise
      return
    }

    this.isRefreshing = true
    this.refreshPromise = this.doRefresh(currentRefreshToken)

    try {
      await this.refreshPromise
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  private async doRefresh(refreshToken: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) {
        this.clearTokens()
        await this.fetchNewTokens()
        return
      }

      const data = await response.json()
      this.setTokens(data.access_token, refreshToken, 30 * 60)
      this.processQueue(data.access_token)
    } catch {
      this.clearTokens()
      await this.fetchNewTokens()
    }
  }

  private async fetchNewTokens(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch tokens")
    }

    const data = await response.json()
    this.setTokens(data.access_token, data.refresh_token, 30 * 60)
  }

  private processQueue(token: string): void {
    this.requestQueue.forEach((resolve) => resolve(token))
    this.requestQueue = []
  }

  clearTokens(): void {
    this.accessToken = null
    this.refreshToken = null
    this.expiresAt = 0
    localStorage.removeItem("refresh_token")
  }

  private loadRefreshToken(): void {
    this.refreshToken = localStorage.getItem("refresh_token")
  }

  hasRefreshToken(): boolean {
    return !!this.getRefreshToken()
  }
}

export const tokenManager = new TokenManager()