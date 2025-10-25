const Chat = require("../models/chatModel");

// Get chat by seller
exports.getChat = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const chat = await Chat.findOne({
      buyerId: req.user.id,
      sellerId,
    });
    res.json(chat || { messages: [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to load chat", error });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { text } = req.body;

    let chat = await Chat.findOne({ buyerId: req.user.id, sellerId });
    if (!chat) chat = new Chat({ buyerId: req.user.id, sellerId, messages: [] });

    chat.messages.push({ sender: "buyer", text });
    await chat.save();

    res.json({ message: "Message sent", chat });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error });
  }
};
