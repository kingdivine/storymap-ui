import { Typography } from "@material-ui/core";
import moment from "moment";
import { Notification } from "../types/Notification";

export default function NotificationListItem(props: {
  notification: Notification;
}) {
  const { notification } = props;
  return (
    <div key={notification.id}>
      <Typography color={"textSecondary"}>
        {moment(notification.created_at).fromNow()}
      </Typography>
    </div>
  );
}
