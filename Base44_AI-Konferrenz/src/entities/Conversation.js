// src/entities/Conversation.js
export const Conversation = {
  name: "Conversation",
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Conversation topic or title"
    },
    left_ai_model: {
      type: "string",
      enum: ["gpt-4", "gpt-3.5", "claude", "palm"],
      default: "gpt-4",
      description: "AI model for left panel"
    },
    right_ai_model: {
      type: "string",
      enum: ["gpt-4", "gpt-3.5", "claude", "palm"],
      default: "gpt-4",
      description: "AI model for right panel"
    },
    messages: {
      type: "array",
      description: "Conversation messages",
      items: {
        type: "object",
        properties: {
          speaker: {
            type: "string",
            enum: ["left_ai", "right_ai", "moderator"]
          },
          message: { type: "string" },
          timestamp: { type: "string", format: "date-time" },
          model_used: { type: "string" }
        }
      }
    },
    status: {
      type: "string",
      enum: ["active", "paused", "completed"],
      default: "paused"
    },
    mode: {
      type: "string",
      enum: ["text_chat", "live_audio"],
      default: "text_chat"
    }
  },
  required: ["title"]
};
