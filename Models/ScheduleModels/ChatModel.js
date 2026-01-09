const mongoose = require("mongoose");
const { Schema } = mongoose;
const connectDB = require("../../lib/ConnectToDB");

let Chat;

async function getChatModel() {
  if (Chat) return Chat;

  const chatDB = await connectDB();

  const MessageSchema = new Schema(
    {
      role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
    { _id: false }
  );

  const ChatSchema = new Schema(
    {
      email: {
        type: String,
        required: true,
        index: true,
      },
      conversationId: {
        type: String,
        required: true,
        index: true,
      },
      messages: [MessageSchema],
    },
    {
      timestamps: true, // createdAt, updatedAt
    }
  );

  Chat = chatDB.model("Chat", ChatSchema, "ChatHistory_App_COL");

  return Chat;
}

module.exports = getChatModel;
