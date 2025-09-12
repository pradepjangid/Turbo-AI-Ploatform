"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAI } from "@/contexts/ai-context"
import { MessageSquare, Copy, User, Bot, AlertCircle, Loader2, ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "@/lib/utils"

const SuggestedPrompts = ({ onPromptSelect }: { onPromptSelect: (prompt: string) => void }) => {
  const suggestedPrompts = [
    "How do you process information?",
    "What are your main functions as an AI?",
    "Can you help me brainstorm ideas?",
    "Explain a complex topic simply",
    "Help me solve a problem",
    "What's the latest in technology?",
  ]

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="text-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Continue the conversation</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestedPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs hover:bg-accent hover:text-accent-foreground transition-all duration-200 btn-hover-lift bg-transparent"
              onClick={() => onPromptSelect(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChatOutput() {
  const { state, dispatch } = useAI()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, 100)
    return () => clearTimeout(timer)
  }, [state.messages])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("[v0] Failed to copy text:", err)
    }
  }

  const handlePromptSelect = (prompt: string) => {
    dispatch({ type: "SET_CURRENT_PROMPT", payload: prompt })
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const conversationEnded =
    state.messages.length > 0 && state.messages[state.messages.length - 1]?.role === "assistant" && !state.isLoading

  return (
    <Card className="h-full flex flex-col animate-fade-in">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Conversation</span>
            <span className="sm:hidden">Chat</span>
          </CardTitle>
          {state.messages.length > 0 && (
            <Badge variant="secondary" className="animate-gentle-bounce">
              {state.messages.length} messages
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea className="flex-1 px-4 sm:px-6 min-h-0" ref={scrollAreaRef}>
          <div className="space-y-4 py-4 min-h-full">
            {state.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center animate-fade-in">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Start a conversation by typing a message in the prompt editor. Your AI assistant is ready to help!
                </p>
              </div>
            ) : (
              <>
                {state.messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 group animate-fade-in",
                      message.role === "user" ? "justify-end" : "justify-start",
                      "stagger-item",
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={cn(
                        "flex max-w-[85%] sm:max-w-[75%] gap-3",
                        message.role === "user" ? "flex-row-reverse" : "flex-row",
                      )}
                    >
                      {/* Avatar */}
                      <div
                        className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground",
                        )}
                      >
                        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>

                      {/* Message Content */}
                      <div className={cn("flex flex-col gap-1", message.role === "user" ? "items-end" : "items-start")}>
                        <div
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm leading-relaxed card-hover transition-all duration-200",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground message-bubble user"
                              : "bg-muted text-muted-foreground message-bubble",
                          )}
                        >
                          <div className="whitespace-pre-wrap break-words">{message.content}</div>
                        </div>

                        <div
                          className={cn(
                            "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200",
                            message.role === "user" ? "flex-row-reverse" : "flex-row",
                          )}
                        >
                          <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>

                          {/* Message action buttons */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 btn-hover-lift hover:bg-accent/20"
                              onClick={() => copyToClipboard(message.content)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>

                            {message.role === "assistant" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 btn-hover-lift hover:bg-green-100 hover:text-green-600"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 btn-hover-lift hover:bg-red-100 hover:text-red-600"
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {state.isLoading && (
                  <div className="flex gap-3 justify-start animate-fade-in">
                    <div className="flex max-w-[75%] gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted rounded-lg px-3 py-2 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-enhanced-spin" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full typing-dot"></div>
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full typing-dot"></div>
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full typing-dot"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                {conversationEnded && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <SuggestedPrompts onPromptSelect={handlePromptSelect} />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>

        {/* Error Display */}
        {state.error && (
          <>
            <Separator className="flex-shrink-0" />
            <div className="p-4 animate-fade-in flex-shrink-0">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{state.error}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
