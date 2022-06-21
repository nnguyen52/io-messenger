import React, { useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Button, FormControl, TextField, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../src/context/darkMode";
import DarkModeToggle from "react-dark-mode-toggle";

export const useStyles_Login_Logout = makeStyles((theme) => ({
  root: {
    position: "relative",
    height: "100vh",
    display: "flex",
    overflow: "hidden",
  },
  leftContainer: {
    position: "relative",
    flex: 5,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  backgroundImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
  backgroundImg_overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: ".8",
  },
  backgroundImg_overlay_content: {
    position: "absolute",
    top: "-10%",
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImg_overlay_content_image: {
    width: "5em",
  },
  backgroundImg_overlay_content_text: {
    color: "white",
    fontSize: "2em",
    fontWeight: 350,
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  },
  rightContainer: {
    position: "relative",
    flex: 7,
  },
  settingsRoot: {
    width: "100%",
    position: "absolute",
    top: "5%",
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  setting: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  settingMiddle: {
    color: "grey",
  },
  linkContainer: {
    position: "absolute",
    width: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    textDecoration: "none",
  },
  link_wrapper: {
    width: "100%",
    height: "3em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 650,
    color: "#3f92ff",
    textDecoration: "none",
  },
  link: {
    transition: "all .5s",
    width: "80%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    "&:hover": {
      transform: "translateY(-10%)",
    },
  },
  formContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "60%",
    display: "flex",
    flexDirection: "column",
  },
  formTitle: {
    margin: 0,
    padding: 0,
  },
  formControl: {
    position: "relative",
    // margin: "1em 0 1em 0",
  },
  textField: {
    size: "4em",
  },
  inputLabel: {
    color: "grey",
    "&.Mui-focused": {
      color: "grey",
    },
  },
  inputProps: {
    "&:focus": {
      fontSize: "1.5em",
      marginTop: ".5em",
    },
  },
  button: {
    background: "#3a71f2",
    color: "white",
    width: "30%",
    height: "4em",
    alignSelf: "center",
    margin: "1em",
    "&:hover": {
      background: "#586dff",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "2.5em",
    },
  },
  forgot: {
    position: "absolute",
    right: "2%",
    bottom: "10%",
    color: "#3f92ff",
    fontWeight: 600,
  },
  linkk: {
    zIndex: 10000,
    color: "red",
  },
}));

const Login = ({ login }) => {
  const router = useRouter();
  const classes = useStyles_Login_Logout();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const user = useSelector((state) => state.auth);

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements;
    const username = formElements.username.value;
    const password = formElements.password.value;

    await login({ username, password });
  };

  useEffect(() => {
    if (user && user.id) router.push("/home");
  }, [user, router]);

  return (
    <Box className={classes.root}>
      {/* left pannel */}
      <Box className={classes.leftContainer}>
        <img
          className={classes.backgroundImg}
          src={`https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvectors%2Fbusiness-people-chatting-vector-id1141444248&f=1&nofb=1`}
          alt="leftContainer_backgroundImg"
        />
        <Box
          className={classes.backgroundImg_overlay}
          sx={{
            background:
              theme.palette.mode == "light"
                ? "linear-gradient(180deg, rgba(0,3,36,1) 0%, rgba(64,83,219,1) 0%, rgba(66,175,255,0.7402311266303396) 100%)"
                : "linear-gradient(180deg, rgba(0,3,36,1) 0%, rgba(0,0,0,1) 0%, rgba(103,28,255,0.8018557764902836) 100%)",
          }}
        ></Box>
        <Box className={classes.backgroundImg_overlay_content}>
          <img
            className={classes.backgroundImg_overlay_content_image}
            src="https://cdn-icons-png.flaticon.com/512/126/126501.png"
          />
          <p className={classes.backgroundImg_overlay_content_text}>
            Converse with anyone with any language
          </p>
        </Box>
      </Box>
      {/* right pannel */}
      <Box
        className={classes.rightContainer}
        sx={{
          bgcolor: "background.default",
        }}
      >
        <Box className={classes.settingsRoot}>
          <Box className={classes.setting}>
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
                size={80}
              />
            </Box>
          </Box>
          <Box className={`${classes.setting} ${classes.settingMiddle}`}>
            Do not have an account?
          </Box>
          <Box className={classes.setting}>
            <Link href="/register" className={classes.linkContainer}>
              <a className={classes.link_wrapper} style={{ zIndex: 100 }}>
                <Paper elevation={3} className={classes.link}>
                  Register
                </Paper>
              </a>
            </Link>
          </Box>
        </Box>
        {/* form */}
        <Box className={classes.formContainer}>
          <form onSubmit={handleLogin} className={classes.form}>
            <Box
              sx={{
                color: "color.default",
              }}
            >
              <h1 className={classes.formTitle}>Welcome back!</h1>
            </Box>
            <FormControl
              margin="normal"
              required
              className={classes.formControl}
            >
              <TextField
                className={classes.textField}
                InputLabelProps={{ className: classes.inputLabel }}
                inputProps={{
                  className: classes.inputProps,
                }}
                aria-label="username"
                label="Username"
                name="username"
                type="text"
              />
            </FormControl>
            <FormControl
              margin="normal"
              required
              className={classes.formControl}
            >
              <TextField
                InputLabelProps={{ className: classes.inputLabel }}
                inputProps={{
                  className: classes.inputProps,
                }}
                label="Password"
                aria-label="password"
                type="password"
                name="password"
              />
              <span className={classes.forgot}>Forgot</span>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              size="large"
              className={classes.button}
            >
              Login
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
