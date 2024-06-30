import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { theme } from "./theme";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        dense
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          justifyContent: "center",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
