// Simplified authentication configuration
export const AUTH_CONFIG = {
  // Session settings
  SESSION_DURATION: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  REMEMBER_ME_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds

  // Admin credentials
  ADMIN_CREDENTIALS: {
    username: "parisboutique_admin",
    password: "PB2024@Secure!Admin",
    email: "admin@parisboutiquejuba.com",
    role: "super_admin",
  },
}

// Security utilities
export const SecurityUtils = {
  // Generate secure session token
  generateSessionToken: (): string => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  },

  // Get client fingerprint for session validation
  getClientFingerprint: (): string => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.textBaseline = "top"
      ctx.font = "14px Arial"
      ctx.fillText("Security fingerprint", 2, 2)
    }

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
    ].join("|")

    return btoa(fingerprint).slice(0, 32)
  },
}
