"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAI } from "@/contexts/ai-context"
import { HelpCircle, RotateCcw, Settings } from "lucide-react"

export function ParametersPanel() {
  const { state, dispatch } = useAI()
  const { parameters } = state

  const updateParameter = (key: keyof typeof parameters, value: number) => {
    dispatch({
      type: "UPDATE_PARAMETERS",
      payload: { [key]: value },
    })
  }

  const resetToDefaults = () => {
    dispatch({
      type: "UPDATE_PARAMETERS",
      payload: {
        temperature: 0.7,
        maxTokens: 1000,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
      },
    })
  }

  return (
    <Card className="animate-fade-in card-hover">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Settings className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">Parameters</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefaults}
            className="h-7 sm:h-8 px-2 text-xs sm:text-sm focus-enhanced btn-hover-lift"
            aria-label="Reset all parameters to default values"
          >
            <RotateCcw className="h-3 w-3 sm:mr-1" aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <TooltipProvider>
          {/* Temperature */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                <Label htmlFor="temperature" className="text-xs sm:text-sm font-medium">
                  Temperature
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="focus-enhanced rounded" aria-label="Temperature help">
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Controls randomness. Lower values make output more focused and deterministic.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Badge
                variant="secondary"
                className="text-xs"
                aria-label={`Temperature value: ${parameters.temperature}`}
              >
                {parameters.temperature}
              </Badge>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={2}
              step={0.1}
              value={[parameters.temperature]}
              onValueChange={([value]) => updateParameter("temperature", value)}
              className="w-full"
              aria-label="Temperature slider"
              aria-valuemin={0}
              aria-valuemax={2}
              aria-valuenow={parameters.temperature}
              aria-valuetext={`Temperature: ${parameters.temperature}`}
            />
          </div>

          {/* Max Tokens */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                <Label htmlFor="maxTokens" className="text-xs sm:text-sm font-medium">
                  Max Tokens
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="focus-enhanced rounded" aria-label="Max tokens help">
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">Maximum number of tokens to generate in the response.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                type="number"
                value={parameters.maxTokens}
                onChange={(e) => updateParameter("maxTokens", Number.parseInt(e.target.value) || 0)}
                className="w-16 sm:w-20 h-6 text-xs focus-enhanced"
                min={1}
                max={state.selectedModel?.maxTokens || 4000}
                aria-label="Max tokens input"
              />
            </div>
            <Slider
              id="maxTokens"
              min={1}
              max={state.selectedModel?.maxTokens || 4000}
              step={50}
              value={[parameters.maxTokens]}
              onValueChange={([value]) => updateParameter("maxTokens", value)}
              className="w-full"
              aria-label="Max tokens slider"
              aria-valuemin={1}
              aria-valuemax={state.selectedModel?.maxTokens || 4000}
              aria-valuenow={parameters.maxTokens}
              aria-valuetext={`Max tokens: ${parameters.maxTokens}`}
            />
          </div>

          {/* Top P */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                <Label htmlFor="topP" className="text-xs sm:text-sm font-medium">
                  Top P
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="focus-enhanced rounded" aria-label="Top P help">
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Controls diversity via nucleus sampling. Lower values focus on more likely tokens.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Badge variant="secondary" className="text-xs" aria-label={`Top P value: ${parameters.topP}`}>
                {parameters.topP}
              </Badge>
            </div>
            <Slider
              id="topP"
              min={0}
              max={1}
              step={0.05}
              value={[parameters.topP]}
              onValueChange={([value]) => updateParameter("topP", value)}
              className="w-full"
              aria-label="Top P slider"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={parameters.topP}
              aria-valuetext={`Top P: ${parameters.topP}`}
            />
          </div>

          <div className="space-y-2 sm:space-y-4">
            <details className="group">
              <summary className="cursor-pointer text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors list-none flex items-center gap-2">
                <span className="transform transition-transform group-open:rotate-90">▶</span>
                Advanced Parameters
              </summary>

              <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 animate-fade-in">
                {/* Frequency Penalty */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Label htmlFor="frequencyPenalty" className="text-xs sm:text-sm font-medium">
                        Frequency Penalty
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="focus-enhanced rounded" aria-label="Frequency penalty help">
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">
                            Reduces repetition by penalizing tokens based on their frequency.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      aria-label={`Frequency penalty value: ${parameters.frequencyPenalty}`}
                    >
                      {parameters.frequencyPenalty}
                    </Badge>
                  </div>
                  <Slider
                    id="frequencyPenalty"
                    min={-2}
                    max={2}
                    step={0.1}
                    value={[parameters.frequencyPenalty]}
                    onValueChange={([value]) => updateParameter("frequencyPenalty", value)}
                    className="w-full"
                    aria-label="Frequency penalty slider"
                    aria-valuemin={-2}
                    aria-valuemax={2}
                    aria-valuenow={parameters.frequencyPenalty}
                    aria-valuetext={`Frequency penalty: ${parameters.frequencyPenalty}`}
                  />
                </div>

                {/* Presence Penalty */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Label htmlFor="presencePenalty" className="text-xs sm:text-sm font-medium">
                        Presence Penalty
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="focus-enhanced rounded" aria-label="Presence penalty help">
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">
                            Encourages new topics by penalizing tokens that have already appeared.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      aria-label={`Presence penalty value: ${parameters.presencePenalty}`}
                    >
                      {parameters.presencePenalty}
                    </Badge>
                  </div>
                  <Slider
                    id="presencePenalty"
                    min={-2}
                    max={2}
                    step={0.1}
                    value={[parameters.presencePenalty]}
                    onValueChange={([value]) => updateParameter("presencePenalty", value)}
                    className="w-full"
                    aria-label="Presence penalty slider"
                    aria-valuemin={-2}
                    aria-valuemax={2}
                    aria-valuenow={parameters.presencePenalty}
                    aria-valuetext={`Presence penalty: ${parameters.presencePenalty}`}
                  />
                </div>
              </div>
            </details>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
