import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import Sidebar from "../src/components/Sidebar";
import ActiveChat from "../src/components/ActiveChat";
import { useEffect, useState } from "react";
import SettingsModal from "../src/components/Sidebar/SettingsModal";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    height: "100vh",
    width: "100%",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    transition: "all ease-in-out 0.2s",
  },
  sidebarContainer: {
    flex: 3.5,
    height: "100%",
  },
  activeChatContainer: {
    flex: 8.5,
    height: "100%",
  },
  settingsModalContainer: {
    position: "absolute",
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0 , .5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
      position: "fixed",
    },
  },
}));

export default function Home({
  handleLogout,
  postMessage,
  selectActiveChat,
  handleSumitSearch,
  handleChangeSearch,
}) {
  const router = useRouter();
  useEffect(() => {
    if (!userData?._id) {
      router.push("/login");
    }
  }, [userData, router]);
  const classes = useStyles();
  const userData = useSelector((state) => state.auth);

  // ...........settings modal........................
  const [settingsModal, setSettingsModal] = useState(false);
  const [avatar, setAvatar] = useState(null);
  // .................................................
  const theme = useTheme();
  return (
    <Box className={classes.root} sx={{ bgcolor: "background.default" }}>
      <Box className={classes.sidebarContainer}>
        {userData && (
          <Sidebar
            handleLogout={handleLogout}
            userData={userData}
            selectActiveChat={selectActiveChat}
            handleSumitSearch={handleSumitSearch}
            handleChangeSearch={handleChangeSearch}
            setSettingsModal={setSettingsModal}
          />
        )}
      </Box>
      <Box className={classes.activeChatContainer}>
        <ActiveChat postMessage={postMessage} userData={userData} />
      </Box>
      {settingsModal && (
        <Box
          onClick={() => {
            if (avatar) {
              if (confirm("You have not save new avatar. Are you sure!"))
                return setSettingsModal((prev) => !prev);
            }
            return setSettingsModal((prev) => !prev);
          }}
          className={classes.settingsModalContainer}
        >
          <SettingsModal
            setSettingsModal={setSettingsModal}
            avatar={avatar}
            setAvatar={setAvatar}
          />
        </Box>
      )}
    </Box>
  );
}
