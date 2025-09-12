"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "UI/Modal",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A modal dialog component with backdrop blur, keyboard navigation, and focus management. Supports various content types and animations.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
          <DialogDescription>This is a basic modal dialog. You can place any content here.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Modal content goes here. This could be a form, information, or any other content.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const SavePromptModal: Story = {
  render: () => {
    const [promptName, setPromptName] = useState("")

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Save Prompt</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Prompt</DialogTitle>
            <DialogDescription>Give your prompt a name so you can easily find it later.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="prompt-name">Prompt Name</Label>
              <Input
                id="prompt-name"
                placeholder="Enter a name for this prompt..."
                value={promptName}
                onChange={(e) => setPromptName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt-content">Prompt Content</Label>
              <Textarea
                id="prompt-content"
                placeholder="Your prompt content..."
                className="min-h-[100px]"
                readOnly
                value="You are a helpful AI assistant. Please help me with..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button disabled={!promptName.trim()}>Save Prompt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

export const ConfirmationModal: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Conversation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your conversation history.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const SettingsModal: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Settings</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your AI platform preferences and account settings.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">General</h4>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" type="password" placeholder="Enter your API key..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-model">Default Model</Label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>GPT-4</option>
                <option>GPT-3.5 Turbo</option>
                <option>Claude 3 Opus</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Interface</h4>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="auto-save" className="rounded" />
              <Label htmlFor="auto-save">Auto-save prompts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="syntax-highlighting" className="rounded" />
              <Label htmlFor="syntax-highlighting">Enable syntax highlighting</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const LargeContentModal: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Documentation</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>API Documentation</DialogTitle>
          <DialogDescription>Complete guide to using the AI Platform API</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto py-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-medium mb-2">Getting Started</h3>
              <p className="text-muted-foreground mb-4">
                Welcome to the AI Platform API. This guide will help you get started with integrating our AI models into
                your applications.
              </p>
            </section>

            <section>
              <h3 className="font-medium mb-2">Authentication</h3>
              <p className="text-muted-foreground mb-2">All API requests require authentication using an API key:</p>
              <pre className="bg-muted p-3 rounded-md text-xs">
                {`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.aiplatform.com/v1/chat/completions`}
              </pre>
            </section>

            <section>
              <h3 className="font-medium mb-2">Models</h3>
              <p className="text-muted-foreground">
                We support various AI models including GPT-4, GPT-3.5 Turbo, and Claude 3. Each model has different
                capabilities and pricing.
              </p>
            </section>
          </div>
        </div>
        <DialogFooter>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
