import { useState, useEffect } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import axios from "axios";
import { NotificationCounts } from "../types/NotificationCounts";
import Heading from "./Heading";
import BottomBar from "./BottomBar";
import TopBar from "./TopBar";
import { isMobile, storymapApiUrl } from "../utils";

const smallScreen = isMobile();

export default function Navbar(props: { fetchNotifs: boolean }) {
  const [currentUser] = useCurrentUser();

  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  useEffect(() => {
    if (!currentUser || !props.fetchNotifs) {
      return;
    }
    axios
      .get<NotificationCounts>(`${storymapApiUrl}/notifications/counts`, {
        headers: {
          authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then((response) => setUnreadNotifsCount(response.data.un_read))
      .catch((e) => console.log(e));
  }, [currentUser, props.fetchNotifs]);

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
