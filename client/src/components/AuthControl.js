import React, { useEffect, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/reducers/auth";
import axios from "axios";
import { useRouter } from "next/router";
import { SocketContext } from "../context/socket";
import { setOnlineUsers } from "../redux/reducers/socket";
import {
  setAuth_forConvos,
  addConversation,
  sendMessage,
  sendMessageActiveChat,
  setActiveChat,
  setConversations,
  setLatestMessage,
  seenMessage,
  addNewUnseenMessage,
  setLastSeenMessage,
  setTyping,
  changePhotoUrl_other,
  changeUserName_other,
} from "../redux/reducers/conversations";
import useDebounce from "../utils/debounce";
import { toast } from "react-toastify";
import ToggleColorMode from "../context/darkMode";

const AuthControl = ({ children }) => {
  const socket = useContext(SocketContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth);
  const [isFetching, setIsfetching] = useState(true);
  const { conversations, activeChat } = useSelector(
    (state) => state.conversations
  );
  const [search, setSearch] = useState();
  const searchDebouncedValue = useDebounce(search, 500);

  //................SOCKET SECTION .......................
  // socket
  useEffect(() => {
    socket.on("add-online-user", (id) => {
      dispatch(setOnlineUsers({ id: id.toString() }));
    });
    socket.on("logout", (id) =>
      dispatch(setOnlineUsers({ id: id.toString(), logout: true }))
    );
    socket.on("onlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers({ onlineUsers }));
    });
    socket.on("sendMessage", newMessage);
    socket.on("i-seen-return", iSeenReturn);
    socket.on("new-last-seen-message", newLastSeenMessage);
    socket.on("typing", typing);
    socket.on("changePhotoUrl_other", changePhotoUrl_other);
    socket.on("changeUserName_other", changeUserName_other);

    return () => {
      socket.off("add-online-user");
      socket.off("logout");
      socket.off("onlineUsers");
      socket.off("sendMessage");
      socket.off("i-seen-return");
      socket.off("new-last-seen-message");
      socket.off("typing");
      socket.off("changePhotoUrl_other");
      socket.off("changeUserName_other");
      socket.close();
    };
  }, [socket]);

  const newMessage = useCallback(
    (data) => {
      dispatch(sendMessageActiveChat(data));
      dispatch(sendMessage(data));
      dispatch(setLatestMessage(data));
      dispatch(addNewUnseenMessage(data));
    },
    [dispatch]
  );

  const iSeenReturn = useCallback(
    (data) => {
      dispatch(seenMessage(data));
    },
    [dispatch]
  );

  const newLastSeenMessage = useCallback(
    (data) => {
      dispatch(setLastSeenMessage(data));
    },
    [dispatch]
  );

  const typing = useCallback(
    (data) => {
      dispatch(setTyping(data));
    },
    [dispatch]
  );

  const changePhotoUrl_other = useCallback(
    (data) => {
      dispatch(changePhotoUrl_other(data));
    },
    [dispatch]
  );
  const changeUserName_other = useCallback(
    (data) => {
      dispatch(changeUserName_other(data));
    },
    [dispatch]
  );

  //......................................................

  // fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/auth/user");
        const { data: onlineUsers } = await axios.get("/auth/onlineUsers");
        if (data._id) {
          dispatch(setUser(data));
          dispatch(setAuth_forConvos(data));
          dispatch(setOnlineUsers({ id: data._id.toString() }));
          dispatch(setOnlineUsers({ onlineUsers }));
          socket.emit("go-online", data._id);
          setIsfetching(false);
        } else {
          if (router.route == "/register" || router.route == "/login")
            return setTimeout(() => {
              setIsfetching(false);
            }, 200);
          router.push("/login");
          setTimeout(() => {
            setIsfetching(false);
          }, 200);
        }
      } catch (error) {
        console.error("Not found user", error);
      }
    };
    if (userData?._id) {
      console.log("Already logged in-> go to home");
      router.push("/");
    } else fetchUser();
  }, [userData?._id, dispatch]);

  // fetch conversations
  useEffect(() => {
    if (!userData?._id) return;
    const getConvos = async () => {
      const { data } = await axios({
        method: "post",
        url: "/api/conversations/currentConversations",
        data: { userId: userData._id.toString() },
      });
      dispatch(
        setConversations({
          conversations: data.map((convo) => {
            return { ...convo, isTypings: [] };
          }),
        })
      );
    };
    getConvos();
  }, [userData?._id]);

  // search conversations
  useEffect(() => {
    if (!search) {
      dispatch(setConversations({ type: "search", conversations: [] }));
      return;
    }
    const searchConvo = async () => {
      const { data } = await axios.post(`/api/conversations/${search}`);
      dispatch(
        setConversations({
          conversations: data.conversations.map((convo) => {
            return {
              ...convo,
              isTypings: [],
            };
          }),
          type: "search",
        })
      );
    };
    searchConvo();
  }, [searchDebouncedValue, dispatch]);

  const handleChangeSearch = (e) => {
    setSearch(e.currentTarget.value);
  };
  const handleSumitSearch = async (e) => {
    e.preventDefault();
    const form = e.currentTarget.elements;
    setSearch(form.search.value);
  };

  // ...........App funtions ..........................
  // if not logged in -> push to login
  useEffect(() => {
    if (isFetching || !userData) router.push("/login");
    if (!isFetching && !userData._id) {
      if (router.route == "/login" || router.route == "/register") {
        return;
      }
      router.push("/login");
    }
  }, [isFetching]);

  // get all current online users
  useEffect(() => {
    if (!userData || !userData._id || isFetching) return;
    dispatch(setOnlineUsers({ id: userData._id.toString() }));
    socket.emit("onlineUsers");
  }, [userData?._id, isFetching, dispatch, socket]);

  // seen message
  useEffect(() => {
    if (!activeChat || !activeChat.unseenMessages) return;
    dispatch(
      seenMessage({
        conversationId: activeChat._id.toString(),
        userId: userData._id.toString(),
      })
    );
    const lastSeenMsg = activeChat.messages.filter(
      (each) => each.senderId.toString() != userData._id.toString()
    )[
      activeChat.messages.filter(
        (each) => each.senderId.toString() != userData._id.toString()
      ).length - 1
    ];
    dispatch(setLastSeenMessage({ ...lastSeenMsg }));
    socket.emit("i seen", {
      conversationId: activeChat._id.toString(),
      userId: userData._id.toString(),
    });
    socket.emit("new-last-seen-message", {
      ...lastSeenMsg,
    });
    const seenMessageServer = async () => {
      await axios.post("/api/conversations/seenMessage", {
        userId: userData._id,
        conversationId: activeChat._id,
      });
    };
    const newLastSeenMessage = async () => {
      await axios.post("/api/conversations/newLastSeenMessage", {
        lastSeenMsg,
      });
    };
    newLastSeenMessage();
    seenMessageServer();
  }, [
    activeChat?.unseenMessages?.length,
    activeChat?._id.toString(),
    dispatch,
    socket,
  ]);

  //....................................................

  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/auth/login", credentials);
      const { data: onlineUsers } = await axios.get("/auth/onlineUsers");
      await localStorage.setItem("cvTok", data?.token);
      dispatch(setUser(data.user));
      dispatch(setAuth_forConvos(data.user));
      dispatch(setOnlineUsers({ onlineUsers }));
      socket.emit("go-online", data.user._id.toString());
      setIsfetching(false);
      router.push("/");
    } catch (error) {
      dispatch(setUser(null));
      toast.error(error.response.data.error);
      // console.error("___LOGIN ERROR:", error);
      dispatch(
        setUser({ error: error?.response?.data?.error || "Server Error" })
      );
    }
  };

  const register = async (credentials) => {
    try {
      const { data } = await axios.post("/auth/register", credentials);
      const { data: onlineUsers } = await axios.get("/auth/onlineUsers");
      await localStorage.setItem("cvTok", data.token);
      dispatch(setUser(data));
      dispatch(setAuth_forConvos(data));
      dispatch(setOnlineUsers({ onlineUsers }));
      socket.emit("go-online", data.user._id);
      setIsfetching(false);
      router.push("/");
    } catch (error) {
      // console.error("___REGISTER ERROR:", error);
      toast.error(data.response.data.error);
      dispatch(
        setUser({ error: error?.response?.data?.error || "Server Error" })
      );
    }
  };

  const logout = async () => {
    try {
      if (confirm("Logging out?")) {
        socket.emit("logout", userData._id);
        await axios.delete("/auth/logout");
        await localStorage.removeItem("cvTok");
        dispatch(setUser(null));
        dispatch(setActiveChat(null));
        dispatch(setConversations({ conversations: [] }));
        dispatch(setConversations({ type: "search", conversations: [] }));
        dispatch(setConversations({ type: "clearAuth" }));
        router.push("/login");
      }
    } catch (error) {
      console.error("CAN NOT LOG OUT", error);
    }
  };
  const handleLogout = async () => {
    await logout();
  };

  // select active chat
  const selectActiveChat = (conversation) => {
    if (activeChat && activeChat._id.toString() == conversation._id.toString())
      return;
    if (
      conversations.filter(
        (each) => each?._id.toString() == conversation._id.toString()
      ).length == 0
    ) {
      dispatch(addConversation(conversation));
    }
    dispatch(setActiveChat(conversation));
  };

  // send Message
  const postMessage = async (reqBody, recipient) => {
    if (reqBody.text == "" && reqBody?.images?.length == 0) return;
    if (activeChat._id.toString() == reqBody.conversationId.toString()) {
      dispatch(sendMessageActiveChat({ reqBody }));
    }
    dispatch(sendMessage({ reqBody }));
    dispatch(setLatestMessage({ reqBody }));
    dispatch(addNewUnseenMessage({ reqBody, sender: userData, recipient }));
    // server side
    const { data } = await axios.post(
      "/api/conversations/sendMessage",
      reqBody
    );
    // send to recipient
    socket.emit("sendMessage", {
      reqBody: { ...reqBody, _id: data.messageId },
      sender: userData,
      recipient,
    });
  };

  if (isFetching || (!userData._id && isFetching))
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "black",
          color: "white",
        }}
      >
        <h2> Loading...</h2>
      </div>
    );
  else
    return (
      <>
        {/* darkmode */}
        <ToggleColorMode>
          {React.cloneElement(children, {
            login,
            register,
            logout,
            handleLogout,
            postMessage,
            selectActiveChat,
            handleSumitSearch,
            handleChangeSearch,
          })}
        </ToggleColorMode>
      </>
    );
};

export default AuthControl;
