"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { AIProvider } from "@/contexts/ai-context"
import { ModelSelector } from "@/components/ai-interface/model-selector"
import { ParametersPanel } from "@/components/ai-interface/parameters-panel"
import { PromptEditor } from "@/components/ai-interface/prompt-editor"
import { ChatOutput } from "@/components/ai-interface/chat-output"
import { KeyboardShortcuts } from "@/components/accessibility/keyboard-shortcuts"
import { ScreenReaderAnnouncements } from "@/components/accessibility/screen-reader-announcements"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AIProvider>
      <div className="flex h-screen flex-col page-transition">
        <KeyboardShortcuts />
        <ScreenReaderAnnouncements />

        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <main className="flex-1 overflow-hidden" role="main" aria-label="AI Platform Interface">
            <div className="h-full p-2 sm:p-3 md:p-4">
              <div className="grid h-full gap-2 sm:gap-3 md:gap-4 xl:grid-cols-4">
                {/* Left Panel - Model Selection and Parameters */}
                <aside
                  className="space-y-2 sm:space-y-3 md:space-y-4 xl:col-span-1 order-1 xl:order-1"
                  aria-label="Model configuration"
                >
                  <section aria-labelledby="model-selector-heading">
                    <h2 id="model-selector-heading" className="sr-only text-foreground">
                      Model Selection
                    </h2>
                    <ModelSelector />
                  </section>

                  <div className="hidden md:block">
                    <section aria-labelledby="parameters-heading">
                      <h2 id="parameters-heading" className="sr-only text-foreground">
                        Model Parameters
                      </h2>
                      <ParametersPanel />
                    </section>
                  </div>
                </aside>

                {/* Main Content Area */}
                <div className="xl:col-span-3 order-2 xl:order-2 min-h-0">
                  <div className="grid h-full gap-2 sm:gap-3 md:gap-4 grid-rows-2 md:grid-rows-1 md:grid-cols-2 xl:grid-rows-2 xl:grid-cols-1">
                    {/* Prompt Editor */}
                    <section
                      aria-labelledby="prompt-editor-heading"
                      className="row-span-1 md:col-span-1 xl:row-span-1 min-h-0 order-1 md:order-1 xl:order-1"
                    >
                      <h2 id="prompt-editor-heading" className="sr-only text-foreground">
                        Prompt Editor
                      </h2>
                      <PromptEditor />
                    </section>

                    {/* Chat Output */}
                    <section
                      aria-labelledby="chat-output-heading"
                      className="row-span-1 md:col-span-1 xl:row-span-1 min-h-0 order-2 md:order-2 xl:order-2"
                    >
                      <h2 id="chat-output-heading" className="sr-only text-foreground">
                        Conversation Output
                      </h2>
                      <ChatOutput />
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AIProvider>
  )
}
