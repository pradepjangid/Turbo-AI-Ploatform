"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useAI } from "@/contexts/ai-context"
import { History, Search, Trash2, MessageSquare, Calendar, Download, Eye } from "lucide-react"
import type { ChatMessage } from "@/app/api/chat/route"

interface SavedConversation {
  id: string
  title: string
  messages: ChatMessage[]
  model: string
  createdAt: string
  updatedAt: string
  messageCount: number
}

interface ChatHistoryDialogProps {
  children: React.ReactNode
}

export function ChatHistoryDialog({ children }: ChatHistoryDialogProps) {
  const { state, dispatch } = useAI()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useLocalStorage<SavedConversation[]>("ai-chat-history", [])

  // Save current conversation to history
  const saveCurrentConversation = () => {
    if (state.messages.length === 0) return

    const title = generateConversationTitle(state.messages)
    const newConversation: SavedConversation = {
      id: `conv-${Date.now()}`,
      title,
      messages: state.messages,
      model: state.selectedModel?.name || "Unknown",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: state.messages.length,
    }

    setConversations((prev) => [newConversation, ...prev.slice(0, 49)]) // Keep max 50 conversations
  }

  // Generate conversation title from first user message
  const generateConversationTitle = (messages: ChatMessage[]): string => {
    const firstUserMessage = messages.find((m) => m.role === "user")
    if (firstUserMessage) {
      const content = firstUserMessage.content.trim()
      return content.length > 50 ? content.substring(0, 50) + "..." : content
    }
    return `Conversation ${new Date().toLocaleDateString()}`
  }

  // Load conversation
  const loadConversation = (conversation: SavedConversation) => {
    dispatch({ type: "SET_MESSAGES", payload: conversation.messages })
    setOpen(false)
  }

  // Delete conversation
  const deleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))
  }

  // Export conversation
  const exportConversation = (conversation: SavedConversation) => {
    const data = {
      ...conversation,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `conversation-${conversation.title.replace(/[^a-zA-Z0-9]/g, "-")}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Filter conversations based on search
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] sm:h-[80vh] sm:max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <History className="h-4 w-4 sm:h-5 sm:w-5" />
            Chat History
            <Badge variant="secondary" className="ml-2 text-xs">
              {conversations.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 flex-1 min-h-0">
          {/* Search and Actions */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>
            <Button
              onClick={saveCurrentConversation}
              disabled={state.messages.length === 0}
              variant="outline"
              className="w-full sm:w-auto text-sm bg-transparent"
            >
              Save Current Chat
            </Button>
          </div>

          <Separator />

          {/* Conversations List */}
          <ScrollArea className="flex-1 min-h-0">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
                <MessageSquare className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/50 mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-muted-foreground mb-2">
                  {conversations.length === 0 ? "No conversations yet" : "No matching conversations"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                  {conversations.length === 0
                    ? "Start chatting to build your conversation history. Your chats will be automatically saved."
                    : "Try adjusting your search terms to find the conversation you're looking for."}
                </p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {filteredConversations.map((conversation) => (
                  <Card key={conversation.id} className="hover:bg-accent/5 transition-colors">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-1 truncate">{conversation.title}</h4>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(conversation.createdAt)}</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <Badge variant="outline" className="text-xs">
                              {conversation.model}
                            </Badge>
                            <span className="hidden sm:inline">•</span>
                            <span>{conversation.messageCount} messages</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {conversation.messages.find((m) => m.role === "assistant")?.content.substring(0, 100) +
                              "..."}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-1 self-end sm:self-start">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 touch-manipulation"
                            onClick={() => loadConversation(conversation)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 touch-manipulation"
                            onClick={() => exportConversation(conversation)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive touch-manipulation"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-[90vw] max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-base">Delete Conversation</AlertDialogTitle>
                                <AlertDialogDescription className="text-sm">
                                  Are you sure you want to delete this conversation? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                                <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteConversation(conversation.id)}
                                  className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>

          {conversations.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 text-xs text-muted-foreground gap-1 sm:gap-0">
              <span>
                Showing {filteredConversations.length} of {conversations.length} conversations
              </span>
              <span className="text-xs">Conversations are automatically saved locally</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
