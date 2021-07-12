import { Avatar, Typography } from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Comment } from "../types/Comment";

import FavoriteIcon from "@material-ui/icons/Favorite";
import moment from "moment";

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
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing(1),
    },
    userNameAndPicContainer: {
      display: "flex",
      alignItems: "center",
    },
    content: {
      maxHeight: "90px",
      overflowY: "scroll",
      textOverflow: "ellipsis",
      marginLeft: theme.spacing(6),
    },
    likeIcon: {
      alignSelf: "center",
      marginLeft: theme.spacing(1),
    },
  })
);

export default function CommentListItem(props: { comment: Comment }) {
  const classes = useStyles();
  const { comment } = props;
  return (
    <div className={classes.itemContainer}>
      <div>
        <div className={classes.topLineContainer}>
          <div className={classes.userNameAndPicContainer}>
            <Avatar src="/broken-image.jpg" style={{ marginLeft: -2 }} />
            <Typography style={{ margin: 8 }}>
              {comment.author_username}
            </Typography>
          </div>
          <Typography color={"textSecondary"}>
            {moment(comment.created_at).fromNow()}
          </Typography>
        </div>

        <div className={classes.content}>
          <Typography variant="body2">{comment.content}</Typography>
        </div>
      </div>

      <FavoriteIcon className={classes.likeIcon} />
    </div>
  );
}
