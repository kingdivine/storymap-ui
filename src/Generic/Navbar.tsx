import { useState, useEffect } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import axios from "axios";
import { createStyles, Theme, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NotificationCounts } from "../types/NotificationCounts";
import Heading from "./Heading";
import { useHistory } from "react-router";
import BottomBar from "./BottomBar";
import TopBar from "./TopBar";
import { isMobile } from "../utils";

const smallScreen = isMobile();

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

export default function Navbar(props: { fetchNotifs: boolean }) {
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

  if (smallScreen) {
    return (
      <>
        <Heading /> <BottomBar notificationsCount={unreadNotifsCount} />
      </>
    );
  }

  return (
    <>
      <Heading /> <TopBar notificationsCount={unreadNotifsCount} />
    </>
  );
}
