import React, { useState } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import CurrentUser from "../Sidebar/CurrentUser";
import Input from "./Input";
import Messages from "./Messages";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "1em",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  currentUserContainer: {
    flex: 1,
  },
  messagesContainer: {
    width: "100%",
    flex: 10,
    position: "relative",
    overflowX: "hidden",
    overflowY: "auto",
    padding: "1em",
    // marginBottom: "2em",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "&::-webkit-scrollbar-thumb": {},
  },
  inputContainer: {
    width: "100%",
  },
}));
const ActiveChat = ({ postMessage, userData }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { activeChat } = useSelector((state) => state.conversations);

  // sending images
  const [images, setImages] = useState([]);
  // quick fix for chosing images -> give more spaces
  const [moreSpacesForImages, setMoreSpacesForImages] = useState(false);
  if (!activeChat) return <> </>;
  return (
    <Box
      className={classes.root}
      sx={{
        bgcolor: "background.default",
      }}
    >
      <Box className={`${classes.currentUserContainer}`}>
        <CurrentUser
          userData={
            userData._id.toString() == activeChat.user1._id.toString()
              ? activeChat.user2
              : activeChat.user1
          }
        />
      </Box>
      <hr
        style={{
          border: "none",
          background: "#3a71f2",
          height: "1px",
        }}
      />
      {/* messages */}
      <Box className={classes.messagesContainer}>
        <Messages moreSpacesForImages={moreSpacesForImages} images={images} />
      </Box>
      {/* input */}
      <Box className={classes.inputContainer}>
        <Input
          postMessage={postMessage}
          images={images}
          setImages={setImages}
          setMoreSpacesForImages={setMoreSpacesForImages}
        />
      </Box>
    </Box>
  );
};

export default ActiveChat;
