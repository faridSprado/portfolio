import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function simulateTypingDelay(
  setTyping: (typing: boolean) => void,
  onComplete: () => void,
  delay = 900
) {
  setTyping(true)
  window.setTimeout(() => {
    onComplete()
    setTyping(false)
  }, delay)
}
