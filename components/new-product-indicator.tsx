"use client"

// Component to highlight newly added products

import { useState, useEffect } from "react"
import { Sparkles, Clock, TrendingUp } from "lucide-react"

interface NewProductIndicatorProps {
  product: {
    id: number
    title: string
    isRecentlyAdded?: boolean
    isNew?: boolean
    addedTimestamp?: number
  }
  showAnimation?: boolean
}

export default function NewProductIndicator({ product, showAnimation = true }: NewProductIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeAgo, setTimeAgo] = useState("")

  useEffect(() => {
    if (product.isRecentlyAdded || product.isNew) {
      setIsVisible(true)

      // Auto-hide after 10 seconds for recently added
      if (product.isRecentlyAdded && showAnimation) {
        const timer = setTimeout(() => setIsVisible(false), 10000)
        return () => clearTimeout(timer)
      }
    }
  }, [product.isRecentlyAdded, product.isNew, showAnimation])

  useEffect(() => {
    if (product.addedTimestamp) {
      const updateTimeAgo = () => {
        const now = Date.now()
        const diff = now - product.addedTimestamp!
        const minutes = Math.floor(diff / (1000 * 60))
        const hours = Math.floor(diff / (1000 * 60 * 60))

        if (minutes < 1) {
          setTimeAgo("Just now")
        } else if (minutes < 60) {
          setTimeAgo(`${minutes}m ago`)
        } else if (hours < 24) {
          setTimeAgo(`${hours}h ago`)
        } else {
          setTimeAgo("Recently added")
        }
      }

      updateTimeAgo()
      const interval = setInterval(updateTimeAgo, 60000) // Update every minute

      return () => clearInterval(interval)
    }
  }, [product.addedTimestamp])

  if (!isVisible) return null

  return (
    <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
      {product.isRecentlyAdded && (
        <div
          className={`
          bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg
          ${showAnimation ? "animate-pulse" : ""}
          flex items-center gap-1
        `}
        >
          <Sparkles className="w-3 h-3" />
          <span>Just Added!</span>
        </div>
      )}

      {product.isNew && !product.isRecentlyAdded && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>New</span>
        </div>
      )}

      {timeAgo && product.addedTimestamp && (
        <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
      )}
    </div>
  )
}
