import { useState, useEffect } from "react"

/**
 * Hook that returns whether a media query matches.
 * Uses matchMedia API for performance (no resize listener).
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = (q: string): boolean => {
    if (typeof window === "undefined") return false
    return window.matchMedia(q).matches
  }

  const [matches, setMatches] = useState(() => getMatches(query))

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    // Handler for changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Set initial value (in case it changed since mount)
    setMatches(mediaQuery.matches)

    // Modern API (addEventListener)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler)
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler)
      } else {
        mediaQuery.removeListener(handler)
      }
    }
  }, [query])

  return matches
}

/**
 * Convenience hook for desktop detection.
 * Returns true for viewports >= specified breakpoint.
 */
export function useIsDesktop(breakpoint: "sm" | "md" | "lg" | "xl" | "2xl" = "lg"): boolean {
  const breakpoints: Record<string, string> = {
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
    "2xl": "(min-width: 1536px)",
  }
  return useMediaQuery(breakpoints[breakpoint])
}
