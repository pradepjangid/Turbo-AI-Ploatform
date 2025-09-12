"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface FocusTrapProps {
  children: React.ReactNode
  enabled?: boolean
}

export function FocusTrap({ children, enabled = true }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener("keydown", handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener("keydown", handleTabKey)
    }
  }, [enabled])

  return <div ref={containerRef}>{children}</div>
}
