import { CircularProgress, Link, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { CommentDetail } from "../types/CommentDetail";
import { Notification } from "../types/Notification";
export default function NotificationListItemCollapse(props: {
  notification: Notification;
}) {
  const { notification } = props;
  const [comment, setComment] = useState<CommentDetail>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const commentId =
      notification.action_type === "like" &&
      notification.target_type === "comment"
        ? notification.target_id
        : notification.comment_id;
    axios
      .get(`/storymap-api/comments/${commentId}`)
      .then((response) => setComment(response.data))
      .catch((e) => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [notification]);

  if (isLoading) {
    return (
      <div style={{ margin: 16, textAlign: "center" }}>
        <CircularProgress size={20} />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ margin: 16, textAlign: "center" }}>
        <Typography color={"error"}>Oops! Something went wrong.</Typography>
        <Typography color={"textPrimary"}>
          Please check your internet connection and try again later.
        </Typography>
      </div>
    );
  }

  if (comment) {
    return (
      <div style={{ marginLeft: 48, marginRight: 48, marginBottom: 8 }}>
        {notification.target_type === "comment" && (
          <div style={{ display: "flex" }}>
            <Typography color={"textSecondary"}>Re:</Typography>
            <Typography style={{ marginLeft: 4 }}>
              <Link
                href={`/story/${comment.story_slug}`}
                color="secondary"
                underline="none"
              >
                {comment.story_title}
              </Link>
            </Typography>
          </div>
        )}
        <Typography color={"textPrimary"}>{`"${comment.content}"`}</Typography>
      </div>
    );
  }

  return null;
}
