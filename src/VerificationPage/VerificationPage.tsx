import { useRef, useState, useEffect } from "react";
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
import axios from "axios";
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
    verificationContainer: {
      marginTop: "25vh",
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
          setErrorMsg("Invalid link or user already verified.");
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
      <Heading />
      <div className={classes.verificationContainer}>
        <Paper className={classes.paper}>
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
              <Typography variant="h4">Hey {currentUser?.username}!</Typography>
              <br />
              <Typography variant="h6" align="center">
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
              <Typography variant="h5" align="center" color="error">
                Oops! Something went wrong.
              </Typography>
              <br />
              <Typography variant="body1" align="center">
                {errorMsg}
              </Typography>
            </>
          )}
        </Paper>
      </div>
    </div>
  );
}
