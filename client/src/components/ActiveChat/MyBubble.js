import React from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import CurrentUser from "../Sidebar/CurrentUser";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import Linkify from "react-linkify";

dayjs.extend(localizedFormat);
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  messageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  date: {
    fontSize: ".8em",
    fontWeight: 400,
  },
  text: {
    color: "white",
    padding: ".1em 1em",
    borderRadius: "12px",
    background: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: ".1em",
  },
  images: {
    border: "5px",
    padding: ".1em 1em",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: ".1em",
  },
  image: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    objectFit: "contain",
    width: "100%",
    height: "400px",
    padding: 0,
    margin: 0,
    borderRadius: ".6em",
  },
  lessPadding: {
    padding: ".1em",
    margin: 0,
  },
}));

const MyBubble = ({ message, conversation }) => {
  const userData = useSelector((state) => state.auth);
  const classes = useStyles();
  const theme = useTheme();
  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.messageContainer}>
          <Box
            className={classes.date}
            sx={{
              color: "messageDateColor.default",
            }}
          >
            {dayjs(message.createdAt.toString()).format("LT") != "Invalid Date"
              ? dayjs(message.createdAt.toString()).format("LT")
              : message.createdAt}
          </Box>
          {message.text !== "" && (
            <Box
              className={classes.text}
              sx={{
                border: `1px solid ${
                  theme?.palette.mode == "light" ? "black" : "#3a71f2"
                }`,
              }}
            >
              <Linkify>{message.text}</Linkify>
            </Box>
          )}
          {message.images?.length > 0 && (
            <Box
              className={`${classes.images} ${classes.lessPadding}`}
              sx={{
                bgcolor: "backgroundImages.default",
              }}
            >
              {message.images.map((each, idx) => {
                return (
                  <>
                    <img
                      key={idx}
                      src={`https://res.cloudinary.com/cloudinarystore/image/upload/v1655766738/${each}.png`}
                      alt="img"
                      className={classes.image}
                    />
                  </>
                );
              })}
            </Box>
          )}
          {userData?._id &&
          conversation &&
          conversation.lastSeenMessages.find(
            (each) => each?._id?.toString() == message?._id?.toString()
          ) ? (
            <CurrentUser
              userData={
                conversation.user1._id.toString() == userData._id.toString()
                  ? conversation.user2
                  : conversation.user1
              }
              hideName
              widthFitContent
              showOnlineStatus={false}
              avatarSize="sm"
              noPadding={true}
              smallTopPadding={true}
            />
          ) : null}
        </Box>
      </Box>
    </>
  );
};

export default MyBubble;
