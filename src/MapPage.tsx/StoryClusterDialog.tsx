import {
  Dialog,
  Typography,
  IconButton,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router";
import UsernameAndPic from "../Generic/UsernameandPic";
import { Story } from "../types/Story";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topLineContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      margin: theme.spacing(1),
    },
    listItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      marginBottom: theme.spacing(1),
    },
  })
);

export default function StoryClusterDialog(props: {
  posts: Story[];
  onCloseDialog: () => void;
}) {
  const { posts, onCloseDialog } = props;
  const classes = useStyles();
  let history = useHistory();

  return (
    <Dialog onClose={() => onCloseDialog()} open={true}>
      <div style={{ margin: 8, padding: 16 }}>
        <div className={classes.topLineContainer}>
          <div />
          <Typography color={"textSecondary"}>
            {`${posts.length} Stories`}
          </Typography>
          <IconButton onClick={() => onCloseDialog()}>
            <CloseIcon />
          </IconButton>
        </div>
        <div>
          {posts.map((post) => (
            <div className={classes.listItem} key={post.id}>
              <UsernameAndPic
                userId={post.author_id}
                username={post.author_username}
                avatar={post.author_avatar}
                small
              />

              <Typography
                variant={"body1"}
                style={{ marginLeft: 38, cursor: "pointer" }}
                onClick={() => history.push(`/story/${post.slug}`)}
                color={"primary"}
              >
                {post.title}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
