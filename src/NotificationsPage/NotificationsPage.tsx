import { useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Divider,
  CircularProgress,
  Button,
} from "@material-ui/core";
import Heading from "../Generic/Heading";
import Footer from "../Generic/Footer";
import { Notification } from "../types/Notification";
import axios from "axios";
import NotificationListItem from "./NotificationListItem";
import UsernameAndPic from "../Generic/UsernameandPic";
import { NotificationCounts } from "../types/NotificationCounts";

const NOTIFS_PER_PAGE = 20; //matches backend

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContent: {
      marginTop: "15vh",
      marginLeft: "auto",
      marginRight: "auto",
      width: "65%",
      textAlign: "center",
    },
    section: {
      textAlign: "start",
      marginTop: theme.spacing(3),
      maxHeight: "65vh",
      overflowY: "scroll",
    },
    loadingIndicator: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 8,
      marginBottom: 8,
    },
    noDataContainer: {
      textAlign: "center",
      margin: theme.spacing(1),
    },
    viewMoreBtnContainer: {
      textAlign: "center",
      margin: theme.spacing(1),
    },
  })
);

export default function NotificationsPage(props: {}) {
  const classes = useStyles();

  const [currentUser] = useCurrentUser();

  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalNotifsCount, setTotalNotifsCount] = useState(0);

  useEffect(() => {
    axios
      .get(`/storymap-api/notifications`, {
        headers: {
          authorization: `Bearer ${currentUser?.token}`,
        },
        params: {
          offset: 0,
        },
      })
      .then((response) => setNotifications(response.data))
      .catch((e) => {
        setIsError(true);
        console.log(e);
      })
      .finally(() => setIsLoading(false));
  }, [currentUser?.token]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    axios
      .get<NotificationCounts>("/storymap-api/notifications/counts", {
        headers: {
          authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then((response) => setTotalNotifsCount(response.data.total))
      .catch((e) => console.log(e));
  }, [currentUser]);

  //mark as read call
  useEffect(() => {
    if (notifications.length === 0 || !currentUser) {
      return;
    }
    const notificationIds = notifications
      .filter((n) => !n.is_read)
      .map((n) => n.id);
    axios
      .post(
        `/storymap-api/notifications`,
        { notificationIds },
        {
          headers: {
            authorization: `Bearer ${currentUser.token}`,
          },
        }
      )
      .then((result) => {})
      .catch((e) => {
        console.log(e);
      });
  }, [currentUser, notifications]);

  const handleFetchMoreClick = () => {
    setIsLoadingMore(true);
    const newOffset = offset + NOTIFS_PER_PAGE;
    axios
      .get(`/storymap-api/notifications`, {
        headers: {
          authorization: `Bearer ${currentUser?.token}`,
        },
        params: {
          offset: newOffset,
        },
      })
      .then((results) => {
        setNotifications(notifications.concat(results.data));
        setOffset(newOffset);
      })
      .catch((e) => console.log(e))
      .finally(() => setIsLoadingMore(false));
  };

  return (
    currentUser && (
      <>
        <Heading />
        <div className={classes.mainContent}>
          <UsernameAndPic
            username={currentUser.username}
            userId={currentUser.id}
          />
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
              {notifications.length === 0 && (
                <div className={classes.noDataContainer}>
                  <Typography color="secondary">
                    You're all caught up!
                  </Typography>
                  <Typography color="textPrimary">
                    No recent notifications to show.
                  </Typography>
                </div>
              )}
              {notifications.map((notification) => (
                <NotificationListItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
              {totalNotifsCount > notifications.length && (
                <div className={classes.viewMoreBtnContainer}>
                  <Button
                    color="primary"
                    size="small"
                    disabled={isLoadingMore}
                    onClick={() => handleFetchMoreClick()}
                  >
                    {isLoadingMore ? (
                      <CircularProgress size={20} />
                    ) : (
                      "View more"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </>
    )
  );
}
