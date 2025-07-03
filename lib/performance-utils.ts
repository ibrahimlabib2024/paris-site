// Performance utilities for optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Device and network optimization
export const optimizeForDevice = () => {
  if (typeof window === "undefined") return { isLowEnd: false, isSlowConnection: false }

  const connection =
    (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  const isSlowConnection = connection
    ? connection.effectiveType === "slow-2g" || connection.effectiveType === "2g"
    : false

  // Detect low-end devices
  const isLowEnd = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2

  return {
    isLowEnd,
    isSlowConnection,
    shouldReduceAnimations: isLowEnd || isSlowConnection,
    shouldReduceImageQuality: isSlowConnection,
  }
}

// Performance measurement
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window === "undefined") return fn()

  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${name} took ${end - start} milliseconds`)
}

// Preload critical resources
export const preloadResource = (href: string, as: string, type?: string) => {
  if (typeof document === "undefined") return

  const link = document.createElement("link")
  link.rel = "preload"
  link.href = href
  link.as = as
  if (type) link.type = type
  document.head.appendChild(link)
}

// Lazy load images with intersection observer
export const createImageObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  if (typeof window === "undefined") return null

  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback)
    },
    {
      rootMargin: "50px",
      threshold: 0.1,
    },
  )
}

// --- Critical-resource helpers ---------------------------------------------

/**
 * Preload the fonts and establish early connections to third-party origins
 * that are required for first paint. This runs only in the browser.
 */
export const preloadCriticalResources = (): void => {
  if (typeof document === "undefined") return

  // Preload local fonts
  preloadResource("/fonts/inter.woff2", "font", "font/woff2")
  preloadResource("/fonts/playfair.woff2", "font", "font/woff2")

  // Pre-connect to external domains we fetch early
  ;["https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://wa.me"].forEach((href) => {
    const link = document.createElement("link")
    link.rel = "preconnect"
    link.href = href
    link.crossOrigin = "anonymous"
    document.head.appendChild(link)
  })
}
