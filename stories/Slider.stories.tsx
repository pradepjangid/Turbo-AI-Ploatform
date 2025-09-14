"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const meta = {
  title: "UI/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A customizable slider component for selecting numeric values within a range. Supports single and dual handles.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    min: {
      control: { type: "number" },
      description: "Minimum value",
    },
    max: {
      control: { type: "number" },
      description: "Maximum value",
    },
    step: {
      control: { type: "number" },
      description: "Step increment",
    },
    disabled: {
      control: "boolean",
      description: "Whether the slider is disabled",
    },
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
}

export const WithRange: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
  },
}

export const Temperature: Story = {
  render: () => {
    const [temperature, setTemperature] = useState([0.7])

    return (
      <div className="w-80 space-y-4">
        <div className="flex items-center justify-between">
          <Label>Temperature</Label>
          <Badge variant="secondary">{temperature[0]}</Badge>
        </div>
        <Slider value={temperature} onValueChange={setTemperature} min={0} max={2} step={0.1} />
        <p className="text-xs text-muted-foreground">
          Controls randomness. Lower values make output more focused and deterministic.
        </p>
      </div>
    )
  },
}

export const MaxTokens: Story = {
  render: () => {
    const [maxTokens, setMaxTokens] = useState([1000])

    return (
      <div className="w-80 space-y-4">
        <div className="flex items-center justify-between">
          <Label>Max Tokens</Label>
          <Badge variant="secondary">{maxTokens[0]}</Badge>
        </div>
        <Slider value={maxTokens} onValueChange={setMaxTokens} min={1} max={4000} step={50} />
        <p className="text-xs text-muted-foreground">Maximum number of tokens to generate in the response.</p>
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true,
  },
}

export const SmallStep: Story = {
  args: {
    defaultValue: [0.5],
    min: 0,
    max: 1,
    step: 0.01,
  },
}

export const LargeRange: Story = {
  args: {
    defaultValue: [500],
    min: 0,
    max: 10000,
    step: 100,
  },
}
