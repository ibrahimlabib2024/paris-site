"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  sizes?: string
  quality?: number
  priority?: boolean
  loading?: "lazy" | "eager"
  placeholder?: "blur" | "empty"
  blurDataURL?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  sizes,
  quality = 75,
  priority = false,
  loading = "lazy",
  placeholder = "blur",
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [imageError, setImageError] = useState(false)

  // Generate a simple blur placeholder if none provided
  const defaultBlurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="

  useEffect(() => {
    setImageSrc(src)
    setImageError(false)
  }, [src])

  const handleError = () => {
    setImageError(true)
    setImageSrc("/placeholder.svg?height=400&width=400")
  }

  const imageProps = {
    src: imageSrc,
    alt,
    className,
    quality,
    priority,
    loading,
    placeholder: placeholder as "blur" | "empty" | undefined,
    blurDataURL: blurDataURL || defaultBlurDataURL,
    onError: handleError,
    ...props,
  }

  if (fill) {
    return <Image {...imageProps} fill sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"} />
  }

  return <Image {...imageProps} width={width || 400} height={height || 300} sizes={sizes} />
}
