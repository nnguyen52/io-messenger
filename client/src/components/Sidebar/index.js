import React from "react";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import CurrentUser from "./CurrentUser";
import Search from "./Search";
import Conversations from "./Conversations";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overFlowX: "hidden",
    overflowY: "auto",
    // borderRight: "1px solid grey",
    padding: "1em",
    [theme.breakpoints.down("sm")]: {
      borderBottom: "1px solid grey",
    },
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  text: {
    padding: ".5em 0",
    color: "#3a71f2",
  },
  currentUserContainer: {
    [theme.breakpoints.down("sm")]: {
      flexGrow: 0,
    },
  },
  conversationsContainer: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "1.5em",
    [theme.breakpoints.down("sm")]: {
      flexGrow: 1,
      overflowY: "auto",
    },
  },
}));

const Sidebar = ({
  handleLogout,
  userData,
  selectActiveChat,
  handleSumitSearch,
  handleChangeSearch,
  setSettingsModal,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  if (!userData._id) return <> </>;
  return (
    <Box
      className={classes.root}
      sx={{
        bgcolor: "background.default",
        color: "color.default",
        borderRight: `1px solid ${
          theme?.palette?.mode == "dark" ? "#3a71f2" : "grey"
        }`,
      }}
    >
      <Box className={classes.currentUserContainer}>
        <CurrentUser
          userData={userData}
          logout={true}
          handleLogout={handleLogout}
          settings={true}
          setSettingsModal={setSettingsModal}
          themeMode={true}
        />
      </Box>
      <hr
        style={{
          height: "1px",
          border: "none",
          background: "#3a71f2",
        }}
      />
      <Box className={classes.conversationsContainer}>
        <Box className={classes.title}>
          <h2 className={classes.text}>Chats</h2>
        </Box>
        <Box className={classes.searchContainer}>
          <Search
            handleSumitSearch={handleSumitSearch}
            handleChangeSearch={handleChangeSearch}
          />
        </Box>
        <Box className={classes.conversations}>
          <Conversations
            selectActiveChat={selectActiveChat}
            userData={userData}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
