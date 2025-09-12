import { NextResponse } from "next/server"

export interface AIModel {
  id: string
  name: string
  description: string
  provider: string
  capabilities: string[]
  maxTokens: number
  costPer1kTokens: number
  isAvailable: boolean
}

const mockModels: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Most advanced GPT model with multimodal capabilities and enhanced reasoning",
    provider: "OpenAI",
    capabilities: ["text-generation", "reasoning", "creative-writing", "code-generation", "analysis"],
    maxTokens: 128000,
    costPer1kTokens: 0.005,
    isAvailable: true,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Faster, cost-effective version of GPT-4o for most tasks",
    provider: "OpenAI",
    capabilities: ["text-generation", "conversation", "summarization", "code-generation"],
    maxTokens: 128000,
    costPer1kTokens: 0.00015,
    isAvailable: true,
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "Enhanced GPT-4 with improved instruction following and JSON mode",
    provider: "OpenAI",
    capabilities: ["text-generation", "reasoning", "creative-writing", "code-generation"],
    maxTokens: 128000,
    costPer1kTokens: 0.01,
    isAvailable: true,
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast and efficient model for most conversational and text tasks",
    provider: "OpenAI",
    capabilities: ["text-generation", "conversation", "summarization"],
    maxTokens: 16385,
    costPer1kTokens: 0.0005,
    isAvailable: true,
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    description: "Anthropic's most powerful model for complex analysis and creative tasks",
    provider: "Anthropic",
    capabilities: ["text-generation", "analysis", "creative-writing", "reasoning"],
    maxTokens: 200000,
    costPer1kTokens: 0.015,
    isAvailable: false, // Not integrated yet
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    description: "Meta's latest open-source model with strong performance",
    provider: "Meta",
    capabilities: ["text-generation", "conversation", "code-generation"],
    maxTokens: 8192,
    costPer1kTokens: 0.0008,
    isAvailable: false, // Not integrated yet
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json({
    models: mockModels,
    total: mockModels.length,
    available: mockModels.filter((m) => m.isAvailable).length,
  })
}
