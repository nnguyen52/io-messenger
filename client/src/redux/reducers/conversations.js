import { createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";

const conversationsSlice = createSlice({
  name: "conversationsSlice",
  initialState: {
    auth: null,
    conversations: [],
    searchConversations: [],
    activeChat: null,
  },
  reducers: {
    setAuth_forConvos: (state, action) => {
      return {
        ...state,
        auth: action.payload,
      };
    },
    setConversations: (state, action) => {
      if (action.payload?.type == "clearAuth") {
        return {
          ...state,
          auth: null,
        };
      }

      if (action.payload?.type == "search") {
        return {
          ...state,
          searchConversations: action.payload?.conversations,
        };
      }
      return {
        ...state,
        conversations: action.payload?.conversations,
      };
    },
    setActiveChat: (state, action) => {
      return { ...state, activeChat: action.payload };
    },
    addConversation: (state, action) => {
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
      };
    },
    sendMessageActiveChat: (state, action) => {
      if (
        !state.activeChat ||
        action.payload.reqBody.conversationId.toString() !=
          state.activeChat._id.toString()
      )
        return {
          ...state,
        };
      return {
        ...state,
        activeChat: {
          ...state.activeChat,
          messages: [...state.activeChat.messages, action.payload.reqBody],
        },
      };
    },

    sendMessage: (state, action) => {
      if (
        action.payload?.recipient?._id.toString() != state.auth._id.toString()
      )
        return {
          ...state,
        };

      const existingConvo =
        state.conversations.filter(
          (convo) =>
            convo._id.toString() ==
            action.payload.reqBody.conversationId.toString()
        ).length > 0;
      if (!existingConvo) {
        const newConvo = {
          _id: action.payload.reqBody.conversationId,
          user1: action.payload.recipient,
          user2: action.payload.sender,
          messages: [action.payload.reqBody],
          latestMessage: action.payload.reqBody,
          unseenMessages: [],
          lastSeenMessages: [],
          createdAt: new Date().toString(),
          isTypings: [],
        };
        return { ...state, conversations: [...state.conversations, newConvo] };
      }
      return {
        ...state,
        searchConversations: state.searchConversations?.map((convo) => {
          if (
            convo._id.toString() ==
            action.payload.reqBody.conversationId.toString()
          ) {
            return {
              ...convo,
              messages: [...convo.messages, action.payload.reqBody],
            };
          }
          return convo;
        }),
        conversations: state.conversations.map((convo) => {
          if (
            convo._id.toString() ==
            action.payload.reqBody.conversationId.toString()
          ) {
            return {
              ...convo,
              messages: [...convo.messages, action.payload.reqBody],
            };
          }
          return convo;
        }),
      };
    },

    setLatestMessage: (state, action) => {
      if (state.activeChat) {
        state.activeChat = {
          ...state.activeChat,
          latestMessage: action.payload.reqBody,
        };
      }
      if (state.searchConversations)
        state.searchConversations = state.searchConversations.map((convo) => {
          if (convo._id.toString() === action.payload.reqBody.conversationId) {
            return { ...convo, latestMessage: action.payload.reqBody };
          }
          return convo;
        });
      state.conversations = state.conversations.map((convo) => {
        if (
          convo._id.toString() ===
          action.payload.reqBody.conversationId.toString()
        ) {
          return {
            ...convo,
            latestMessage: action.payload.reqBody,
          };
        }
        return convo;
      });
    },
    addNewUnseenMessage: (state, action) => {
      if (state.conversations) {
        state.conversations = state.conversations.map((convo) => {
          if (action.payload.reqBody.conversationId == convo._id.toString()) {
            return {
              ...convo,
              unseenMessages: [
                ...convo?.unseenMessages,
                action.payload?.reqBody,
              ],
            };
          }
          return convo;
        });
      }
      if (state.searchConversations) {
        state.searchConversations = state.searchConversations.map((convo) => {
          if (action.payload.reqBody.conversationId == convo._id.toString()) {
            return {
              ...convo,
              unseenMessages: [...convo.unseenMessages, action.payload.reqBody],
            };
          }
          return convo;
        });
      }
      if (state.activeChat) {
        state.activeChat.unseenMessages = [
          ...state.activeChat.unseenMessages,
          action.payload.reqBody,
        ];
      }
    },
    seenMessage: (state, action) => {
      if (state.searchConversations) {
        state.searchConversations = state.searchConversations.map((convo) => {
          if (
            convo._id.toString() == action.payload.conversationId.toString()
          ) {
            return {
              ...convo,
              unseenMessages: convo.unseenMessages.filter(
                (msg) => msg.recipientId != action.payload.userId.toString()
              ),
            };
          }
          return convo;
        });
      }
      if (state.conversations) {
        state.conversations = state.conversations.map((convo) => {
          if (
            convo._id.toString() == action.payload.conversationId.toString()
          ) {
            return {
              ...convo,
              unseenMessages: convo.unseenMessages.filter(
                (msg) => msg.recipientId != action.payload.userId.toString()
              ),
            };
          }
          return convo;
        });
      }
      if (state.activeChat) {
        state.activeChat.unseenMessages =
          state.activeChat.unseenMessages.filter(
            (msg) => msg.recipientId != action.payload.userId.toString()
          );
      }
    },
    setLastSeenMessage: (state, action) => {
      // for conversations
      state.conversations = state?.conversations?.map((convo) => {
        if (convo._id == action.payload?.conversationId) {
          if (
            !convo?.lastSeenMessages ||
            convo?.lastSeenMessages?.length == 0
          ) {
            return {
              ...convo,
              lastSeenMessages: [action.payload],
            };
          } else if (
            convo.lastSeenMessages.filter(
              (each) => each.recipientId == action.payload.recipientId
            ).length == 0
          ) {
            return {
              ...convo,
              lastSeenMessages: [...convo.lastSeenMessages, action.payload],
            };
          } else {
            return {
              ...convo,
              lastSeenMessages: convo.lastSeenMessages?.map((each) => {
                if (each.recipientId == action.payload.recipientId)
                  return action.payload;
                return each;
              }),
            };
          }
        }
        return convo;
      });
      // for search conversation
      state.searchConversations = state?.searchConversations?.map((convo) => {
        if (convo._id == action.payload?.conversationId) {
          if (
            !convo?.lastSeenMessages ||
            convo?.lastSeenMessages?.length == 0
          ) {
            return {
              ...convo,
              lastSeenMessages: [action.payload],
            };
          } else if (
            convo.lastSeenMessages.filter(
              (each) => each.recipientId == action.payload.recipientId
            ).length == 0
          ) {
            return {
              ...convo,
              lastSeenMessages: [...convo.lastSeenMessages, action.payload],
            };
          } else {
            return {
              ...convo,
              lastSeenMessages: convo.lastSeenMessages?.map((each) => {
                if (each.recipientId == action.payload.recipientId)
                  return action.payload;
                return each;
              }),
            };
          }
        }
        return convo;
      });
      // for active chat
      if (
        state.activeChat &&
        state.activeChat._id.toString() ==
          action.payload?.conversationId?.toString()
      ) {
        if (
          !state.activeChat?.lastSeenMessages ||
          state.activeChat?.lastSeenMessages?.length == 0
        ) {
          state.activeChat.lastSeenMessages = [action.payload];
        } else if (
          state.activeChat.lastSeenMessages.filter(
            (each) => each.recipientId == action.payload.recipientId
          ).length == 0
        ) {
          state.activeChat.lastSeenMessages = [
            ...state.activeChat.lastSeenMessages,
            action.payload,
          ];
        } else {
          state.activeChat.lastSeenMessages =
            state.activeChat?.lastSeenMessages?.map((each) => {
              if (each.recipientId == action.payload.recipientId)
                return action.payload;
              return each;
            });
        }
      }
    },

    setTyping: (state, action) => {
      // for activeChat
      if (state.activeChat) {
        if (
          state.activeChat._id.toString() ==
          action.payload.conversationId.toString()
        ) {
          if (action.payload.type) {
            state.activeChat.isTypings = [
              ...state.activeChat.isTypings,
              action.payload.userId,
            ];
          } else {
            state.activeChat.isTypings = state.activeChat.isTypings.filter(
              (each) => each != action.payload.userId
            );
          }
        }
      }
      // for conversations
      if (state.conversations) {
        state.conversations = state.conversations.map((convo) => {
          if (
            convo._id.toString() == action.payload.conversationId.toString()
          ) {
            if (action.payload.type) {
              return {
                ...convo,
                isTypings: [...convo.isTypings, action.payload.userId],
              };
            } else {
              return {
                ...convo,
                isTypings: convo.isTypings.filter(
                  (each) => each != action.payload.userId
                ),
              };
            }
          }
          return convo;
        });
      }
    },

    changeAuthPhotoUrl_convos: (state, action) => {
      return {
        ...state,
        auth: {
          ...state.auth,
          photoUrl: action.payload,
        },
      };
    },
    changeAuthUsername_convos: (state, action) => {
      return {
        ...state,
        auth: {
          ...state.auth,
          username: action.payload,
        },
      };
    },
    changeAuthPassword_convos: (state, action) => {
      return {
        ...state,
        auth: {
          ...state.auth,
          password: action.payload,
        },
      };
    },

    changePhotoUrl_other: (state, action) => {
      // for conversations
      if (state.conversations) {
        state.conversations = state.conversations.map((convo) => {
          if (
            convo.user1._id == action.payload.userId ||
            convo.user2._id == action.payload.userId
          ) {
            const forUser1 =
              convo.user1._id == action.payload.userId ? true : false;
            if (forUser1)
              return {
                ...convo,
                user1: { ...convo.user1, photoUrl: action.payload.photoUrl },
              };
            else
              return {
                ...convo,
                user2: { ...convo.user2, photoUrl: action.payload.photoUrl },
              };
          }
          return convo;
        });
      }
      // for searchConversations
      if (state.searchConversations) {
        state.searchConversations = state.searchConversations.map((convo) => {
          if (
            convo.user1._id == action.payload.userId ||
            convo.user2._id == action.payload.userId
          ) {
            const forUser1 =
              convo.user1._id == action.payload.userId ? true : false;
            if (forUser1)
              return {
                ...convo,
                user1: { ...convo.user1, photoUrl: action.payload.photoUrl },
              };
            else
              return {
                ...convo,
                user2: { ...convo.user2, photoUrl: action.payload.photoUrl },
              };
          }
          return convo;
        });
      }
      // for active chat
      if (state.activeChat) {
        const forUser1 =
          state.activeChat.user1._id == action.payload.userId ? true : false;
        if (forUser1)
          state.activeChat = {
            ...state.activeChat,
            user1: {
              ...state.activeChat.user1,
              photoUrl: action.payload.photoUrl,
            },
          };
        else
          state.activeChat = {
            ...state.activeChat,
            user2: {
              ...state.activeChat.user2,
              photoUrl: action.payload.photoUrl,
            },
          };
      }
    },
    changeUserName_other: (state, action) => {
      // for conversations
      if (state.conversations) {
        state.conversations = state.conversations.map((convo) => {
          if (
            convo.user1._id == action.payload.userId ||
            convo.user2._id == action.payload.userId
          ) {
            const forUser1 =
              convo.user1._id == action.payload.userId ? true : false;
            if (forUser1)
              return {
                ...convo,
                user1: { ...convo.user1, username: action.payload.username },
              };
            else
              return {
                ...convo,
                user2: { ...convo.user2, username: action.payload.username },
              };
          }
          return convo;
        });
      }
      // for searchConversations
      if (state.searchConversations) {
        state.searchConversations = state.searchConversations.map((convo) => {
          if (
            convo.user1._id == action.payload.userId ||
            convo.user2._id == action.payload.userId
          ) {
            const forUser1 =
              convo.user1._id == action.payload.userId ? true : false;
            if (forUser1)
              return {
                ...convo,
                user1: { ...convo.user1, username: action.payload.username },
              };
            else
              return {
                ...convo,
                user2: { ...convo.user2, username: action.payload.username },
              };
          }
          return convo;
        });
      }
      // for active chat
      if (state.activeChat) {
        const forUser1 =
          state.activeChat.user1._id == action.payload.userId ? true : false;
        if (forUser1)
          state.activeChat = {
            ...state.activeChat,
            user1: {
              ...state.activeChat.user1,
              username: action.payload.username,
            },
          };
        else
          state.activeChat = {
            ...state.activeChat,
            user2: {
              ...state.activeChat.user2,
              username: action.payload.username,
            },
          };
      }
    },
  },
});
export const {
  setAuth_forConvos,
  setConversations,
  setActiveChat,
  sendMessage,
  sendMessageActiveChat,
  addConversation,
  setLatestMessage,
  seenMessage,
  addNewUnseenMessage,
  setLastSeenMessage,
  setTyping,
  changeAuthPhotoUrl_convos,
  changeAuthUsername_convos,
  changeAuthPassword_convos,
  changePhotoUrl_other,
  changeUserName_other,
} = conversationsSlice.actions;
export default conversationsSlice.reducer;
