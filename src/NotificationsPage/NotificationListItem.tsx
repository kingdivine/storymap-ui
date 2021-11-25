import {
  Collapse,
  createStyles,
  IconButton,
  Link,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import UsernameAndPic from "../Generic/UsernameandPic";
import { Notification } from "../types/Notification";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { useState } from "react";
import NotificationListItemCollapse from "./NotificationListItemCollapse";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    unReadIndicator: {
      height: 8,
      width: 8,
      borderRadius: "100%",
      backgroundColor: theme.palette.secondary.main,
      marginRight: theme.spacing(1),
    },
    nameAndTextAndInidicator: {
      display: "flex",
      alignItems: "center",
    },
    text: { display: "flex", marginLeft: theme.spacing(0.5) },
    expandIconAndDate: { display: "flex", alignItems: "center" },
  })
);

const truncateString = (text: string, charLimit: number) =>
  text.length > charLimit ? text.slice(0, charLimit) + "..." : text;

export default function NotificationListItem(props: {
  notification: Notification;
}) {
  const classes = useStyles();
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const { notification } = props;
  const actionText =
    notification.action_type === "like" ? "liked" : "commented on";
  const targetText =
    notification.target_type === "story"
      ? notification.target_story_title
      : `"${truncateString(notification.target_comment_content ?? "", 25)}"`;
  const allowCollapse =
    (notification.action_type === "like" &&
      notification.target_type === "comment") ||
    (notification.action_type === "comment" &&
      notification.target_type === "story");

  return (
    <>
      <div className={classes.listItem}>
        <div className={classes.nameAndTextAndInidicator}>
          <div
            className={classes.unReadIndicator}
            style={{ visibility: notification.is_read ? "hidden" : "visible" }}
          />
          <UsernameAndPic
            username={notification.creator_username}
            userId={notification.creator_id}
            avatar={notification.creator_avatar}
            small
          />
          <div className={classes.text}>
            <Typography color={"textPrimary"}>
              {`${actionText} your ${notification.target_type}`}
            </Typography>
            {notification.target_type === "story" ? (
              <Typography style={{ marginLeft: 4 }}>
                <Link
                  href={`/story/${notification.target_story_slug}`}
                  color="secondary"
                  underline="none"
                >
                  {targetText}
                </Link>
              </Typography>
            ) : (
              <Typography style={{ marginLeft: 4 }} color="textPrimary">
                {targetText}
              </Typography>
            )}
          </div>
        </div>
        <div className={classes.expandIconAndDate}>
          <Typography color={"textSecondary"}>
            {moment(notification.created_at).fromNow(true)}
          </Typography>
          <IconButton
            style={{
              visibility: allowCollapse ? "visible" : "hidden",
            }}
            onClick={() => setIsCollapseOpen(!isCollapseOpen)}
          >
            {isCollapseOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>
      </div>
      <Collapse in={isCollapseOpen} timeout={250} unmountOnExit>
        <NotificationListItemCollapse notification={notification} />
      </Collapse>
    </>
  );
}
