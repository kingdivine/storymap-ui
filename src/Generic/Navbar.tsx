import { useState, useEffect } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import axios from "axios";
import { createStyles, Theme, Button, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FaceIcon from "@material-ui/icons/Face";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import HelpIcon from "@material-ui/icons/Help";
import { NotificationCounts } from "../types/NotificationCounts";
import Heading from "./Heading";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navBar: {
      position: "fixed",
      right: theme.spacing(5),
      top: theme.spacing(4),
      zIndex: 1,
      display: "flex",
      flexDirection: "row",
    },
    navLinkBtn: {
      textTransform: "lowercase",
      color: theme.palette.common.white,
    },
  })
);

export default function NavBar(props: { fetchNotifs: boolean }) {
  const classes = useStyles();

  const [currentUser] = useCurrentUser();
  const history = useHistory();

  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  useEffect(() => {
    if (!currentUser || !props.fetchNotifs) {
      return;
    }
    axios
      .get<NotificationCounts>("/storymap-api/notifications/counts", {
        headers: {
          authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then((response) => setUnreadNotifsCount(response.data.un_read))
      .catch((e) => console.log(e));
  }, [currentUser, props.fetchNotifs]);

  if (history.location.pathname === "/login") {
    return (
      <>
        <Heading />
        <header className={classes.navBar}>
          <Button href="/about" style={{ textTransform: "none" }}>
            What is Storymap?
          </Button>
        </header>
      </>
    );
  }

  return (
    <>
      <Heading />
      <header className={classes.navBar}>
        {currentUser && (
          <Badge
            badgeContent={unreadNotifsCount}
            max={99}
            showZero={false}
            color="secondary"
            style={{ marginRight: unreadNotifsCount > 0 ? 16 : 0 }}
          >
            <Button
              className={classes.navLinkBtn}
              href="/notifications"
              startIcon={<NotificationsActiveIcon />}
            >
              notifications
            </Button>
          </Badge>
        )}

        {currentUser && (
          <Button
            className={classes.navLinkBtn}
            href={`/users/${currentUser.username}`}
            startIcon={<FaceIcon />}
          >
            my profile
          </Button>
        )}

        {!currentUser && (
          <Button
            className={classes.navLinkBtn}
            href={`/login`}
            startIcon={<PersonPinIcon />}
          >
            login or sign up
          </Button>
        )}

        <Button
          className={classes.navLinkBtn}
          href={`/about`}
          startIcon={<HelpIcon />}
        >
          about
        </Button>
      </header>
    </>
  );
}
