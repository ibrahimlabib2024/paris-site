import { AUTH_CONFIG, SecurityUtils } from "./auth-config"

export interface AuthSession {
  token: string
  userId: string
  username: string
  email: string
  role: string
  loginTime: string
  expiresAt: string
  fingerprint: string
  rememberMe: boolean
}

export class AuthManager {
  private static instance: AuthManager
  private readonly STORAGE_KEYS = {
    SESSION: "admin-session",
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  // Authenticate user - simplified without restrictions
  authenticate(
    username: string,
    password: string,
    rememberMe = false,
  ): {
    success: boolean
    session?: AuthSession
    error?: string
  } {
    // Validate credentials
    const { ADMIN_CREDENTIALS } = AUTH_CONFIG
    const isValidCredentials = username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password

    if (!isValidCredentials) {
      return {
        success: false,
        error: "Invalid username or password. Please check your credentials and try again.",
      }
    }

    // Create session
    const session = this.createSession(ADMIN_CREDENTIALS, rememberMe)

    return {
      success: true,
      session,
    }
  }

  // Create authentication session
  private createSession(credentials: typeof AUTH_CONFIG.ADMIN_CREDENTIALS, rememberMe: boolean): AuthSession {
    const now = new Date()
    const duration = rememberMe ? AUTH_CONFIG.REMEMBER_ME_DURATION : AUTH_CONFIG.SESSION_DURATION
    const expiresAt = new Date(now.getTime() + duration)

    const session: AuthSession = {
      token: SecurityUtils.generateSessionToken(),
      userId: "admin-001",
      username: credentials.username,
      email: credentials.email,
      role: credentials.role,
      loginTime: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      fingerprint: SecurityUtils.getClientFingerprint(),
      rememberMe,
    }

    localStorage.setItem(this.STORAGE_KEYS.SESSION, JSON.stringify(session))
    return session
  }

  // Validate existing session
  validateSession(): AuthSession | null {
    const sessionData = localStorage.getItem(this.STORAGE_KEYS.SESSION)
    if (!sessionData) return null

    try {
      const session: AuthSession = JSON.parse(sessionData)
      const now = new Date()
      const expiresAt = new Date(session.expiresAt)

      // Check if session expired
      if (now > expiresAt) {
        this.logout()
        return null
      }

      // Validate fingerprint for additional security
      const currentFingerprint = SecurityUtils.getClientFingerprint()
      if (session.fingerprint !== currentFingerprint) {
        this.logout()
        return null
      }

      // Extend session if remember me is enabled
      if (session.rememberMe) {
        const newExpiresAt = new Date(now.getTime() + AUTH_CONFIG.REMEMBER_ME_DURATION)
        session.expiresAt = newExpiresAt.toISOString()
        localStorage.setItem(this.STORAGE_KEYS.SESSION, JSON.stringify(session))
      }

      return session
    } catch (error) {
      this.logout()
      return null
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEYS.SESSION)
  }

  // Get current session
  getCurrentSession(): AuthSession | null {
    return this.validateSession()
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.validateSession() !== null
  }

  // Clear session data
  clearSessionData(): void {
    localStorage.removeItem(this.STORAGE_KEYS.SESSION)
  }
}
