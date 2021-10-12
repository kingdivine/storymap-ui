import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import moment from "moment";
import UsernameAndPic from "../Generic/UsernameandPic";
import { Notification } from "../types/Notification";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing(1),
    },
    nameAndAction: {
      display: "flex",
      alignItems: "center",
    },
  })
);

export default function NotificationListItem(props: {
  notification: Notification;
}) {
  const classes = useStyles();

  const { notification } = props;
  const actionText =
    notification.action_type === "like" ? "liked" : "commented on";

  return (
    <div key={notification.id} className={classes.listItem}>
      <div className={classes.nameAndAction}>
        <UsernameAndPic
          username={notification.creator_username}
          userId={notification.creator_id}
        />
        <Typography color={"textPrimary"}>
          {actionText} your {notification.target_type}
        </Typography>
      </div>
      <Typography color={"textSecondary"}>
        {moment(notification.created_at).fromNow()}
      </Typography>
    </div>
  );
}
