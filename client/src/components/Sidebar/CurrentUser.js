import { Box } from "@mui/material";
import React, { useContext } from "react";
import CustomAvatar from "../CustomAvatar";
import { makeStyles } from "@mui/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../../context/darkMode";
import DarkModeToggle from "react-dark-mode-toggle";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "fit-content",
    display: "flex",
    alignItems: "center",
    gap: ".5em",
    padding: "1em",
    borderRadius: "10px",
  },
  avatar: {
    flex: 1,
  },
  info: {
    flex: 10,
    display: "flex",
    flexDirection: "column",
  },
  logout: {
    flex: 1,
    cursor: "pointer",
    transition: "all ease-in-out .2s",
    "&:hover": {
      color: "white",
      background: "crimson",
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: ".3em .1em",
    borderRadius: "5px",
  },
  hover: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  unseenCount: {
    color: "white",
    fontWeight: 600,
    background: "#2675e2",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "0 .5em 0 .5em",
  },
  unseenText: {
    color: "black",
    fontWeight: 800,
  },
  unseenCount_big: {
    borderRadius: "10px",
  },
  widthFitContent: {
    width: "fit-content",
  },
  noPadding: { padding: 0 },
  smallTopPadding: {
    paddingTop: ".3em",
  },
  settings: {
    flex: 1,
    cursor: "pointer",
    transition: "all ease-in-out .2s",
    "&:hover": {
      color: "white",
      background: "green",
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: ".3em .1em",
    borderRadius: "5px",
  },
}));

const CurrentUser = ({
  userData,
  showOnlineStatus = true,
  conversation,
  hover = false,
  logout = false,
  handleLogout,
  unseenMsgFeature = false,
  isTyping = false,
  hideName = false,
  widthFitContent = false,
  avatarSize = "lg",
  noPadding = false,
  smallTopPadding = false,
  settings = false,
  setSettingsModal,
  themeMode,
}) => {
  const classes = useStyles();
  const { conversations, searchConversations } = useSelector(
    (state) => state.conversations
  );

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      className={`${classes.root} ${hover ? classes.hover : null} ${
        widthFitContent ? classes.widthFitContent : null
      } ${noPadding ? classes.noPadding : null} ${
        smallTopPadding ? classes.smallTopPadding : null
      }`}
      sx={{
        bgcolor: "background.default",
        color: "color.default",
        "&:hover": {
          bgcolor: hover ? "background.hover" : null,
        },
      }}
    >
      <Box className={classes.avatar}>
        {/* {userData._id.substring(userData._id.length - 3)} */}
        <CustomAvatar
          userData={userData}
          showOnlineStatus={showOnlineStatus}
          size={avatarSize}
        />
      </Box>
      <Box className={classes.info}>
        {!hideName && <h3> {userData?.username}</h3>}
        {isTyping &&
        conversations
          .find((each) => each._id.toString() == conversation?._id.toString())
          ?.isTypings?.filter(
            (each) => each.toString() == userData._id.toString()
          ).length > 0 ? (
          "Typing..."
        ) : isTyping &&
          searchConversations
            .find((each) => each._id.toString() == conversation?._id.toString())
            ?.isTypings?.filter(
              (each) => each.toString() == userData._id.toString()
            ).length > 0 ? (
          "Typing..."
        ) : conversation?.unseenMessages.filter(
            (msg) => msg?.recipientId?.toString() !== userData._id.toString()
          ).length > 0 ? (
          <Box className={classes.unseenText}>
            {conversation?.unseenMessages.filter(
              (msg) => msg?.recipientId?.toString() !== userData._id.toString()
            )[
              conversation.unseenMessages.filter(
                (msg) =>
                  msg?.recipientId?.toString() !== userData._id.toString()
              ).length - 1
            ].text != ""
              ? conversation?.unseenMessages.filter(
                  (msg) =>
                    msg?.recipientId?.toString() !== userData._id.toString()
                )[
                  conversation.unseenMessages.filter(
                    (msg) =>
                      msg?.recipientId?.toString() !== userData._id.toString()
                  ).length - 1
                ].text
              : "Image"}
          </Box>
        ) : (
          conversation && conversation?.latestMessage?.text
        )}
      </Box>

      {settings && (
        <Box
          className={classes.settings}
          onClick={() => setSettingsModal((prev) => !prev)}
        >
          <SettingsIcon />
        </Box>
      )}
      {logout && (
        <Box className={classes.logout} onClick={handleLogout}>
          <LogoutIcon />
        </Box>
      )}
      {themeMode && (
        <Box
          sx={{
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DarkModeToggle
            onChange={() => colorMode.toggleColorMode()}
            checked={theme.palette.mode == "light" ? false : true}
            size={50}
          />
        </Box>
      )}
      {unseenMsgFeature &&
        conversation &&
        conversation.unseenMessages.filter(
          (each) => each.senderId == userData._id.toString()
        ).length > 0 && (
          <Box
            className={`${classes.unseenCount} ${
              conversation.unseenMessages.filter(
                (each) => each.senderId == userData._id.toString()
              ).length *
                100 >=
              10
                ? classes.unseenCount_big
                : null
            }`}
          >
            {conversation.unseenMessages.filter(
              (each) => each.senderId == userData._id.toString()
            ).length <= 100
              ? conversation.unseenMessages.filter(
                  (each) => each.senderId == userData._id.toString()
                ).length
              : "+100"}
          </Box>
        )}
    </Box>
  );
};

export default CurrentUser;
