"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
} from "@/components/ui/alert-dialog";
import { useAI } from "@/contexts/ai-context";
import { TemplateManager } from "@/components/ai-interface/template-manager";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { ChatHistoryDialog } from "@/components/chat-history/chat-history-dialog";
import { cn } from "@/lib/utils";
import {
  Bot,
  FileText,
  History,
  Settings,
  X,
  Download,
  Upload,
  Trash2,
  Database,
  Plus,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const {
    state,
    saveConversation,
    loadConversation,
    clearAllData,
    startNewConversation,
  } = useAI();
  const [showTemplates, setShowTemplates] = useState(false);

  const handleImportChat = () => {
    loadConversation();
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-80 transform border-r bg-sidebar transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 md:hidden">
            <h2 className="font-serif text-lg font-semibold text-sidebar-foreground">
              Navigation
            </h2>
          </div>

          <ScrollArea className="flex overflow-y-auto px-4">
            <div className="space-y-6 py-4">
              {/* Quick Actions */}
              <div className="space-y-2 animate-fade-in">
                <h3 className="text-sm font-medium text-sidebar-foreground/70">
                  Quick Actions
                </h3>
                <Button
                  onClick={startNewConversation}
                  className="w-full justify-start btn-hover-lift transition-all duration-200 hover:bg-accent hover:text-accent-foreground animate-gentle-bounce"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                  New Conversation
                </Button>
              </div>

              <Separator className="animate-fade-in" />

              {/* Current Model */}
              <div className="space-y-2 animate-slide-in-left">
                <h3 className="flex items-center gap-2 text-sm font-medium text-sidebar-foreground/70">
                  <Bot className="h-4 w-4 transition-colors duration-200 hover:text-accent" />
                  Current Model
                </h3>
                {state.selectedModel ? (
                  <Card className="p-3 card-hover transition-all duration-300 hover:shadow-md">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium transition-colors duration-200 hover:text-accent">
                          {state.selectedModel.name}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="text-xs transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                        >
                          {state.selectedModel.provider}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {state.selectedModel.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {state.selectedModel.capabilities
                          .slice(0, 3)
                          .map((capability, index) => (
                            <Badge
                              key={capability}
                              variant="outline"
                              className="text-xs transition-all duration-200 hover:bg-accent/10 stagger-item"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              {capability}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-3 card-hover">
                    <p className="text-sm text-muted-foreground">
                      No model selected
                    </p>
                  </Card>
                )}
              </div>

              <Separator className="animate-fade-in" />

              {/* Navigation */}
              <nav className="space-y-2 animate-slide-in-right">
                <h3 className="text-sm font-medium text-sidebar-foreground/70">
                  Navigation
                </h3>
                <div className="space-y-1">
                  <Sheet open={showTemplates} onOpenChange={setShowTemplates}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent btn-hover-lift transition-all duration-200 group"
                        size="sm"
                      >
                        <FileText className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        Templates
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-full sm:max-w-2xl lg:max-w-3xl  animate-slide-in-right"
                    >
                      <SheetHeader>
                        <SheetTitle>Template Manager</SheetTitle>
                      </SheetHeader>
                      <div className=" p-3">
                        <TemplateManager
                          setShowTemplates={setShowTemplates}
                          onClose={onClose}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <ChatHistoryDialog onClose={onClose}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent btn-hover-lift transition-all duration-200 group"
                      size="sm"
                    >
                      <History className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                      History
                    </Button>
                  </ChatHistoryDialog>

                  {/* Settings button wrapped in SettingsDialog */}
                  <SettingsDialog>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent btn-hover-lift transition-all duration-200 group"
                      size="sm"
                    >
                      <Settings className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                      Settings
                    </Button>
                  </SettingsDialog>
                </div>
              </nav>

              <Separator className="animate-fade-in" />

              {/* Data Management */}
              <div className="space-y-2 animate-slide-in-left">
                <h3 className="text-sm font-medium text-sidebar-foreground/70">
                  Data Management
                </h3>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent btn-hover-lift transition-all duration-200 group"
                    size="sm"
                    onClick={saveConversation}
                    disabled={state.messages.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:translate-y-1" />
                    Export Chat
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent btn-hover-lift transition-all duration-200 group"
                    size="sm"
                    onClick={handleImportChat}
                  >
                    <Upload className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-y-1" />
                    Import Chat
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 btn-hover-lift transition-all duration-200 group"
                        size="sm"
                      >
                        <Trash2 className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
                        Clear All Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="animate-scale-in">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all conversations, saved
                          parameters, and preferences. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="btn-hover-lift">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={clearAllData}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 btn-hover-lift"
                        >
                          Clear All Data
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <Separator className="animate-fade-in" />

              {/* Quick Stats */}
              <div className="space-y-2 animate-slide-in-right mb-14">
                <h3 className="text-sm font-medium text-sidebar-foreground/70">
                  Session Stats
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md bg-muted p-2 card-hover transition-all duration-200 hover:bg-accent/10">
                    <div className="font-medium transition-colors duration-200 hover:text-accent">
                      {state.messages.length}
                    </div>
                    <div className="text-muted-foreground">Messages</div>
                  </div>
                  <div className="rounded-md bg-muted p-2 card-hover transition-all duration-200 hover:bg-accent/10">
                    <div className="font-medium transition-colors duration-200 hover:text-accent">
                      {state.templates.length}
                    </div>
                    <div className="text-muted-foreground">Templates</div>
                  </div>
                </div>

                <div className="rounded-md bg-muted p-2 card-hover transition-all duration-200 hover:bg-accent/10">
                  <div className="flex items-center gap-2 text-xs">
                    <Database className="h-3 w-3 transition-transform duration-200 hover:scale-110" />
                    <span className="text-muted-foreground">
                      Auto-saved locally
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
