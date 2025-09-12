import { NextResponse } from "next/server"

export interface PromptTemplate {
  id: string
  name: string
  description: string
  category: string
  prompt: string
  systemPrompt?: string
  parameters: {
    temperature: number
    maxTokens: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
  }
  tags: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

const mockTemplates: PromptTemplate[] = [
  {
    id: "creative-writing",
    name: "Creative Writing Assistant",
    description: "Helps generate creative stories and narratives",
    category: "Creative",
    prompt:
      "You are a creative writing assistant. Help me write a compelling story about {topic}. Focus on vivid descriptions, engaging dialogue, and strong character development.",
    systemPrompt:
      "You are an expert creative writer with years of experience in storytelling, character development, and narrative structure.",
    parameters: {
      temperature: 0.8,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0.3,
      presencePenalty: 0.2,
    },
    tags: ["creative", "writing", "storytelling"],
    isPublic: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "code-reviewer",
    name: "Code Review Assistant",
    description: "Provides detailed code reviews and suggestions",
    category: "Development",
    prompt:
      "Please review the following code and provide feedback on:\n1. Code quality and best practices\n2. Potential bugs or issues\n3. Performance optimizations\n4. Security considerations\n\nCode:\n{code}",
    systemPrompt:
      "You are a senior software engineer with expertise in multiple programming languages and best practices.",
    parameters: {
      temperature: 0.3,
      maxTokens: 800,
      topP: 0.8,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
    },
    tags: ["code", "review", "development", "programming"],
    isPublic: true,
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
  },
  {
    id: "data-analyst",
    name: "Data Analysis Helper",
    description: "Assists with data analysis and interpretation",
    category: "Analytics",
    prompt:
      "Analyze the following data and provide insights:\n\n{data}\n\nPlease include:\n- Key trends and patterns\n- Statistical significance\n- Actionable recommendations\n- Potential limitations of the analysis",
    systemPrompt:
      "You are a data scientist with expertise in statistical analysis, data visualization, and business intelligence.",
    parameters: {
      temperature: 0.4,
      maxTokens: 1200,
      topP: 0.85,
      frequencyPenalty: 0.2,
      presencePenalty: 0.1,
    },
    tags: ["data", "analysis", "statistics", "insights"],
    isPublic: true,
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "marketing-copy",
    name: "Marketing Copy Generator",
    description: "Creates compelling marketing content and copy",
    category: "Marketing",
    prompt:
      "Create compelling marketing copy for {product/service}. The target audience is {audience}. The key benefits are {benefits}. The tone should be {tone}.\n\nPlease include:\n- Attention-grabbing headline\n- Persuasive body copy\n- Strong call-to-action",
    systemPrompt:
      "You are a marketing copywriter with expertise in persuasive writing, consumer psychology, and brand messaging.",
    parameters: {
      temperature: 0.7,
      maxTokens: 600,
      topP: 0.9,
      frequencyPenalty: 0.4,
      presencePenalty: 0.3,
    },
    tags: ["marketing", "copywriting", "advertising", "persuasion"],
    isPublic: true,
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "research-assistant",
    name: "Research Assistant",
    description: "Helps with research tasks and information synthesis",
    category: "Research",
    prompt:
      "Research the topic: {topic}\n\nProvide a comprehensive overview including:\n- Key concepts and definitions\n- Current state of knowledge\n- Recent developments or trends\n- Reliable sources and references\n- Areas for further investigation",
    systemPrompt:
      "You are a research assistant with access to extensive knowledge across multiple domains and expertise in information synthesis.",
    parameters: {
      temperature: 0.5,
      maxTokens: 1500,
      topP: 0.8,
      frequencyPenalty: 0.2,
      presencePenalty: 0.2,
    },
    tags: ["research", "information", "synthesis", "academic"],
    isPublic: true,
    createdAt: "2024-01-11T11:20:00Z",
    updatedAt: "2024-01-11T11:20:00Z",
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json({
    templates: mockTemplates,
    total: mockTemplates.length,
    categories: [...new Set(mockTemplates.map((t) => t.category))],
  })
}

export async function POST(request: Request) {
  try {
    const template: Omit<PromptTemplate, "id" | "createdAt" | "updatedAt"> = await request.json()

    // Simulate saving template
    await new Promise((resolve) => setTimeout(resolve, 200))

    const newTemplate: PromptTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(newTemplate, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create template" }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Template ID is required" }, { status: 400 })
    }

    const updatedTemplate: Partial<PromptTemplate> = await request.json()

    // Simulate updating template
    await new Promise((resolve) => setTimeout(resolve, 200))

    const template: PromptTemplate = {
      ...(updatedTemplate as PromptTemplate),
      id,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update template" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Template ID is required" }, { status: 400 })
    }

    // Simulate deleting template
    await new Promise((resolve) => setTimeout(resolve, 200))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete template" }, { status: 400 })
  }
}
