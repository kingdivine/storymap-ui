import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  CircularProgress,
  createStyles,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import { useRouteMatch } from "react-router-dom";
import Heading from "../Generic/Heading";
import mapBackground from "../Generic/images/map-background.png";
import PasswordResetForm from "./PasswordResetForm";
import { isMobile } from "../utils";

const smallScreen = isMobile();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageContainer: {
      backgroundImage: `url(${mapBackground})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      border: "1px solid grey",
      boxSizing: "border-box",
      height: "100vh",
    },
    paperContainer: {
      marginTop: "20vh",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
    paper: {
      padding: smallScreen ? theme.spacing(2) : theme.spacing(4),
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      maxWidth: "80vw",
    },
  })
);

export default function GetPasswordResetLinkPage() {
  const classes = useStyles();

  const hasFetchedData = useRef(false);
  const [, setCurrentUser] = useCurrentUser();

  const routeMatch = useRouteMatch<{ userId: string; resetToken: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const userId = routeMatch.params.userId;
  const resetToken = routeMatch.params.resetToken;

  useEffect(() => {
    if (hasFetchedData.current) {
      return;
    }
    hasFetchedData.current = true;
    setIsLoading(true);
    setErrorMsg("");

    axios
      .get(
        `/storymap-api/users/${userId}/verify-password-reset-token/${resetToken}`
      )
      .then((response) => {
        setCurrentUser(null);
      })
      .catch((e) => {
        if (e.response && e.response.status === 404) {
          setErrorMsg("Invalid link or user not found.");
        } else {
          setErrorMsg(
            "Please check your internet connection and try again later."
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId, resetToken, routeMatch, setCurrentUser]);
  return (
    <div className={classes.pageContainer}>
      <Heading />
      <div className={classes.paperContainer}>
        {isLoading && (
          <Paper className={classes.paper}>
            <Typography variant="h6">Just a sec, verifying link...</Typography>
            <CircularProgress style={{ margin: 16 }} color="secondary" />
          </Paper>
        )}
        {!isLoading && !errorMsg && (
          <PasswordResetForm userId={userId} resetToken={resetToken} />
        )}
        {!isLoading && errorMsg && (
          <Paper className={classes.paper}>
            <Typography variant="h5" align="center" color="error">
              Oops! Something went wrong.
            </Typography>
            <br />
            <Typography variant="body1" align="center">
              {errorMsg}
            </Typography>
          </Paper>
        )}
      </div>
    </div>
  );
}
