"use client"

import { useEffect } from "react"
import { useAI } from "@/contexts/ai-context"

export function KeyboardShortcuts() {
  const { state, dispatch, sendMessage } = useAI()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to send message
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (state.currentPrompt.trim() && !state.isLoading && state.selectedModel) {
          e.preventDefault()
          sendMessage(state.currentPrompt)
          dispatch({ type: "SET_CURRENT_PROMPT", payload: "" })
        }
      }

      // Escape to clear current prompt
      if (e.key === "Escape" && state.currentPrompt.trim()) {
        e.preventDefault()
        dispatch({ type: "SET_CURRENT_PROMPT", payload: "" })
      }

      // Ctrl/Cmd + K to focus model selector
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        const modelSelector = document.querySelector('[role="combobox"]') as HTMLElement
        modelSelector?.focus()
      }

      // Ctrl/Cmd + / to show keyboard shortcuts help
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault()
        // Could trigger a help modal here
        console.log("Keyboard shortcuts help")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [state.currentPrompt, state.isLoading, state.selectedModel, sendMessage, dispatch])

  return null
}
