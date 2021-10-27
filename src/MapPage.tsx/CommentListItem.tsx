import { useState } from "react";
import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Comment } from "../types/Comment";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ContextMenuIcon from "@material-ui/icons/MoreVert";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import moment from "moment";
import UsernameAndPic from "../Generic/UsernameandPic";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    itemContainer: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(2),
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    topLineContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "start",
      alignItems: "center",
      marginBottom: theme.spacing(1),
    },
    content: {
      maxHeight: "90px",
      overflowY: "scroll",
      textOverflow: "ellipsis",
      marginLeft: theme.spacing(6),
    },
    actionsContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
    },
    likeBtnAndCount: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
);

export default function CommentListItem(props: {
  comment: Comment;
  onLikeClick: (operation: "add" | "remove", commentId: string) => void;
  onDeleteClick: (commentId: string) => void;
  isSubmittingLike: boolean;
  commentBeingDeleted: string;
  userId: string | null;
}) {
  const classes = useStyles();
  const { comment } = props;

  const [contextMenuAnchor, setContextMenuAnchor] =
    useState<null | HTMLElement>(null);

  const userLikedComment = () =>
    comment.liker_ids &&
    comment.liker_ids.findIndex((id) => id === props.userId) > -1;

  const getOperation = () => {
    if (userLikedComment()) return "remove";
    return "add";
  };

  const isBeingDeleted = () => props.commentBeingDeleted === comment.id;

  return (
    <div className={classes.itemContainer}>
      <div>
        <div className={classes.topLineContainer}>
          <UsernameAndPic
            username={comment.author_username}
            userId={comment.author_id}
            avatar={comment.author_avatar}
          />
          <Typography color={"textSecondary"} style={{ marginLeft: 8 }}>
            {moment(comment.created_at).fromNow()}
          </Typography>
        </div>

        <div className={classes.content}>
          <Typography variant="body2">{comment.content}</Typography>
        </div>
      </div>

      <div className={classes.actionsContainer}>
        <div>
          {comment.author_id === props.userId && (
            <IconButton
              onClick={(e) => setContextMenuAnchor(e.currentTarget)}
              size="small"
            >
              <ContextMenuIcon />
            </IconButton>
          )}
          <Menu
            id="simple-menu"
            anchorEl={contextMenuAnchor}
            keepMounted
            open={Boolean(contextMenuAnchor)}
            onClose={() => setContextMenuAnchor(null)}
          >
            <MenuItem
              //prevent deletion of multiple comments at once
              disabled={props.commentBeingDeleted !== ""}
              onClick={() => props.onDeleteClick(comment.id)}
              style={{ display: "flex", alignItems: "flex-start" }}
            >
              {isBeingDeleted() ? (
                <CircularProgress size={20} style={{ marginRight: 4 }} />
              ) : (
                <DeleteForeverIcon
                  fontSize="small"
                  style={{ marginRight: 4 }}
                />
              )}
              Delete
            </MenuItem>
          </Menu>
        </div>
        <div className={classes.likeBtnAndCount}>
          <IconButton
            size="small"
            disabled={props.isSubmittingLike || isBeingDeleted()}
            onClick={() => props.onLikeClick(getOperation(), comment.id)}
          >
            <FavoriteIcon
              color={userLikedComment() ? "secondary" : "inherit"}
            />
          </IconButton>
          <Typography>{comment.liker_ids?.length ?? 0}</Typography>
        </div>
      </div>
    </div>
  );
}
