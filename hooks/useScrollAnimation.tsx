"use client"

import { useEffect, useRef, useState } from "react"

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", triggerOnce = true, delay = 0 } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true)
              if (triggerOnce) {
                setHasAnimated(true)
              }
            }, delay)
          } else if (!triggerOnce && !hasAnimated) {
            setIsVisible(false)
          }
        })
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated])

  return { elementRef, isVisible }
}

export function useStaggeredAnimation(itemCount: number, options: ScrollAnimationOptions = {}) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false))
  const elementRef = useRef<HTMLElement>(null)

  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", delay = 0 } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger the animation of items
            const staggerDelay = 100 // 100ms between each item
            for (let i = 0; i < itemCount; i++) {
              setTimeout(
                () => {
                  setVisibleItems((prev) => {
                    const newState = [...prev]
                    newState[i] = true
                    return newState
                  })
                },
                delay + i * staggerDelay,
              )
            }
          }
        })
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [itemCount, threshold, rootMargin, delay])

  return { elementRef, visibleItems }
}
