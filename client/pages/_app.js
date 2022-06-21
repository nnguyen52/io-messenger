import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../src/utils/config";

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("cvTok");
  config.headers["x-access-token"] = token;
  // config.headers[]
  return config;
});
// MUI5
import theme from "../src/theme";
import Head from "next/head";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
// import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import { StylesProvider, createGenerateClassName } from "@mui/styles";
const clientSideEmotionCache = createEmotionCache();
// redux
import store from "../src/redux/store";
import { Provider } from "react-redux";
import AuthControl from "../src/components/AuthControl";
// socket
import { socket, SocketContext } from "../src/context/socket";
import { Box } from "@mui/material";
import ToggleColorMode from "../src/context/darkMode";
function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  // const generateClassName = createGenerateClassName({
  //   productionPrefix: "MUI5_Prefix_",
  // });
  return (
    <>
      <SocketContext.Provider value={socket}>
        <Provider store={store}>
          {/* <StylesProvider generateClassName={generateClassName}> */}
          {/* <CacheProvider value={emotionCache}>
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
              />
            </Head> */}
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <AuthControl>
              <Component {...pageProps} />
            </AuthControl>
          </ThemeProvider>
          {/* </CacheProvider> */}
          {/* </StylesProvider> */}
        </Provider>
      </SocketContext.Provider>
      <ToastContainer
        style={{
          zIndex: 999,
        }}
      />
    </>
  );
}

export default MyApp;
