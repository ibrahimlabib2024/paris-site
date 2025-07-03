"use client"

import type React from "react"

import { Suspense, lazy, type ComponentType } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface LazyComponentProps {
  fallback?: React.ReactNode
  className?: string
}

export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode,
) {
  const LazyComponent = lazy(importFunc)

  return function LazyWrapper(props: React.ComponentProps<T> & LazyComponentProps) {
    const { fallback: customFallback, className, ...componentProps } = props

    const defaultFallback = (
      <div className={className}>
        <Skeleton className="w-full h-64" />
      </div>
    )

    return (
      <Suspense fallback={customFallback || fallback || defaultFallback}>
        <LazyComponent {...componentProps} />
      </Suspense>
    )
  }
}

// Pre-built lazy components for common sections
export const LazyHeroSection = createLazyComponent(
  () => import("../hero-section"),
  <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50 animate-pulse" />,
)

export const LazyProductShowcase = createLazyComponent(
  () => import("../product-showcase"),
  <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
)

export const LazyTestimonialsSection = createLazyComponent(
  () => import("../testimonials-section"),
  <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
)

export const LazyAboutSection = createLazyComponent(
  () => import("../about-section"),
  <div className="h-80 bg-gray-100 animate-pulse rounded-lg" />,
)
