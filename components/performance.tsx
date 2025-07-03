"use client"

import { useEffect } from "react"

export default function Performance() {
  useEffect(() => {
    // Basic performance monitoring
    if (typeof window !== "undefined" && "performance" in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log(`Performance: ${entry.name} - ${entry.duration}ms`)
        })
      })

      observer.observe({ entryTypes: ["measure", "navigation"] })
    }
  }, [])

  return null
}
