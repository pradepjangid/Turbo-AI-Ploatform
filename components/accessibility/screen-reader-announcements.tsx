"use client"

import { useEffect, useRef } from "react"
import { useAI } from "@/contexts/ai-context"

export function ScreenReaderAnnouncements() {
  const { state } = useAI()
  const announcementRef = useRef<HTMLDivElement>(null)
  const previousMessageCount = useRef(state.messages.length)

  useEffect(() => {
    if (state.messages.length > previousMessageCount.current) {
      const latestMessage = state.messages[state.messages.length - 1]
      if (latestMessage.role === "assistant" && announcementRef.current) {
        announcementRef.current.textContent = `AI response received: ${latestMessage.content.substring(0, 100)}...`
      }
    }
    previousMessageCount.current = state.messages.length
  }, [state.messages])

  useEffect(() => {
    if (state.error && announcementRef.current) {
      announcementRef.current.textContent = `Error: ${state.error}`
    }
  }, [state.error])

  useEffect(() => {
    if (state.selectedModel && announcementRef.current) {
      announcementRef.current.textContent = `Model changed to ${state.selectedModel.name}`
    }
  }, [state.selectedModel])

  return <div ref={announcementRef} className="sr-only" aria-live="polite" aria-atomic="true" />
}
