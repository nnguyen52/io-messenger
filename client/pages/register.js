import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  FormControl,
  TextField,
  FormHelperText,
  Paper,
} from "@mui/material";
import DarkModeToggle from "react-dark-mode-toggle";
import { useTheme } from "@mui/material/styles";
import { useStyles_Login_Logout } from "../pages/login";
import { toast } from "react-toastify";
import { ColorModeContext } from "../src/context/darkMode";

const Signup = ({ user, register }) => {
  const router = useRouter();

  const classes = useStyles_Login_Logout();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handleRegister = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements;
    const username = formElements.username.value;
    const email = formElements.email.value;
    const password = formElements.password.value;
    const confirmPassword = formElements.confirmPassword.value;

    if (password !== confirmPassword) {
      toast.error("Passwords must match!");
      // setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }
    await register({ username, email, password });
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
            Already have an account?
          </Box>
          <Box className={classes.setting}>
            <Link href="/login" className={classes.linkContainer}>
              <a className={classes.link_wrapper} style={{ zIndex: 10000 }}>
                <Paper elevation={3} className={classes.link}>
                  Login
                </Paper>
              </a>
            </Link>
          </Box>
        </Box>
        {/* form */}
        <Box
          className={classes.formContainer}
          sx={{
            color: "color.default",
          }}
        >
          <form onSubmit={handleRegister} className={classes.form}>
            <h1 className={classes.formTitle}>Create an account!</h1>
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
                label="E-mail address"
                aria-label="e-mail address"
                type="email"
                name="email"
                required
              />
            </FormControl>
            <FormControl
              error={!!formErrorMessage.confirmPassword}
              margin="normal"
              required
              className={classes.formControl}
            >
              <TextField
                InputLabelProps={{ className: classes.inputLabel }}
                inputProps={{
                  className: classes.inputProps,
                  minLength: 6,
                }}
                aria-label="password"
                label="Password"
                type="password"
                name="password"
                required
              />
              <FormHelperText>
                {formErrorMessage.confirmPassword}
              </FormHelperText>
            </FormControl>
            <FormControl
              error={!!formErrorMessage.confirmPassword}
              margin="normal"
              required
              className={classes.formControl}
            >
              <TextField
                InputLabelProps={{ className: classes.inputLabel }}
                inputProps={{
                  className: classes.inputProps,
                  minLength: 6,
                }}
                label="Confirm Password"
                aria-label="confirm password"
                type="password"
                name="confirmPassword"
                required
              />
              <FormHelperText>
                {formErrorMessage.confirmPassword}
              </FormHelperText>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              size="large"
              className={classes.button}
            >
              Create
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
