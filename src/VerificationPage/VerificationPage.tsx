import { useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  createStyles,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import Heading from "../Generic/Heading";
import mapBackground from "../Generic/images/map-background.png";
import { useHistory } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useEffect } from "react";
import axios from "axios";

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
    header: {
      position: "fixed",
      right: theme.spacing(5),
      top: theme.spacing(5),
    },
    verificationContainer: {
      marginTop: "25vh",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
    msgBox: {
      padding: theme.spacing(2),
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
  })
);

export default function VerificationPage() {
  const classes = useStyles();
  let history = useHistory();
  const hasFetchedData = useRef(false);
  const [currentUser, setCurrentUser] = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (hasFetchedData.current) {
      return;
    }
    hasFetchedData.current = true;
    setIsLoading(true);
    setErrorMsg("");
    axios
      .get(`/storymap-api${history.location.pathname}`)
      .then((response) => {
        const userObj = { ...response.data.user, token: response.data.token };
        setCurrentUser(userObj);
      })
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          setErrorMsg("Code not recognised or user already verified.");
        } else {
          setErrorMsg(
            "Please check your internet connection and try again later."
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [history, setCurrentUser]);

  return (
    <div className={classes.pageContainer}>
      <header className={classes.header}>
        <Typography variant="body1" color={"textPrimary"}>
          What is Storymap?
        </Typography>
      </header>
      <div className={classes.verificationContainer}>
        <Heading />
        <Paper className={classes.msgBox}>
          {isLoading && (
            <>
              <Typography variant="h6">
                Just a sec, verifying account...
              </Typography>
              <CircularProgress style={{ margin: 16 }} color="secondary" />
            </>
          )}
          {!isLoading && !errorMsg && currentUser && (
            <>
              <Typography variant="h4">
                Hey, {currentUser?.username}!
              </Typography>
              <br />
              <Typography variant="h6">
                Your email verification was successful.
              </Typography>
              <Typography variant="h6"> Welcome to Storymap.</Typography>
              <Button
                size="small"
                variant={"contained"}
                color={"primary"}
                onClick={() => history.push("/")}
                style={{ margin: 8 }}
              >
                Tell your story
              </Button>
            </>
          )}
          {!isLoading && errorMsg && (
            <>
              <Typography variant="h4" color="secondary">
                Oops! Something went wrong.
              </Typography>
              <br />
              <Typography variant="h6">{errorMsg}</Typography>
            </>
          )}
        </Paper>
      </div>
    </div>
  );
}
