"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type { AIModel } from "@/app/api/models/route";
import type { PromptTemplate } from "@/app/api/templates/route";
import type { ChatMessage } from "@/app/api/chat/route";

interface AIParameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

interface AIState {
  selectedModel: AIModel | null;
  models: AIModel[];
  templates: PromptTemplate[];
  messages: ChatMessage[];
  parameters: AIParameters;
  isLoading: boolean;
  error: string | null;
  currentPrompt: string;
  systemPrompt: string;
}

type AIAction =
  | { type: "SET_MODELS"; payload: AIModel[] }
  | { type: "SET_TEMPLATES"; payload: PromptTemplate[] }
  | { type: "SELECT_MODEL"; payload: AIModel }
  | { type: "UPDATE_PARAMETERS"; payload: Partial<AIParameters> }
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "SET_MESSAGES"; payload: ChatMessage[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CURRENT_PROMPT"; payload: string }
  | { type: "SET_SYSTEM_PROMPT"; payload: string }
  | { type: "CLEAR_CONVERSATION" }
  | { type: "RESTORE_STATE"; payload: Partial<AIState> }
  | { type: "SAVE_TO_HISTORY" };

const initialState: AIState = {
  selectedModel: null,
  models: [],
  templates: [],
  messages: [],
  parameters: {
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
  },
  isLoading: false,
  error: null,
  currentPrompt: "",
  systemPrompt: "",
};

function aiReducer(state: AIState, action: AIAction): AIState {
  switch (action.type) {
    case "SET_MODELS":
      return { ...state, models: action.payload };
    case "SET_TEMPLATES":
      return { ...state, templates: action.payload };
    case "SELECT_MODEL":
      return { ...state, selectedModel: action.payload };
    case "UPDATE_PARAMETERS":
      return {
        ...state,
        parameters: { ...state.parameters, ...action.payload },
      };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_CURRENT_PROMPT":
      return { ...state, currentPrompt: action.payload };
    case "SET_SYSTEM_PROMPT":
      return { ...state, systemPrompt: action.payload };
    case "CLEAR_CONVERSATION":
      return { ...state, messages: [] };
    case "RESTORE_STATE":
      return { ...state, ...action.payload };
    case "SAVE_TO_HISTORY":
      // This will be handled by the context provider
      return state;
    default:
      return state;
  }
}

const STORAGE_KEYS = {
  CONVERSATION: "ai-platform-conversation",
  PARAMETERS: "ai-platform-parameters",
  SELECTED_MODEL: "ai-platform-selected-model",
  SYSTEM_PROMPT: "ai-platform-system-prompt",
  CHAT_HISTORY: "ai-chat-history",
} as const;

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`[v0] Failed to save to localStorage:`, error);
  }
};

const loadFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`[v0] Failed to load from localStorage:`, error);
    return null;
  }
};

const AIContext = createContext<{
  state: AIState;
  dispatch: React.Dispatch<AIAction>;
  sendMessage: (content: string) => Promise<void>;
  loadTemplate: (template: PromptTemplate) => void;
  saveConversation: () => void;
  loadConversation: () => void;
  clearAllData: () => void;
  saveCurrentToHistory: () => void;
  startNewConversation: () => void;
} | null>(null);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(aiReducer, initialState);

  useEffect(() => {
    let isMounted = true;

    const loadPersistedData = () => {
      const savedParameters = loadFromStorage(STORAGE_KEYS.PARAMETERS);
      const savedSystemPrompt = loadFromStorage(STORAGE_KEYS.SYSTEM_PROMPT);
      const savedConversation = loadFromStorage(STORAGE_KEYS.CONVERSATION);

      if (!isMounted) return;

      if (savedParameters) {
        dispatch({ type: "UPDATE_PARAMETERS", payload: savedParameters });
      }

      if (savedSystemPrompt) {
        dispatch({ type: "SET_SYSTEM_PROMPT", payload: savedSystemPrompt });
      }

      if (savedConversation && Array.isArray(savedConversation)) {
        dispatch({ type: "SET_MESSAGES", payload: savedConversation });
      }
    };

    loadPersistedData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isMounted) return;

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const [modelsRes, templatesRes] = await Promise.all([
          fetch("/api/models"),
          fetch("/api/templates"),
        ]);

        if (!isMounted) return;

        const modelsData = await modelsRes.json();
        const templatesData = await templatesRes.json();

        dispatch({ type: "SET_MODELS", payload: modelsData.models });
        dispatch({ type: "SET_TEMPLATES", payload: templatesData.templates });

        const savedModelId = loadFromStorage(STORAGE_KEYS.SELECTED_MODEL);
        let modelToSelect = null;

        if (savedModelId) {
          modelToSelect = modelsData.models.find(
            (m: AIModel) => m.id === savedModelId && m.isAvailable
          );
        }

        if (!modelToSelect) {
          modelToSelect = modelsData.models.find((m: AIModel) => m.isAvailable);
        }

        if (modelToSelect && isMounted) {
          dispatch({ type: "SELECT_MODEL", payload: modelToSelect });
        }
      } catch (error) {
        if (isMounted) {
          dispatch({ type: "SET_ERROR", payload: "Failed to load data" });
        }
      } finally {
        if (isMounted) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(STORAGE_KEYS.CONVERSATION, state.messages);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [state.messages]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(STORAGE_KEYS.PARAMETERS, state.parameters);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [state.parameters]);

  useEffect(() => {
    if (state.selectedModel) {
      const timeoutId = setTimeout(() => {
        saveToStorage(STORAGE_KEYS.SELECTED_MODEL, state.selectedModel?.id);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [state.selectedModel]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(STORAGE_KEYS.SYSTEM_PROMPT, state.systemPrompt);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [state.systemPrompt]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!state.selectedModel) {
        dispatch({ type: "SET_ERROR", payload: "No model selected" });
        return;
      }

      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      dispatch({ type: "ADD_MESSAGE", payload: userMessage });
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const messages = [...state.messages, userMessage];
        if (state.systemPrompt) {
          messages.unshift({
            id: "system",
            role: "system",
            content: state.systemPrompt,
            timestamp: new Date().toISOString(),
          });
        }

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messages.map(({ id, timestamp, ...msg }) => msg),
            model: state.selectedModel.id,
            parameters: state.parameters,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();
        dispatch({ type: "ADD_MESSAGE", payload: data.message });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to send message" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [state.selectedModel, state.messages, state.systemPrompt, state.parameters]
  );

  const loadTemplate = useCallback((template: PromptTemplate) => {
    dispatch({ type: "SET_CURRENT_PROMPT", payload: template.prompt });
    dispatch({
      type: "SET_SYSTEM_PROMPT",
      payload: template.systemPrompt || "",
    });
    dispatch({ type: "UPDATE_PARAMETERS", payload: template.parameters });
  }, []);

  const saveConversation = useCallback(() => {
    const conversationData = {
      messages: state.messages,
      model: state.selectedModel?.name,
      parameters: state.parameters,
      systemPrompt: state.systemPrompt,
      savedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(conversationData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-conversation-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [
    state.messages,
    state.selectedModel,
    state.parameters,
    state.systemPrompt,
  ]);

  const loadConversation = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.messages && Array.isArray(data.messages)) {
              dispatch({ type: "SET_MESSAGES", payload: data.messages });
            }
            if (data.parameters) {
              dispatch({ type: "UPDATE_PARAMETERS", payload: data.parameters });
            }
            if (data.systemPrompt) {
              dispatch({
                type: "SET_SYSTEM_PROMPT",
                payload: data.systemPrompt,
              });
            }
          } catch (error) {
            dispatch({
              type: "SET_ERROR",
              payload: "Failed to load conversation file",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  const saveCurrentToHistory = useCallback(() => {
    if (state.messages.length === 0) return;

    const chatHistory = loadFromStorage(STORAGE_KEYS.CHAT_HISTORY) || [];
    const title = generateConversationTitle(state.messages);

    const newConversation = {
      id: `conv-${Date.now()}`,
      title,
      messages: state.messages,
      model: state.selectedModel?.name || "Unknown",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: state.messages.length,
    };

    const updatedHistory = [newConversation, ...chatHistory.slice(0, 49)]; // Keep max 50
    saveToStorage(STORAGE_KEYS.CHAT_HISTORY, updatedHistory);
  }, [state.messages, state.selectedModel]);

  const startNewConversation = useCallback(() => {
    if (state.messages.length > 0) {
      saveCurrentToHistory();
    }

    dispatch({ type: "CLEAR_CONVERSATION" });
    dispatch({ type: "SET_CURRENT_PROMPT", payload: "" });
  }, [state.messages, saveCurrentToHistory]);

  const generateConversationTitle = useCallback(
    (messages: ChatMessage[]): string => {
      const firstUserMessage = messages.find((m) => m.role === "user");
      if (firstUserMessage) {
        const content = firstUserMessage.content.trim();
        return content.length > 50 ? content.substring(0, 50) + "..." : content;
      }
      return `Conversation ${new Date().toLocaleDateString()}`;
    },
    []
  );

  const clearAllData = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    dispatch({ type: "CLEAR_CONVERSATION" });
    dispatch({ type: "SET_CURRENT_PROMPT", payload: "" });
    dispatch({ type: "SET_SYSTEM_PROMPT", payload: "" });
    dispatch({ type: "UPDATE_PARAMETERS", payload: initialState.parameters });
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      sendMessage,
      loadTemplate,
      saveConversation,
      loadConversation,
      clearAllData,
      saveCurrentToHistory,
      startNewConversation,
    }),
    [
      state,
      sendMessage,
      loadTemplate,
      saveConversation,
      loadConversation,
      clearAllData,
      saveCurrentToHistory,
      startNewConversation,
    ]
  );

  return (
    <AIContext.Provider value={contextValue}>{children}</AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
}
