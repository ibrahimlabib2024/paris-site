"use client"

import { Play, Pause } from "lucide-react"
import { useState } from "react"

interface PlayButtonProps {
  onPlay?: () => void
  onPause?: () => void
  className?: string
  size?: number
}

export default function PlayButton({ onPlay, onPause, className = "", size = 24 }: PlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleClick = () => {
    if (isPlaying) {
      onPause?.()
      setIsPlaying(false)
    } else {
      onPlay?.()
      setIsPlaying(true)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 p-3 ${className}`}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? (
        <Pause className="w-6 h-6 text-white" size={size} />
      ) : (
        <Play className="w-6 h-6 text-white ml-1" size={size} />
      )}
    </button>
  )
}
