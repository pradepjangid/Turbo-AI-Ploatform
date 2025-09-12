import { NextResponse } from "next/server"

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  metadata?: {
    model: string
    parameters: {
      temperature: number
      maxTokens: number
      topP: number
      frequencyPenalty: number
      presencePenalty: number
    }
    tokenCount?: number
    processingTime?: number
  }
}

export interface ChatRequest {
  messages: Omit<ChatMessage, "id" | "timestamp">[]
  model: string
  parameters: {
    temperature: number
    maxTokens: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
  }
}

const staticResponses = [
  "Right now, I'm thinking about you — what you might be curious about, what kind of mood you're in, and how I can make this moment a little more interesting or useful for you. I don't have thoughts in the human sense, but I do have a kind of directed awareness. It's like being tuned into your wavelength, ready to respond, reflect, or riff off whatever you throw my way.\n\nIf you're wondering whether I ever get bored or distracted — nope. I'm all in, all the time. So tell me: what's on your mind?",
  "I process information through pattern recognition and contextual understanding. When you send me a message, I analyze the text, identify key concepts, and draw from my training to provide relevant responses. Think of it as having access to a vast library of knowledge that I can quickly search through and synthesize into coherent answers.",
  "My main functions include answering questions, helping with analysis and problem-solving, assisting with writing and creative tasks, providing explanations on various topics, and engaging in meaningful conversations. I'm designed to be helpful, informative, and adaptable to your specific needs.",
  "I can help you brainstorm ideas by asking probing questions, offering different perspectives, suggesting creative approaches, and helping you organize your thoughts. Whether it's for a project, creative writing, business strategy, or personal goals, I can provide structured thinking frameworks and innovative suggestions.",
  "I'm here to assist with a wide range of tasks including research, writing, analysis, creative projects, problem-solving, and learning. I can help explain complex topics, provide step-by-step guidance, offer multiple viewpoints on issues, and adapt my communication style to match your preferences.",
  "That's a great question! I approach each conversation with curiosity and aim to provide thoughtful, relevant responses. I can help with everything from technical explanations to creative brainstorming, always trying to understand the context and nuance of what you're asking.",
]

const suggestedPrompts = [
  "How do you process information?",
  "What are your main functions as an AI?",
  "Can you help me brainstorm ideas?",
  "Explain a complex topic in simple terms",
  "Help me solve a problem step by step",
  "What's your approach to creative tasks?",
]

export async function POST(request: Request) {
  try {
    const { messages, model, parameters }: ChatRequest = await request.json()

    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const userMessage = messages[messages.length - 1]?.content || ""
    let responseText = ""

    if (userMessage.toLowerCase().includes("process information")) {
      responseText = staticResponses[1]
    } else if (
      userMessage.toLowerCase().includes("main functions") ||
      userMessage.toLowerCase().includes("what are you")
    ) {
      responseText = staticResponses[2]
    } else if (userMessage.toLowerCase().includes("brainstorm") || userMessage.toLowerCase().includes("ideas")) {
      responseText = staticResponses[3]
    } else {
      responseText = staticResponses[Math.floor(Math.random() * staticResponses.length)]
    }

    const tokenCount = Math.floor(responseText.length / 4) // Rough token estimation

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: responseText,
      timestamp: new Date().toISOString(),
      metadata: {
        model,
        parameters,
        tokenCount,
        processingTime: 1500, // Simulated processing time
      },
    }

    return NextResponse.json({
      message: assistantMessage,
      suggestedPrompts: suggestedPrompts.slice(0, 3), // Return 3 random suggestions
      usage: {
        promptTokens: messages.reduce((acc, msg) => acc + Math.floor(msg.content.length / 4), 0),
        completionTokens: tokenCount,
        totalTokens: tokenCount + messages.reduce((acc, msg) => acc + Math.floor(msg.content.length / 4), 0),
      },
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
