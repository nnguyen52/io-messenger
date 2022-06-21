const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    recipientId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    conversationId: { type: mongoose.Types.ObjectId, ref: "conversation" },
    text: {
      type: String,
    },
    images: [],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("message", messageSchema);
