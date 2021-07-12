import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import {
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import CommentIcon from "@material-ui/icons/Comment";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Comment } from "../types/Comment";
import CommentListItem from "./CommentListItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topLineContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      margin: theme.spacing(1),
    },
    loadingIndicator: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 8,
      marginBottom: 8,
    },
    newCommentInput: {
      margin: theme.spacing(2),
    },
  })
);

function NoComments() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CommentIcon color={"disabled"} style={{ height: 120, width: 120 }} />
      <Typography color={"textSecondary"}>No comments to display</Typography>
    </div>
  );
}

export default function CommentsDialog(props: {
  storyId: string;
  onClose: () => void;
}) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/storymap-api/stories/${props.storyId}/comments`
        );
        setComments(response.data);
      } catch (e) {
        setIsError(true);
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [props.storyId]);

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"sm"}
      open={true}
      onClose={props.onClose}
      style={{ border: "1px solid" }}
    >
      <div className={classes.topLineContainer}>
        <div />
        <Typography style={{ width: "50%" }} color={"textSecondary"}>
          {comments.length === 1 ? "1 comment" : `${comments.length} comments`}
        </Typography>
        <IconButton onClick={props.onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      {isLoading && (
        <CircularProgress
          className={classes.loadingIndicator}
          color="secondary"
        />
      )}
      {isError && <div>Oops!</div>}
      {!isError && !isLoading && (
        <>
          <div style={{ maxHeight: "90%", overflowY: "scroll" }}>
            {comments.length > 0 &&
              comments.map((comment) => <CommentListItem comment={comment} />)}
            {comments.length === 0 && <NoComments />}
          </div>
          <TextField
            className={classes.newCommentInput}
            placeholder="Add comment..."
            multiline
            rowsMax={6}
            variant="outlined"
            size="small"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </>
      )}
    </Dialog>
  );
}
