"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAI } from "@/contexts/ai-context";
import { Bot, Zap, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

export function ModelSelector() {
  const { state, dispatch } = useAI();
  const [isLoading, setIsLoading] = useState(true);
  const handleModelChange = (modelId: string) => {
    const selectedModel = state.models.find((m) => m.id === modelId);
    if (selectedModel) {
      dispatch({ type: "SELECT_MODEL", payload: selectedModel });
    }
  };

  const availableModels = state.models.filter((model) => model.isAvailable);

  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  return (
    <Card className="h-full animate-fade-in card-hover transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base group">
          <Bot className="h-4 w-4 flex-shrink-0 transition-all duration-300 group-hover:text-accent group-hover:scale-110 group-hover:rotate-12" />
          <span className="truncate transition-colors duration-200 group-hover:text-accent">
            AI Model
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        {/* Model Selection */}
        <div className="space-y-2">
          {isLoading ? (
            <Skeleton className="h-10 w-full rounded-md" /> // 👈 Loading for select box
          ) : (
            <Select
              value={state.selectedModel?.id || ""}
              onValueChange={handleModelChange}
              disabled={availableModels.length === 0}
            >
              <SelectTrigger className="w-full focus-enhanced transition-all duration-200 hover:border-accent/50 hover:bg-accent/5">
                <SelectValue placeholder="Select a model..." />
              </SelectTrigger>
              <SelectContent className="animate-scale-in">
                {availableModels.map((model, index) => (
                  <SelectItem
                    key={model.id}
                    value={model.id}
                    className="cursor-pointer transition-all duration-200 hover:bg-accent/10 stagger-item"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium truncate transition-colors duration-200 hover:text-accent">
                        {model.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className="ml-2 text-xs flex-shrink-0 transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                      >
                        {model.provider}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {!isLoading && availableModels.length === 0 && (
            <div className="flex items-center gap-2 text-destructive text-xs sm:text-sm animate-fade-in">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 animate-gentle-bounce" />
              <span>No models available</span>
            </div>
          )}
        </div>

        {/* Selected Model Details */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />

            <div className="flex gap-2 mt-2">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-6 w-14 rounded-md" />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <Skeleton className="h-14 w-full rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" />
            </div>
          </div>
        ) : (
          state.selectedModel && (
            <>
              <Separator className="animate-fade-in" />
              <div className="space-y-2 sm:space-y-3 animate-slide-in-left">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm truncate transition-colors duration-200 hover:text-accent">
                    {state.selectedModel.name}
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-xs flex-shrink-0 transition-all duration-200 hover:bg-accent/10 hover:border-accent"
                  >
                    {state.selectedModel.provider}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {state.selectedModel.description}
                </p>

                {/* Capabilities */}
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground">
                    Capabilities
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {state.selectedModel.capabilities
                      .slice(0, 4)
                      .map((capability, index) => (
                        <Badge
                          key={capability}
                          variant="secondary"
                          className="text-xs transition-all duration-200 hover:bg-accent hover:text-accent-foreground btn-hover-lift stagger-item"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {capability}
                        </Badge>
                      ))}
                    {state.selectedModel.capabilities.length > 4 && (
                      <Badge
                        variant="outline"
                        className="text-xs transition-all duration-200 hover:bg-accent/10 hover:border-accent"
                      >
                        +{state.selectedModel.capabilities.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md bg-muted p-2 card-hover transition-all duration-300 hover:bg-accent/10 hover:shadow-sm group">
                    <div className="flex items-center gap-1 mb-1">
                      <Zap className="h-3 w-3 transition-all duration-200 group-hover:text-accent group-hover:scale-110" />
                      <span className="font-medium transition-colors duration-200 group-hover:text-accent">
                        Speed
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      {state.selectedModel.contextLength > 50000
                        ? "Fast"
                        : "Very Fast"}
                    </div>
                  </div>
                  <div className="rounded-md bg-muted p-2 card-hover transition-all duration-300 hover:bg-accent/10 hover:shadow-sm group">
                    <div className="font-medium mb-1 transition-colors duration-200 group-hover:text-accent">
                      Context
                    </div>
                    <div className="text-muted-foreground">
                      {(state.selectedModel.contextLength / 1000).toFixed(0)}K
                      tokens
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </CardContent>
    </Card>
  );
}
