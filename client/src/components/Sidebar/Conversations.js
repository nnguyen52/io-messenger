import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import CurrentUser from "./CurrentUser";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: ".5em 0 .5em 0",
  },
}));

const Conversations = ({ selectActiveChat, userData }) => {
  const classes = useStyles();
  const conversationsData = useSelector((state) => state.conversations);

  return (
    <Box className={classes.root}>
      {conversationsData?.searchConversations?.length > 0
        ? conversationsData.searchConversations.map((each) => {
            return (
              <Box key={each._id} onClick={() => selectActiveChat(each)}>
                <CurrentUser
                  conversations={conversationsData.searchConversations}
                  unseenMsgFeature={true}
                  hover={true}
                  conversation={each}
                  userData={
                    userData._id.toString() == each.user1._id.toString()
                      ? each.user2
                      : each.user1
                  }
                  isTyping={true}
                />
              </Box>
            );
          })
        : conversationsData?.conversations?.length > 0
        ? conversationsData.conversations.map((each) => {
            return (
              <Box key={each._id} onClick={() => selectActiveChat(each)}>
                <CurrentUser
                  conversations={conversationsData.conversations}
                  unseenMsgFeature={true}
                  hover={true}
                  conversation={each}
                  userData={
                    userData._id.toString() == each.user1._id.toString()
                      ? each.user2
                      : each.user1
                  }
                  isTyping={true}
                />
              </Box>
            );
          })
        : "No conversations"}
    </Box>
  );
};

export default Conversations;
