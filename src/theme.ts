import { createMuiTheme } from "@material-ui/core/styles";

declare module "@material-ui/core/styles/createPalette" {
  export interface TypeText {
    gold?: React.CSSProperties["color"];
    reddish?: React.CSSProperties["color"];
  }
}

export const theme = createMuiTheme({
  palette: {
    type: "dark",
    text: {
      gold: "#FFE600",
      reddish: "#FC693B",
    },
    primary: {
      main: "#FFE600",
    },
    secondary: {
      main: "#FC693B",
    },
    background: {
      paper: "#303030",
    },
  },
  typography: {
    fontFamily: [
      "Secular One",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});
