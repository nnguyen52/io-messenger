import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MyBubble from "./MyBubble";
import OtherBubble from "./OtherBubble";
import { makeStyles } from "@mui/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "1em",
  },
  myBubble: {
    maxWidth: "50%",
    width: "100%",
    alignSelf: "end",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  otherBubble: {
    maxWidth: "50%",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
}));
const Messages = ({ moreSpacesForImages, images }) => {
  const classes = useStyles();
  const meData = useSelector((state) => state.auth);

  const { activeChat } = useSelector((state) => state.conversations);

  const bottomRef = useRef();
  const scrollToBottom = () => {
    bottomRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (!activeChat) return;
    scrollToBottom();
  }, [activeChat?.messages, images?.length]);

  if (!activeChat || !meData._id) return <> </>;
  return (
    <Box className={classes.root}>
      {activeChat.messages.length > 0 &&
        activeChat.messages.map((msg, index) => {
          if (msg.senderId.toString() === meData._id.toString())
            return (
              <Box className={`${classes.myBubble}`} key={index}>
                <MyBubble
                  conversation={activeChat}
                  message={msg}
                  meData={meData}
                />
              </Box>
            );
          return (
            <Box key={index} className={classes.otherBubble}>
              <OtherBubble conversation={activeChat} message={msg} />
            </Box>
          );
        })}
      <div
        style={{ paddingTop: moreSpacesForImages ? "4em" : null }}
        ref={bottomRef}
      ></div>
    </Box>
  );
};

export default Messages;
