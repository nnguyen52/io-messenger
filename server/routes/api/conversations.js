const router = require("express").Router();
const Conversation = require("../../db/Conversation");
const Message = require("../../db/Message");
const User = require("../../db/User");

router.post("/currentConversations", async (req, res) => {
  // req.body.userId
  // find all cnoversations that have me
  const convos = await Conversation.find().populate([
    "messages",
    "user1",
    "user2",
    "latestMessage",
    "unseenMessages",
    "lastSeenMessages",
  ]);

  let convoWithUser1AsMe = convos.filter(
    (each) =>
      each.user1?._id?.toString() == req.body.userId ||
      each.user2?._id?.toString() == req.body.userId
  );
  convoWithUser1AsMe = convoWithUser1AsMe.filter(
    (each) => each.messages.length > 0
  );
  res.json([...new Set(convoWithUser1AsMe)]);
});

router.post("/sendMessage", async (req, res) => {
  let convo = await Conversation.findOne({
    _id: req.body.conversationId.toString(),
  });
  const newMessage = new Message({
    text: req.body.text ? req.body.text : "",
    recipientId: req.body.recipientId,
    senderId: req.body.senderId,
    conversationId: req.body.conversationId,
    images: req.body.images,
  });
  convo.messages.push(newMessage);
  convo.latestMessage = newMessage;
  convo.unseenMessages = [...convo.unseenMessages, newMessage];
  await convo.save();
  await newMessage.save();
  res
    .status(200)
    .json({ message: "message sent", messageId: newMessage._id.toString() });
});

// new last seen messsage
router.post("/newLastSeenMessage", async (req, res) => {
  if (!req.body?.lastSeenMsg) return;
  const convo = await Conversation.findOne({
    _id: req.body?.lastSeenMsg.conversationId?.toString(),
  }).populate("lastSeenMessages");
  // if existing lastSeenMsgs empty -> add new
  if (convo.lastSeenMessages.length == 0) {
    // console.log("____add fresh new because no one have seen msg");
    await Conversation.findOneAndUpdate(
      { _id: req.body?.lastSeenMsg.conversationId.toString() },
      {
        lastSeenMessages: [req.body.lastSeenMsg._id.toString()],
      }
    );
  } else {
    // filter
    // there will be 2 cases
    // if user1 lastSeenMsg not exist -> add
    // if user1 lastSeenMsg exist -> filter
    if (
      convo.lastSeenMessages.filter(
        (each) => each.senderId == req.body.lastSeenMsg.senderId
      ).length == 0
    ) {
      // console.log("____filtering ");
      return await Conversation.findOneAndUpdate(
        { _id: req.body.lastSeenMsg.conversationId },
        {
          lastSeenMessages: [
            ...convo.lastSeenMessages.map((e) => e._id),
            req.body.lastSeenMsg._id.toString(),
          ],
        }
      );
    } else {
      // console.log("____add new for the other");
      const filteredLastSeenMsgs = convo.lastSeenMessages.map((each) => {
        if (each.senderId == req.body.lastSeenMsg.senderId) {
          return req.body.lastSeenMsg._id.toString();
        }
        return each._id.toString();
      });
      return await Conversation.findOneAndUpdate(
        { _id: req.body.lastSeenMsg.conversationId },
        {
          lastSeenMessages: filteredLastSeenMsgs,
        }
      );
    }
  }
});

// seen message
router.post("/seenMessage", async (req, res) => {
  let convo = await Conversation.findOne({
    _id: req.body.conversationId.toString(),
  }).populate("unseenMessages");

  const newUnseenMessages = convo.unseenMessages.filter(
    (e) => e.recipientId.toString() !== req.user._id.toString()
  );

  await Conversation.findOneAndUpdate(
    {
      _id: req.body.conversationId,
    },
    {
      unseenMessages: newUnseenMessages,
    }
  );
});

router.post("/:search", async (req, res) => {
  // req.params.search
  //search will be name of user 1 or user 2

  let searchUsers = await User.find({
    $or: [
      { username: { $regex: `^${req.params.search}*` } },
      { email: { $regex: `^${req.params.search}*` } },
    ],
  });
  if (searchUsers.length == 0) {
    return res
      .status(200)
      .json({ conversations: [], message: "There is no user or convo" });
  }
  searchUsers = searchUsers.filter(
    (each) =>
      each.username != req.user.username &&
      each._id.toString() !== req.user._id.toString()
  );

  // find conversations based on these users
  let convos = [];
  await Promise.all(
    searchUsers.map(async (each) => {
      const convo = await Conversation.findOne({
        $or: [
          { user1: each._id.toString(), user2: req.user._id.toString() },
          { user2: each._id.toString(), user1: req.user._id.toString() },
        ],
      }).populate("messages");
      if (convo) {
        // console.log("___existing convo", convo);
        convos.push({
          ...convo._doc,
          user1:
            convo.user1.toString() !== req.user._id.toString()
              ? searchUsers.find(
                  (each) => each._id.toString() == convo.user1.toString()
                )
              : req.user,
          user2:
            convo.user2.toString() !== req.user._id.toString()
              ? searchUsers.find(
                  (each) => each._id.toString() == convo.user2.toString()
                )
              : req.user,
        });
      }

      // if searchUsers found but no convo found
      // -> create new convo
      else {
        const newConvo = new Conversation({
          user1: req.user._id.toString(),
          user2: each._id.toString(),
        });
        // console.log("___create new convo", newConvo);
        convos.push({
          ...newConvo._doc,
          user1:
            newConvo._doc.user1.toString() !== req.user._id.toString()
              ? searchUsers.find(
                  (each) =>
                    each._id.toString() == newConvo._doc.user1.toString()
                )
              : req.user,
          user2:
            newConvo._doc.user2.toString() !== req.user._id.toString()
              ? searchUsers.find(
                  (each) =>
                    each._id.toString() == newConvo._doc.user2.toString()
                )
              : req.user,

          // user1:
          //   newConvo.user1.toString() == each._id.toString() ? each : req.user,
          // user2:
          //   newConvo.user1.toString() == req.user._id.toString() ? each : each,
        });
        await newConvo.save();
      }
    })
  );
  return res.status(200).json({ conversations: convos });
});

module.exports = router;
