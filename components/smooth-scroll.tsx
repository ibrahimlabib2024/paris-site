"use client"

import { useEffect } from "react"

export default function SmoothScroll() {
  useEffect(() => {
    // Enable smooth scrolling behavior
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth"
    }

    return () => {
      if (typeof window !== "undefined") {
        document.documentElement.style.scrollBehavior = "auto"
      }
    }
  }, [])

  return null
}
