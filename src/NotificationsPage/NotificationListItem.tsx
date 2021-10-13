import {
  createStyles,
  Link,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import UsernameAndPic from "../Generic/UsernameandPic";
import { Notification } from "../types/Notification";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing(1.5),
    },
    nameAndText: {
      display: "flex",
      alignItems: "center",
    },
    text: { display: "flex", marginLeft: theme.spacing(0.5) },
  })
);

const truncateString = (text: string, charLimit: number) =>
  text.length > charLimit ? text.slice(0, charLimit) + "..." : text;

export default function NotificationListItem(props: {
  notification: Notification;
}) {
  const classes = useStyles();

  const { notification } = props;
  const actionText =
    notification.action_type === "like" ? "liked" : "commented on";
  const targetText =
    notification.target_type === "story"
      ? notification.target_story_title
      : `"${truncateString(notification.target_comment_content ?? "", 25)}"`;

  return (
    <div className={classes.listItem}>
      <div className={classes.nameAndText}>
        <UsernameAndPic
          username={notification.creator_username}
          userId={notification.creator_id}
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
      <Typography color={"textSecondary"}>
        {moment(notification.created_at).fromNow()}
      </Typography>
    </div>
  );
}
