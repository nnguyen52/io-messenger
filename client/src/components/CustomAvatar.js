import React from "react";
import { makeStyles } from "@mui/styles";
import { Box, Avatar } from "@mui/material";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "fit-content",
    borderRadius: "50%",
    border: "1px solid grey",
  },
  onlineOutline: {
    overflow: "hidden",
    position: "absolute",
    borderRadius: "50%",
    background: "#52f968",
    bottom: "-7.5%",
    right: "-7%",
    background: "white",
  },
  online: {
    overflow: "hidden",
    position: "absolute",
    borderRadius: "50%",
    bottom: 0,
    right: 0,
  },
  offlineIndicator: {
    background: "grey",
  },
  onlineIndicator: {
    background: "#52f968",
  },
}));

const CustomAvatar = ({ size = "lg", userData, showOnlineStatus = true }) => {
  const classes = useStyles();
  const { onlineUsers } = useSelector((state) => state.socket);

  if (!userData?._id) return <></>;

  return (
    <Box className={classes.root}>
      <Avatar
        alt={userData.username}
        src={`https://res.cloudinary.com/cloudinarystore/image/upload/v1655413346/${userData.photoUrl}.png`}
        sx={{
          width: size == "lg" ? 56 : size == "md" ? 30 : 15,
          height: size == "lg" ? 56 : size == "md" ? 30 : 15,
          background: "white",
        }}
      />
      {showOnlineStatus && (
        <>
          <Box
            className={classes.onlineOutline}
            sx={{
              width: size == "lg" ? "1.5em" : size == "md" ? ".9em" : ".4em",
              height: size == "lg" ? "1.5em" : size == "md" ? ".9em" : ".4em",
            }}
          ></Box>
          <Box
            className={`${classes.online} ${
              onlineUsers?.includes(userData._id.toString())
                ? classes.onlineIndicator
                : classes.offlineIndicator
            }`}
            sx={{
              width: size == "lg" ? "1em" : size == "md" ? ".6em" : ".2em",
              height: size == "lg" ? "1em" : size == "md" ? ".6em" : ".2em",
            }}
          ></Box>
        </>
      )}
    </Box>
  );
};

export default CustomAvatar;
