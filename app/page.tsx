"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { AIProvider } from "@/contexts/ai-context";
import { ModelSelector } from "@/components/ai-interface/model-selector";
import { ParametersPanel } from "@/components/ai-interface/parameters-panel";
import { PromptEditor } from "@/components/ai-interface/prompt-editor";
import { ChatOutput } from "@/components/ai-interface/chat-output";
import { KeyboardShortcuts } from "@/components/accessibility/keyboard-shortcuts";
import { ScreenReaderAnnouncements } from "@/components/accessibility/screen-reader-announcements";
import MainChatInterface from "@/components/ai-interface/main-chat-conversation";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AIProvider>
      <div className="flex h-screen flex-col overflow-hidden">
        <KeyboardShortcuts />
        <ScreenReaderAnnouncements />

        {/* Header full width */}
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
        />

        {/* Body below header */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content */}
          <main
            className="flex-1 overflow-y-auto bg-background smooth-scroll"
            role="main"
            aria-label="Turbo AI ⚡"
          >
            <div className="h-full p-2 sm:p-3 md:p-4">
              <div className="grid h-full gap-2 sm:gap-3 md:gap-4 xl:grid-cols-4">
                {/* Left Panel */}
                <aside
                  className="space-y-2 sm:space-y-3 md:space-y-4 xl:col-span-1 order-1 xl:order-1"
                  aria-label="Model configuration"
                >
                  <section aria-labelledby="model-selector-heading">
                    <h2 id="model-selector-heading" className="sr-only">
                      Model Selection
                    </h2>
                    <ModelSelector />
                  </section>

                  <div className="hidden md:block">
                    <section aria-labelledby="parameters-heading">
                      <h2 id="parameters-heading" className="sr-only">
                        Model Parameters
                      </h2>
                      <ParametersPanel />
                    </section>
                  </div>
                </aside>

                {/* Main Area */}
                <MainChatInterface />
              </div>
            </div>
          </main>
        </div>
      </div>
    </AIProvider>
  );
}
