import { FormControl, FilledInput, Box, Menu, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);
import { SocketContext } from "../../context/socket";
import { setTyping } from "../../redux/reducers/conversations";
import dynamic from "next/dynamic";
import {
  checkImageUpload,
  imageUpload,
} from "../../helperFunctions/uploadFile";
import { toast } from "react-toastify";
import Image from "next/image";
const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
  },
  medias: {
    position: "absolute",
    right: "2%",
    top: "25%",
    display: "flex",
    gap: "1em",
    zIndex: 100,
    cursor: "pointer",
  },
  emoji: {
    "&:hover": {
      color: "orange",
    },
  },
  modalEmoji: {
    zIndex: 101,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      height: "200vh",
    },
  },
  emojiPicker: {
    zIndex: 102,
    position: "absolute",
    bottom: 80,
    right: 20,
  },
  imagesInput: {
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      color: "orange",
    },
  },
  imagesInput_icon: {
    zIndex: 102,
  },
  imagesInput_input: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 103,
    opacity: 0,
  },
  imagesPlaceHodler: {
    position: "absolute",
    top: "-150%",
    width: "100%",
    // border: "1px solid red",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1em",
    maxHeight: "5em",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: ".3em",
    },

    "&::-webkit-scrollbar-track": {
      background: "#3a71f2",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "white",
    },

    zIndex: 102,
    padding: "1em",
  },
}));
const temporaryImageStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "5em",
    height: "5em",
    zIndex: 103,
  },
  image: {
    overflow: "hidden",
    objectFit: "cover",
    width: "5em",
    height: "5em",
    border: "3px solid #3a71f2",
    borderRadius: "1em 0 1em 1em",
  },
  close: {
    position: "absolute",
    top: "-.3em",
    right: "-.3em",
    borderRadius: "50%",
    color: "white",
    background: "crimson",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "1em",
    height: "1em",
    cursor: "pointer",
    transition: "all ease-in-out .1s",
    "&:hover": {
      background: "red",
    },
  },
  clearImages: {
    background: "crimson",
    color: "white",
    borderRadius: "1em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "1em",
    "&:hover": {
      background: "red",
    },
  },
  submit: {
    background: "#3a71f2",
    color: "white",
    borderRadius: "1em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "1em",
    "&:hover": {
      background: "#586dff",
    },
  },
  fileError: {
    border: "3px solid red",
  },
}));

const Input = ({ postMessage, images, setImages, setMoreSpacesForImages }) => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const classes = useStyles();
  const inputRef = useRef(null);
  const [text, setText] = useState("");
  const meData = useSelector((state) => state.auth);
  const { activeChat } = useSelector((state) => state.conversations);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  //emoji
  const [openModalEmoji, setOpenModalEmoji] = useState(false);
  const onEmojiClick = (event, emojiObject) => {
    setText((prev) => `${prev}${emojiObject.emoji}`);
  };

  useEffect(() => {
    if (!activeChat) return;
    socket.emit("typing", {
      userId: meData._id.toString(),
      conversationId: activeChat._id.toString(),
      type: false,
    });
    setText("");
  }, [activeChat?._id, socket]);

  useEffect(() => {
    if (text == "") {
      // for me
      dispatch(
        setTyping({
          userId: meData._id.toString(),
          conversationId: activeChat._id.toString(),
          type: false,
        })
      );
      // let other know
      socket.emit("typing", {
        userId: meData._id.toString(),
        conversationId: activeChat._id.toString(),
        type: false,
      });
    } else {
      if (
        activeChat.isTypings.filter(
          (each) => each.toString() == meData._id.toString()
        ).length <= 0
      ) {
        // for me
        dispatch(
          setTyping({
            userId: meData._id.toString(),
            conversationId: activeChat._id.toString(),
            type: true,
          })
        );
        // let other know
        socket.emit("typing", {
          userId: meData._id.toString(),
          conversationId: activeChat._id.toString(),
          type: true,
        });
      }
    }
  }, [text, dispatch, socket]);

  // .......send images.......................
  const [imagesErrors, setImagesErrors] = useState([]);
  useEffect(() => {
    if (images.length == 0) setMoreSpacesForImages(false);
    else setMoreSpacesForImages(true);
  }, [images]);

  useEffect(() => {
    const errors = [];
    // checking errors
    images.forEach((fileFormat) => {
      const error = checkImageUpload(fileFormat.file);
      if (error != "") {
        setImages((prev) =>
          prev.map((each) => {
            if (each.file == fileFormat.file)
              return {
                ...each,
                error: true,
              };
            return each;
          })
        );
        errors.push(error);
      }
    });
    if (errors.length == 0) setImagesErrors([]);
    if (errors.length > 0) {
      setImagesErrors((prev) => [...prev, ...errors]);
      errors.forEach((each) => toast.error(each));
    }
  }, [images.length]);

  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const handleImagesChange = (e) => {
    if (!e.target.files) return;
    setImages((prev) => [
      ...prev,
      ...Array.from(e.target.files).map((eachFile) => {
        return { file: eachFile, error: null };
      }),
    ]);
  };
  // send images
  const handleSubmitImages = async () => {
    setIsProcessingImages(true);
    const imagesArr = await imageUpload(images.map((e) => e.file));
    const reqBody = {
      // _id: new Date().valueOf().toString(),
      text: "",
      images: imagesArr.map((each) => each.public_id),
      recipientId:
        meData._id.toString() == activeChat.user1._id.toString()
          ? activeChat.user2._id.toString()
          : activeChat.user1._id.toString(),
      conversationId: activeChat._id.toString(),
      senderId: meData?._id.toString(),
      createdAt: dayjs(new Date()).format("LT"),
    };

    await postMessage(
      reqBody,
      meData._id.toString() == activeChat.user1._id.toString()
        ? activeChat.user2
        : activeChat.user1
    );
    setImages([]);
    setImagesErrors([]);
  };
  // ..........................................

  //submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements;
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      _id: new Date().valueOf().toString(),
      text: formElements.text.value,
      recipientId:
        meData._id.toString() == activeChat.user1._id.toString()
          ? activeChat.user2._id.toString()
          : activeChat.user1._id.toString(),
      conversationId: activeChat._id.toString(),
      senderId: meData?._id.toString(),
      createdAt: dayjs(new Date()).format("LT"),
    };
    setText("");

    await postMessage(
      reqBody,
      meData._id.toString() == activeChat.user1._id.toString()
        ? activeChat.user2
        : activeChat.user1
    );
  };

  if (!meData._id) return <> </>;
  return (
    <>
      <Box
        className={classes.root}
        sx={{
          color: "color.default",
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            ref={inputRef}
            name="text"
            value={text}
            onChange={handleChange}
            placeholder="Type something..."
            fullWidth
          />
        </form>
        <Box className={classes.medias}>
          <Box
            className={classes.emoji}
            onClick={() => setOpenModalEmoji((prev) => !prev)}
            sx={{
              color: "messageDateColor.default",
            }}
          >
            <SentimentSatisfiedAltIcon />
          </Box>
          <Box
            sx={{
              color: "messageDateColor.default",
            }}
            className={classes.imagesInput}
          >
            <FileCopyIcon className={classes.imagesInput_icon} />
            <input
              type="file"
              accept="image/jpg, image/gif, image/jpeg, image/png"
              multiple
              className={classes.imagesInput_input}
              onChange={handleImagesChange}
            />
          </Box>
        </Box>
        {/* images placeHolder */}
        {images?.length > 0 && (
          <Box
            className={classes.imagesPlaceHodler}
            sx={{
              color: "color.default",
            }}
          >
            <TemporaryImage type="clearImages" setImages={setImages} />
            {images.map((each, idx) => {
              return (
                <TemporaryImage
                  setImages={setImages}
                  key={idx}
                  fileFormat={each}
                />
              );
            })}
            {imagesErrors.length == 0 && (
              <TemporaryImage
                type="submit"
                handleSubmitImages={handleSubmitImages}
              />
            )}
          </Box>
        )}
      </Box>
      {openModalEmoji && (
        <Box
          className={classes.modalEmoji}
          onClick={() => {
            setOpenModalEmoji((prev) => !prev);
            if (inputRef.current) {
              inputRef.current.children[0].children[0].focus();
            }
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            className={classes.emojiPicker}
          >
            <Picker onEmojiClick={onEmojiClick} />
          </Box>
        </Box>
      )}
    </>
  );
};

const TemporaryImage = ({
  fileFormat,
  setImages,
  type = null,
  handleSubmitImages,
}) => {
  const classes = temporaryImageStyles();
  if (type == "clearImages")
    return (
      <Box
        onClick={() => {
          setImages([]);
          setImagesErrors([]);
        }}
        className={`${classes.root} ${classes.clearImages}`}
      >
        Clear all
      </Box>
    );
  if (type == "submit")
    return (
      <Box
        className={`${classes.root} ${classes.submit}`}
        onClick={handleSubmitImages}
      >
        Send
      </Box>
    );
  return (
    <Box className={classes.root}>
      <img
        alt={"img"}
        className={`${classes.image} ${
          fileFormat.error ? classes.fileError : null
        }
        `}
        src={URL.createObjectURL(fileFormat.file)}
      />
      <CloseIcon
        className={classes.close}
        onClick={() =>
          setImages((prev) =>
            prev.filter((each) => each.file != fileFormat.file)
          )
        }
      />
    </Box>
  );
};
export default Input;
