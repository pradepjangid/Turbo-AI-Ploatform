"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAI } from "@/contexts/ai-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMobile } from "@/hooks/use-mobile";
import {
  Send,
  Save,
  FileText,
  Trash2,
  Star,
  StarOff,
  Loader2,
  Upload,
  X,
  Settings,
  MessageSquare,
} from "lucide-react";
import type { PromptTemplate } from "@/app/api/templates/route";
import { MobileParameters } from "./mobile-parameters";

interface SavedPrompt {
  id: string;
  name: string;
  content: string;
  systemPrompt: string;
  isFavorite: boolean;
  createdAt: string;
}

export function PromptEditor() {
  const { state, dispatch, sendMessage, loadTemplate } = useAI();
  const [savedPrompts, setSavedPrompts] = useLocalStorage<SavedPrompt[]>(
    "saved-prompts",
    []
  );
  const [showTemplates, setShowTemplates] = useState(false);
  const [promptName, setPromptName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const isMobile = useMobile();
  const [isSystemMode, setIsSystemMode] = useState(false);
  const [localSystemPrompt, setLocalSystemPrompt] = useState(
    state.systemPrompt
  );
  const [localCurrentPrompt, setLocalCurrentPrompt] = useState(
    state.currentPrompt
  );

  useEffect(() => {
    setLocalSystemPrompt(state.systemPrompt);
  }, [state.systemPrompt]);

  useEffect(() => {
    setLocalCurrentPrompt(state.currentPrompt);
  }, [state.currentPrompt]);

  const handleSendOrApply = async () => {
    if (isSystemMode) {
      dispatch({ type: "SET_SYSTEM_PROMPT", payload: localSystemPrompt });
    } else {
      if (!localCurrentPrompt.trim() || state.isLoading) return;
      await sendMessage(localCurrentPrompt);
      dispatch({ type: "SET_CURRENT_PROMPT", payload: "" });
      setLocalCurrentPrompt("");
      setUploadedFiles([]);
    }
  };

  const handleSavePrompt = () => {
    const contentToSave = isSystemMode ? localSystemPrompt : localCurrentPrompt;
    if (!promptName.trim() || !contentToSave.trim()) return;

    const newPrompt: SavedPrompt = {
      id: `prompt-${Date.now()}`,
      name: promptName,
      content: contentToSave,
      systemPrompt: localSystemPrompt,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    setSavedPrompts([newPrompt, ...savedPrompts]);
    setPromptName("");
  };

  const handleLoadPrompt = (prompt: SavedPrompt) => {
    dispatch({ type: "SET_CURRENT_PROMPT", payload: prompt.content });
    dispatch({ type: "SET_SYSTEM_PROMPT", payload: prompt.systemPrompt });
    setLocalCurrentPrompt(prompt.content);
    setLocalSystemPrompt(prompt.systemPrompt);
    setShowTemplates(false);
  };

  const handleLoadTemplate = (template: PromptTemplate) => {
    loadTemplate(template);
    setShowTemplates(false);
  };

  const toggleFavorite = (promptId: string) => {
    setSavedPrompts(
      savedPrompts.map((p) =>
        p.id === promptId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  const deletePrompt = (promptId: string) => {
    setSavedPrompts(savedPrompts.filter((p) => p.id !== promptId));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      const isValidType =
        file.type.startsWith("image/") || file.type === "application/pdf";
      const isValidSize = file.size <= 10 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      dispatch({
        type: "SET_ERROR",
        payload:
          "Some files were rejected. Only images and PDFs under 10MB are allowed.",
      });
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const activeContent = isSystemMode ? localSystemPrompt : localCurrentPrompt;
  const characterCount = activeContent.length;
  const wordCount = activeContent.trim().split(/\s+/).filter(Boolean).length;

  const TemplateContent = () => (
    <ScrollArea className="h-80">
      <div className="p-2 space-y-3">
        {/* Built-in Templates */}
        {state.templates.length > 0 && (
          <div>
            <h5 className="text-xs font-medium text-muted-foreground mb-2">
              Built-in Templates
            </h5>
            <div className="space-y-1">
              {state.templates.slice(0, 3).map((template) => (
                <div
                  key={template.id}
                  className="p-2 rounded-md hover:bg-accent/10 cursor-pointer"
                  onClick={() => handleLoadTemplate(template)}
                >
                  <div className="flex items-center justify-between">
                    <h6 className="text-sm font-medium">{template.name}</h6>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Prompts */}
        {savedPrompts.length > 0 && (
          <div>
            <h5 className="text-xs font-medium text-muted-foreground mb-2">
              Saved Prompts
            </h5>
            <div className="space-y-1">
              {savedPrompts.slice(0, 5).map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-2 rounded-md hover:bg-accent/10 cursor-pointer group"
                  onClick={() => handleLoadPrompt(prompt)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h6 className="text-sm font-medium">{prompt.name}</h6>
                      {prompt.isFavorite && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(prompt.id);
                        }}
                      >
                        {prompt.isFavorite ? (
                          <StarOff className="h-3 w-3" />
                        ) : (
                          <Star className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePrompt(prompt.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {prompt.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.templates.length === 0 && savedPrompts.length === 0 && (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No templates or saved prompts available
          </div>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Prompt Editor</span>
            <span className="sm:hidden">Prompt</span>
          </CardTitle>

          <div className="flex items-center gap-2">
            {/* TOP-RIGHT MODE TOGGLE */}
            <div className="flex items-center gap-1 rounded-md bg-muted/30 p-1">
              <button
                aria-pressed={!isSystemMode}
                title="Normal Prompt"
                onClick={() => setIsSystemMode(false)}
                className={`px-3 py-1 rounded-md text-sm font-medium focus:outline-none ${
                  !isSystemMode ? "bg-accent/80 text-white" : "opacity-80"
                }`}
              >
                <MessageSquare className="inline mr-1 -mt-[1px]" />
                Prompt
              </button>
              <button
                aria-pressed={isSystemMode}
                title="System Prompt"
                onClick={() => setIsSystemMode(true)}
                className={`px-3 py-1 rounded-md text-sm font-medium focus:outline-none ${
                  isSystemMode ? "bg-accent/80 text-white" : "opacity-80"
                }`}
              >
                <Settings className="inline mr-1 -mt-[1px]" />
                System
              </button>
            </div>

            <MobileParameters />

            {isMobile && (
              <Sheet open={showTemplates} onOpenChange={setShowTemplates}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-hover-lift bg-transparent"
                  >
                    Templates
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Templates & Saved Prompts</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <TemplateContent />
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleSavePrompt}
              disabled={!activeContent.trim()}
            >
              <Save className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Save</span>
            </Button>

            <div className="relative">
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button
                variant="outline"
                size="sm"
                asChild
                className="btn-hover-lift bg-transparent"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Upload</span>
                </label>
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-3 sm:space-y-4 min-h-0">
        {/* The top area will show either System Prompt editor OR the Normal Prompt editor */}
        {isSystemMode ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="system-prompt" className="text-sm font-medium">
                System Prompt{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="system-prompt"
                placeholder="Set the AI's behavior and context..."
                value={localSystemPrompt}
                onChange={(e) => setLocalSystemPrompt(e.target.value)}
                className="min-h-[120px] sm:min-h-[160px] resize-none focus-enhanced"
              />
            </div>

            <Separator />

            {/* Uploaded files still visible in system mode */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Uploaded Files</Label>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-muted rounded-md px-2 py-1 text-xs card-hover"
                    >
                      <span className="truncate max-w-[120px]">
                        {file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 btn-hover-lift"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-4 text-xs text-muted-foreground order-2 sm:order-1">
                <span>{characterCount} chars</span>
                <span>{wordCount} words</span>
              </div>

              <Button
                onClick={handleSendOrApply}
                disabled={state.isLoading || !localSystemPrompt.trim()}
                className="min-w-[120px] order-1 sm:order-2 btn-hover-lift"
                size={isMobile ? "default" : "default"}
              >
                {state.isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-2 animate-enhanced-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Settings className="h-3 w-3 mr-2" />
                    Apply System
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              System prompts set the assistant's behavior and are applied
              globally.
            </p>
          </>
        ) : (
          /* Normal Prompt area */
          <>
            <div className="space-y-2">
              <Label htmlFor="main-prompt" className="text-sm font-medium">
                Prompt
              </Label>
              <Textarea
                id="main-prompt"
                placeholder="Enter your prompt here..."
                value={localCurrentPrompt}
                onChange={(e) => setLocalCurrentPrompt(e.target.value)}
                className="flex-1 min-h-[120px] sm:min-h-[200px] resize-none focus-enhanced"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleSendOrApply();
                  }
                }}
              />
            </div>

            <Separator />

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Uploaded Files</Label>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-muted rounded-md px-2 py-1 text-xs card-hover"
                    >
                      <span className="truncate max-w-[120px]">
                        {file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 btn-hover-lift"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-4 text-xs text-muted-foreground order-2 sm:order-1">
                <span>{characterCount} chars</span>
                <span>{wordCount} words</span>
              </div>

              <Button
                onClick={handleSendOrApply}
                disabled={
                  !localCurrentPrompt.trim() ||
                  state.isLoading ||
                  !state.selectedModel
                }
                className="min-w-[100px] order-1 sm:order-2 btn-hover-lift animate-pulse-glow"
                size={isMobile ? "default" : "default"}
              >
                {state.isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-2 animate-enhanced-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Press Ctrl+Enter to send
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
