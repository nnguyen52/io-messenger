const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    user2: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    messages: [{ type: mongoose.Types.ObjectId, ref: "message" }],
    latestMessage: { type: mongoose.Types.ObjectId, ref: "message" },
    // SEEN function
    // last seen message must always have length <= 2
    lastSeenMessages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "message",
      },
    ],
    unseenMessages: [{ type: mongoose.Types.ObjectId, ref: "message" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("conversation", conversationSchema);
