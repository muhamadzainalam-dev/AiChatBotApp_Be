const getChatModel = require("../../Models/ScheduleModels/ChatModel");

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const { email, conversationId } = req.query;

    if (!email || !conversationId) {
      return res.status(400).json({ message: "Missing params" });
    }

    const Chat = await getChatModel();

    const chat = await Chat.findOne({ email, conversationId });

    res.status(200).json({
      success: true,
      messages: chat ? chat.messages : [],
    });
  } catch (error) {
    console.error("Get Chat Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Add new message
 */
exports.addMessage = async (req, res) => {
  try {
    const { email, conversationId, role, content } = req.body;

    if (!email || !conversationId || !role || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const Chat = await getChatModel();

    const chat = await Chat.findOneAndUpdate(
      { email, conversationId },
      {
        $push: {
          messages: {
            role,
            content,
            timestamp: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      messages: chat.messages,
    });
  } catch (error) {
    console.error("Add Message Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.clearChat = async (req, res) => {
  try {
    const { email, conversationId } = req.body;

    if (!email || !conversationId) {
      return res.status(400).json({ message: "Missing params" });
    }

    const Chat = await getChatModel();

    await Chat.deleteOne({ email, conversationId });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Clear Chat Error:", error);
    res.status(500).json({ success: false });
  }
};
