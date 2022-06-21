import React, { useEffect, useState, useCallback, useContext } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Avatar, LinearProgress, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDropzone } from "react-dropzone";
import { useSelector, useDispatch } from "react-redux";
import {
  checkImageUpload,
  imageUpload,
} from "../../helperFunctions/uploadFile";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import { changePhotoUrl, changeUsername } from "../../redux/reducers/auth";
import {
  changeAuthPassword_convos,
  changeAuthPhotoUrl_convos,
  changeAuthUsername_convos,
} from "../../redux/reducers/conversations";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import { SocketContext } from "../../context/socket";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "50%",
    height: "50%",
    borderRadius: "1em",
    display: "flex",
    [theme.breakpoints.down("md")]: {
      width: "80%",
      height: "50%",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      width: "90%",
      height: "90%",
    },
  },
  close: {
    position: "absolute",
    top: "-1em",
    right: "-1em",
    borderRadius: "50%",
    color: "white",
    background: "crimson",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "2.5em",
    height: "2.5em",
    cursor: "pointer",
    transition: "all ease-in-out .1s",
    "&:hover": {
      background: "red",
    },
  },
  infoContainer: {
    flex: 8,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1em",
    padding: "1em",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    [theme.breakpoints.down("md")]: {
      padding: 0,
    },
    [theme.breakpoints.down("sm")]: {
      height: "60%",
    },
  },
  form: {
    width: "75%",
  },
  button: {
    background: "#3a71f2",
    color: "white",
    "&:hover": {
      background: "green",
    },
  },
  avatarContainer: {
    position: "relative",
    flex: 4,
    display: "flex",
    flexDirection: "column",
    gap: "1em",

    [theme.breakpoints.down("sm")]: {
      height: "40%",
    },
  },
  userAvatar: {
    position: "relative",
    flex: 9,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: ".5em",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "50%",
      alignSelf: "center",
    },
  },
  dropZone: {
    flex: 3,
    borderRadius: "1em 0 1em 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontWeight: 600,
    color: "#3a71f2",
    padding: ".2em",
    textAlign: "center",
    transition: "all ease-in-out .3s",
    "&:hover": {
      color: "white",
      background: "#3a71f2",
    },
    [theme.breakpoints.down("sm")]: {
      borderRadius: "0 0  1em 1em ",
    },
  },
  avatarSettings: {
    position: "absolute",
    width: "1.8em",
    height: "1.8em",
    borderRadius: "50%",
    padding: ".2em",
    cursor: "pointer",
  },
  unsaveAvatar: {
    bottom: 0,
    left: 0,
    background: "crimson",
    color: "white",
  },
  saveAvatar: {
    bottom: 0,
    right: 0,
    background: "green",
    color: "white",
  },

  userAvatarSrc: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid grey",
    background: "white",
  },
  isUploading: {
    position: "relative",
    flex: 3,
    display: "flex",
    width: "100%",
    alignItems: "center",
    color: "#3a71f2",
  },
  isUploadingLinearProgess: {
    width: "100%",
  },
  isUploadingText: {
    position: "absolute",
    top: 10,
  },
  disabledButton: {
    background: "#d1d0ca",
  },
  updatingInfoErrors: { color: "red" },
  close: {
    position: "absolute",
    top: "-1em",
    right: "-1em",
    borderRadius: "50%",
    color: "white",
    background: "crimson",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "2.5em",
    height: "2.5em",
    cursor: "pointer",
    transition: "all ease-in-out .1s",
    "&:hover": {
      background: "red",
    },
  },
}));

const SettingsModal = ({ setSettingsModal, avatar, setAvatar }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector((state) => state.auth);
  const theme = useTheme();
  const socket = useContext(SocketContext);

  // ......................updating images.............................
  // process file
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // Do something with the files
    // console.log({ acceptedFiles, fileRejections });
    if (fileRejections.length > 0) {
      let errors = [];
      fileRejections.forEach((each) => errors.push(each.errors[0].message));
      errors = [...new Set(errors)];
      errors.forEach((each) => toast.error(each));
      return console.log({ acceptedFiles, fileRejections });
    }
    const file = acceptedFiles[0];
    const err = checkImageUpload(file);
    if (err) return console.log({ err });
    setAvatar(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpg": [],
      "image/png": [],
      "image/jpeg": [],
      "image/gif": [],
    },
    maxFiles: 1,
  });
  const [isUploading, setIsUploading] = useState(false);
  // upload
  const handleUpload = async () => {
    setIsUploading(true);
    const media = await imageUpload([avatar]);
    //   media[0].url , media[0].public_id
    const { data } = await axios.post("/auth/updatePhotoUrl", {
      newPhotoUrl: media[0].public_id,
    });
    dispatch(changePhotoUrl(media[0].public_id));
    dispatch(changeAuthPhotoUrl_convos(media[0].public_id));
    setAvatar(null);
    setIsUploading(false);
    // let other know
    socket.emit("changePhotoUrl_other", {
      userId: user._id.toString(),
      photoUrl: media[0].public_id,
    });
    toast.success(data.message);
  };
  // .............................................................................................

  // ......updating info............................
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [updatingInfoErrors, setUpdatingInfoErrors] = useState(false);

  useEffect(() => {
    if (!user) return;
    setUserInfo({ ...user, confirmPassword: "" });
  }, [user?._id]);

  const handleInfoChange = (e) => {
    setUpdatingInfoErrors((prev) => null);

    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const handleSubmitInfo = async (e) => {
    let errors = {};
    e.preventDefault();

    if (isUpdatingInfo) return;
    setIsUpdatingInfo(true);
    if (userInfo.username.length < 1)
      errors.username = "Username must contain atleast 1 character!";
    if (
      userInfo.password != userInfo.confirmPassword ||
      userInfo.password.length < 6
    ) {
      errors.password = "Password must match and contain atleast 6 characters!";
    }
    if (
      userInfo.username === user.username &&
      userInfo.password === user.password &&
      userInfo.password === userInfo.confirmPassword
    ) {
      errors.all = "There are no changes!";
    }

    if (Object.keys(errors).length > 0) {
      setUpdatingInfoErrors((prev) => errors);
      return setIsUpdatingInfo(false);
    }
    if (userInfo.username != user.name) {
      dispatch(changeUsername(userInfo.username));
      dispatch(changeAuthUsername_convos(userInfo.username));
      await axios.post("/auth/updateUsername", {
        username: userInfo.username,
      });
    }
    if (userInfo.password != user.password) {
      dispatch(changePassword(userInfo.password));
      dispatch(changeAuthPassword_convos(userInfo.password));
      await axios.post("/auth/updatePassword", { username: userInfo.password });
    }

    // let other know
    socket.emit("changeUserName_other", {
      userId: user._id.toString(),
      username: userInfo.username,
    });
    setUserInfo({});
    setIsUpdatingInfo(false);
    toast.success("Update info successfully!");
  };
  // ...............................................

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      className={classes.root}
      sx={{
        bgcolor: "background.default",
        border: theme?.palette?.mode == "dark" ? "1px solid #3a71f2" : null,
      }}
    >
      {userInfo && (
        <Box className={classes.infoContainer}>
          <Box className={classes.form}>
            <h3
              style={{
                color: "#3a71f2",
              }}
            >
              Change Info
            </h3>
            <form onSubmit={handleSubmitInfo}>
              <TextField
                fullWidth
                margin="normal"
                label={userInfo.username ? null : "Username"}
                name="username"
                type="text"
                value={userInfo.username}
                onChange={handleInfoChange}
                helperText={
                  updatingInfoErrors?.username ? (
                    <Box className={classes.updatingInfoErrors}>
                      {updatingInfoErrors?.username}
                    </Box>
                  ) : null
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label={userInfo.password ? null : "Password"}
                name="password"
                type="password"
                value={userInfo.password}
                onChange={handleInfoChange}
                helperText={
                  updatingInfoErrors?.password ? (
                    <Box className={classes.updatingInfoErrors}>
                      {updatingInfoErrors?.password}
                    </Box>
                  ) : null
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={userInfo.confirmPassord}
                onChange={handleInfoChange}
                helperText={
                  updatingInfoErrors?.password ? (
                    <Box className={classes.updatingInfoErrors}>
                      {updatingInfoErrors?.password}
                    </Box>
                  ) : null
                }
              />
              {isUpdatingInfo ? (
                <Box>
                  <h3
                    style={{
                      color: "#3a71f2",
                    }}
                  >
                    Loading...
                  </h3>
                  <LinearProgress />
                </Box>
              ) : (
                <Button
                  type="submit"
                  fullWidth
                  className={`${classes.button} ${
                    userInfo?.username === user?.username &&
                    userInfo?.password === user?.password &&
                    !userInfo.confirmPassword
                      ? classes.disabledButton
                      : null
                  }`}
                  disabled={
                    userInfo?.username === user?.username &&
                    userInfo?.password === user?.password &&
                    !userInfo.confirmPassword
                      ? true
                      : false
                  }
                >
                  Update
                </Button>
              )}
              <Box className={classes.updatingInfoErrors}>
                {updatingInfoErrors?.all}
              </Box>
            </form>
          </Box>
        </Box>
      )}
      <Box className={classes.avatarContainer}>
        {user?._id && (
          <Box className={classes.userAvatar}>
            <Avatar
              className={classes.userAvatarSrc}
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : `${`https://res.cloudinary.com/cloudinarystore/image/upload/v1655413346/${user.photoUrl}.png`}`
              }
            />
            {avatar && (
              <>
                <CancelIcon
                  onClick={() => setAvatar(null)}
                  className={`${classes.avatarSettings} ${classes.unsaveAvatar} `}
                />
                <SaveIcon
                  onClick={handleUpload}
                  className={`${classes.avatarSettings} ${classes.saveAvatar} `}
                />
              </>
            )}
          </Box>
        )}
        {isUploading ? (
          <Box className={classes.isUploading}>
            <LinearProgress className={classes.isUploadingLinearProgess} />
            <h3 className={classes.isUploadingText}>Loading...</h3>
          </Box>
        ) : (
          <Box className={classes.dropZone} {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <h3>Drop/Select a fileto upload Avatar </h3>
            ) : (
              <h3>Drop/Select a file to upload Avatar</h3>
            )}
          </Box>
        )}
      </Box>
      <Box
        className={classes.close}
        onClick={() => {
          if (avatar) {
            if (confirm("You have not save new avatar. Are you sure!"))
              return setSettingsModal((prev) => !prev);
          }
          return setSettingsModal((prev) => !prev);
        }}
      >
        <Box className={classes.close}>
          <CloseIcon />
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsModal;
