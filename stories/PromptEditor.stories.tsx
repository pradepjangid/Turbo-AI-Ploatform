import { PromptEditor } from "@/components/ai-interface/prompt-editor";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PromptEditor> = {
  title: "AI Interface/PromptEditor",
  component: PromptEditor,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    onPromptChange: { action: "prompt changed" },
    onSendMessage: { action: "message sent" },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    prompt: "",
    isLoading: false,
    disabled: false,
    onPromptChange: (prompt: string) => console.log("Prompt changed:", prompt),
    onSendMessage: () => console.log("Send message"),
  },
};

export const WithPrompt: Story = {
  args: {
    prompt:
      "Write a creative story about a robot learning to paint. Include vivid descriptions and emotional depth.",
    isLoading: false,
    disabled: false,
    onPromptChange: (prompt: string) => console.log("Prompt changed:", prompt),
    onSendMessage: () => console.log("Send message"),
  },
};

export const Loading: Story = {
  args: {
    prompt: "Explain quantum computing in simple terms",
    isLoading: true,
    disabled: false,
    onPromptChange: (prompt: string) => console.log("Prompt changed:", prompt),
    onSendMessage: () => console.log("Send message"),
  },
};

export const Disabled: Story = {
  args: {
    prompt: "This editor is disabled",
    isLoading: false,
    disabled: true,
    onPromptChange: (prompt: string) => console.log("Prompt changed:", prompt),
    onSendMessage: () => console.log("Send message"),
  },
};

export const LongPrompt: Story = {
  args: {
    prompt: `You are an expert software engineer with 15+ years of experience in full-stack development. I need you to review the following React component and provide detailed feedback on:

1. Code quality and best practices
2. Performance optimizations
3. Accessibility considerations
4. TypeScript usage and type safety
5. Testing strategies
6. Security implications
7. Maintainability and scalability

Please be thorough in your analysis and provide specific, actionable recommendations for improvement. Include code examples where appropriate and explain the reasoning behind each suggestion.`,
    isLoading: false,
    disabled: false,
    onPromptChange: (prompt: string) => console.log("Prompt changed:", prompt),
    onSendMessage: () => console.log("Send message"),
  },
};
