import { ModelSelector } from '@/components/ai-interface/model-selector';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ModelSelector> = {
  title: 'AI Interface/ModelSelector',
  component: ModelSelector,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    selectedModel: {
      control: { type: 'select' },
      options: ['gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet', 'custom-model'],
    },
    onModelChange: { action: 'model changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedModel: 'gpt-4',
    onModelChange: (modelId: string) => console.log('Selected model:', modelId),
  },
};

export const GPT35Selected: Story = {
  args: {
    selectedModel: 'gpt-3.5-turbo',
    onModelChange: (modelId: string) => console.log('Selected model:', modelId),
  },
};

export const ClaudeSelected: Story = {
  args: {
    selectedModel: 'claude-3-sonnet',
    onModelChange: (modelId: string) => console.log('Selected model:', modelId),
  },
};

export const CustomModelSelected: Story = {
  args: {
    selectedModel: 'custom-model',
    onModelChange: (modelId: string) => console.log('Selected model:', modelId),
  },
};