import type { Meta, StoryObj } from "@storybook/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Settings, Zap } from "lucide-react"

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible card container with header, content, and footer sections. Perfect for displaying grouped information.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area where you can place any information.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Configure your preferences and account details here.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  ),
}

export const ModelCard: Story = {
  render: () => (
    <Card className="w-80 cursor-pointer transition-colors hover:bg-accent/10">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              <h4 className="font-medium">GPT-4</h4>
            </div>
            <Badge variant="secondary">OpenAI</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Most capable GPT model, great for complex reasoning and creative tasks
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Max tokens: 8,192</span>
            <span>$0.03/1k tokens</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              text-generation
            </Badge>
            <Badge variant="outline" className="text-xs">
              reasoning
            </Badge>
            <Badge variant="outline" className="text-xs">
              creative-writing
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
}

export const ParametersCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings className="h-4 w-4" />
          Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Temperature</span>
            <Badge variant="secondary" className="text-xs">
              0.7
            </Badge>
          </div>
          <div className="h-2 bg-muted rounded-full">
            <div className="h-2 bg-accent rounded-full w-[35%]" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Max Tokens</span>
            <Badge variant="secondary" className="text-xs">
              1000
            </Badge>
          </div>
          <div className="h-2 bg-muted rounded-full">
            <div className="h-2 bg-accent rounded-full w-[25%]" />
          </div>
        </div>
      </CardContent>
    </Card>
  ),
}

export const ConversationCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" />
          AI Response
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm">
            I understand you're looking for assistance with this task. Based on your input, here are some thoughtful
            suggestions and insights that might help you move forward effectively.
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>GPT-4 • 2:34 PM</span>
            <span>156 tokens</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
      <Card className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]">
        <CardHeader>
          <CardTitle>Hover Effect</CardTitle>
          <CardDescription>This card has hover animations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Hover over this card to see the effect.</p>
        </CardContent>
      </Card>

      <Card className="border-accent">
        <CardHeader>
          <CardTitle>Selected State</CardTitle>
          <CardDescription>This card appears selected</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">This shows how a selected card might look.</p>
        </CardContent>
      </Card>
    </div>
  ),
}
