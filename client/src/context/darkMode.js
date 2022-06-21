import { createContext, useMemo, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export const ColorModeContext = createContext();

export default function ToggleColorMode({ children }) {
  const [mode, setMode] = useState(
    localStorage.getItem("messengerTheme")
      ? localStorage.getItem("messengerTheme")
      : "light"
  );

  useEffect(() => {
    localStorage.setItem("messengerTheme", mode);
  }, [mode]);
  useEffect(() => {
    setMode(localStorage.getItem("messengerTheme"));
  }, [localStorage.getItem("messengerTheme")]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          background: {
            default: "white",
            hover: "#eaf5f7",
          },
          borderRight: {
            default: "grey",
          },
          messageDateColor: {
            default: "#586ea0",
          },
          color: {
            default: "black",
          },
          backgroundImages: {
            default: "white",
          },
        }
      : {
          // palette values for dark mode
          background: {
            default: "black",
            blue: "#3a71f2",
            hover: "#3a71f2",
          },
          color: {
            default: "white",
            blue: "#3a71f2",
          },
          borderRight: {
            default: "#3a71f2",
          },
          messageDateColor: {
            default: "white",
          },
          backgroundImages: {
            default: "black",
          },
        }),
  },
});
