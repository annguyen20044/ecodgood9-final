"use client"

import { useState } from "react"

interface ImageWithFallbackProps {
  src: string | null | undefined
  alt: string
  className?: string
  fallbackSrc?: string
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = "/placeholder-green.svg" 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  )
}

