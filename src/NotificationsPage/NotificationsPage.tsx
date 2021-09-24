import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import Heading from "../Generic/Heading";
import Footer from "../Generic/Footer";
import { Notification } from "../types/Notification";
import axios from "axios";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContent: {
      marginTop: "15vh",
      marginLeft: "auto",
      marginRight: "auto",
      width: "50%",
      textAlign: "center",
    },
    userNameAndPicContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    section: {
      display: "flex",
      flexDirection: "column",
      textAlign: "start",
      marginTop: theme.spacing(3),
    },
    loadingIndicator: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 8,
      marginBottom: 8,
    },
  })
);

export default function NotificationsPage(props: {}) {
  const classes = useStyles();

  const [currentUser] = useLocalStorage("currentUser", null);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [offset] = useState(0);

  useEffect(() => {
    axios
      .get(`/storymap-api/notifications`, {
        headers: {
          authorization: `Bearer ${currentUser.token}`,
        },
        params: {
          offset,
        },
      })
      .then((response) => setNotifications(response.data))
      .catch((e) => {
        setIsError(true);
        console.log(e);
      })
      .finally(() => setIsLoading(false));
  }, [offset, currentUser?.token]);

  return (
    <>
      <Heading />
      <div className={classes.mainContent}>
        <div className={classes.userNameAndPicContainer}>
          <Avatar src="/broken-image.jpg" style={{ marginLeft: -2 }} />
          <Typography style={{ margin: 8 }} color="textPrimary">
            {currentUser.username}
          </Typography>
        </div>
        <Divider style={{ margin: 8 }} />
        {isError && (
          <>
            <Typography
              style={{ marginTop: 8 }}
              variant="h5"
              color={"secondary"}
            >
              Oops! Something went wrong.
            </Typography>
            <Typography
              style={{ marginTop: 8 }}
              variant={"h6"}
              color="textPrimary"
            >
              Please check your internet connection and try again.
            </Typography>
          </>
        )}
        {isLoading && (
          <CircularProgress
            className={classes.loadingIndicator}
            color="secondary"
          />
        )}
        {!isLoading && (
          <div className={classes.section}>
            {notifications.map((notif) => (
              <div key={notif.id}> {notif.id} </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
