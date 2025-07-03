"use client"

import { useState, useRef } from "react"
import { MapPin, Navigation, ExternalLink, RefreshCw, AlertCircle } from "lucide-react"

interface MapProps {
  className?: string
}

export default function EnhancedMap({ className = "" }: MapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Convert the Google Maps share URL to an embeddable format
  const originalUrl = "https://maps.app.goo.gl/EZosGzr8Gh3hv9yp6"
  const embedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7573!2d31.5804!3d4.8594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNTEnMzQuMCJOIDMxwrAzNCc0OS40IkU!5e0!3m2!1sen!2s!4v1640995200000"

  // Alternative embed URL using the place search
  const searchEmbedUrl =
    "https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO4Xz7C&q=Nimira+Talata+MCC+Building+Juba+South+Sudan&zoom=15&maptype=roadmap"

  // Fallback embed URL with general Juba location
  const fallbackEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63834.12345!2d31.5804!3d4.8594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1729b3c5c5c5c5c5%3A0x1234567890abcdef!2sJuba%2C%20South%20Sudan!5e0!3m2!1sen!2s!4v1640995200000"

  const handleMapLoad = () => {
    setMapLoaded(true)
    setMapError(false)
  }

  const handleMapError = () => {
    setMapError(true)
    setMapLoaded(false)
  }

  const retryMapLoad = () => {
    setIsRetrying(true)
    setMapError(false)
    setMapLoaded(false)

    // Force iframe reload
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src
      iframeRef.current.src = ""
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc
        }
        setIsRetrying(false)
      }, 500)
    }
  }

  const openInGoogleMaps = () => {
    window.open(originalUrl, "_blank", "noopener,noreferrer")
  }

  const getDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=Nimira+Talata+MCC+Building+Juba+South+Sudan`
    window.open(directionsUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div
      className={`relative bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl overflow-hidden border border-purple-200 ${className}`}
    >
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold text-sm">Paris Boutique Location</span>
          </div>
          <div className="flex items-center gap-2">
            {mapError && (
              <button
                onClick={retryMapLoad}
                disabled={isRetrying}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Retry loading map"
              >
                <RefreshCw className={`w-4 h-4 text-white ${isRetrying ? "animate-spin" : ""}`} />
              </button>
            )}
            <button
              onClick={openInGoogleMaps}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              aria-label="Open in Google Maps"
            >
              <ExternalLink className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-purple-600 font-medium">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {mapError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
          <div className="text-center space-y-4 p-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-red-700">Map Loading Error</h3>
              <p className="text-red-600 text-sm">Unable to load the map. Please try again or use the buttons below.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={retryMapLoad}
                disabled={isRetrying}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
                Retry
              </button>
              <button
                onClick={openInGoogleMaps}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Maps
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map iframe */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Paris Boutique Location - Nimira Talata MCC Building, Juba, South Sudan"
        className="w-full h-64 sm:h-80 md:h-96 rounded-2xl"
        onLoad={handleMapLoad}
        onError={handleMapError}
        aria-label="Interactive map showing Paris Boutique location at Nimira Talata MCC Building, Juba, South Sudan"
      />

      {/* Map Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={getDirections}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 justify-center shadow-lg"
            aria-label="Get directions to Paris Boutique"
          >
            <Navigation className="w-4 h-4" />
            <span className="font-medium">Get Directions</span>
          </button>
          <button
            onClick={openInGoogleMaps}
            className="px-4 py-2 bg-white/90 hover:bg-white text-purple-600 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 justify-center shadow-lg"
            aria-label="View larger map in Google Maps"
          >
            <MapPin className="w-4 h-4" />
            <span className="font-medium">View Larger Map</span>
          </button>
        </div>
      </div>

      {/* Accessibility Information */}
      <div className="sr-only">
        <h3>Paris Boutique Location Information</h3>
        <p>Address: Nimira Talata MCC Building, Juba, South Sudan</p>
        <p>
          This interactive map shows the exact location of Paris Boutique. You can use the controls to get directions or
          view a larger map.
        </p>
        <p>If you're having trouble with the map, you can also contact us directly at +211 985 575 533</p>
      </div>
    </div>
  )
}
