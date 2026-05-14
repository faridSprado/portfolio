import { useEffect, useCallback } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageModalProps {
  src: string | URL
  alt: string
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function ImageModal({
  src,
  alt,
  isOpen,
  onClose,
  className,
}: ImageModalProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Close button */}
      <button
        onClick={onClose}
        className={cn(
          "absolute top-4 right-4 z-10 p-2 rounded-full",
          "bg-white/10 hover:bg-white/20 transition-colors",
          "text-white/80 hover:text-white",
          "focus:outline-none focus:ring-2 focus:ring-white/50",
          "cursor-pointer"
        )}
        aria-label="Cerrar"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image container */}
      <div
        className={cn(
          "relative max-w-[90vw] max-h-[90vh]",
          "flex items-center justify-center",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={typeof src === "string" ? src : src.toString()}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  )
}
