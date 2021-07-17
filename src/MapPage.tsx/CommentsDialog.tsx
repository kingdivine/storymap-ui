import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import {
  Button,
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
import SendIcon from "@material-ui/icons/Send";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useHistory } from "react-router-dom";

const COMMENTS_PER_PAGE = 50; //actually limited by backend
const COMMENT_CHAR_LENGTH_LIMIT = 1000;

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
    listContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    viewMoreBtn: {
      alignSelf: "center",
      width: "fit-content",
      padding: theme.spacing(1),
      margin: theme.spacing(1),
    },
    loginToCommentBtn: {
      width: "fit-content",
      margin: theme.spacing(2),
      alignSelf: "center",
    },
    newCommentInput: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
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
  totalCommentCount: number;
  storyId: string;
  onClose: () => void;
}) {
  const classes = useStyles();
  let history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [userInput, setUserInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isCreateCommentError, setIsCreateCommentError] = useState(false);

  const [currentUser] = useLocalStorage("currentUser", null);

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

  const handleFetchMoreClick = () => {
    setIsLoadingMore(true);
    const newOffset = offset + COMMENTS_PER_PAGE;
    axios
      .get(`/storymap-api/stories/${props.storyId}/comments`, {
        params: {
          offset: newOffset,
        },
      })
      .then((results) => {
        setComments([...comments].concat(results.data));
        setOffset(newOffset);
      })
      .catch((e) => console.log(e))
      .finally(() => setIsLoadingMore(false));
  };

  const handleCommentSubmit = () => {
    if (isSubmittingComment) {
      return;
    }
    setIsSubmittingComment(true);
    setIsCreateCommentError(false);

    axios
      .post(
        `/storymap-api/comments`,
        { content: userInput, storyId: props.storyId },
        {
          headers: {
            authorization: `Bearer ${currentUser.token}`,
          },
        }
      )
      .then((result) => {
        setUserInput("");
        setComments([...comments].concat(result.data));
      })
      .catch((e) => {
        setIsCreateCommentError(true);
      })
      .finally(() => setIsSubmittingComment(false));
  };

  const canSubmit = () =>
    userInput.length > 0 &&
    userInput.length <= COMMENT_CHAR_LENGTH_LIMIT &&
    !isSubmittingComment;

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"sm"}
      open={true}
      onClose={props.onClose}
    >
      <div className={classes.topLineContainer}>
        <div />
        <Typography style={{ width: "50%" }} color={"textSecondary"}>
          {props.totalCommentCount === 1
            ? "1 Comment"
            : `${props.totalCommentCount} Comments`}
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
          <div className={classes.listContainer}>
            {comments.length > 0 && (
              <>
                {comments.map((comment) => (
                  <CommentListItem key={comment.id} comment={comment} />
                ))}
                {props.totalCommentCount > comments.length && (
                  <Button
                    color="primary"
                    size="small"
                    className={classes.viewMoreBtn}
                    disabled={isLoadingMore}
                    onClick={() => handleFetchMoreClick()}
                  >
                    {isLoadingMore ? (
                      <CircularProgress size={20} />
                    ) : (
                      "View more"
                    )}
                  </Button>
                )}
              </>
            )}
            {comments.length === 0 && <NoComments />}
          </div>
          {!currentUser && (
            <Button
              variant="contained"
              className={classes.loginToCommentBtn}
              color="primary"
              onClick={() => history.push("/login")}
            >
              Login or Signup to leave a comment
            </Button>
          )}
          {currentUser && (
            <TextField
              className={classes.newCommentInput}
              placeholder="Add comment..."
              multiline
              rowsMax={6}
              variant="outlined"
              error={isCreateCommentError}
              onChange={(e) =>
                e.target.value.length <= COMMENT_CHAR_LENGTH_LIMIT &&
                setUserInput(e.target.value)
              }
              helperText={
                userInput.length > COMMENT_CHAR_LENGTH_LIMIT * 0.75
                  ? `${userInput.length}/${COMMENT_CHAR_LENGTH_LIMIT} characters.`
                  : null
              }
              size="small"
              value={userInput}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleCommentSubmit}
                    disabled={!canSubmit()}
                  >
                    {isSubmittingComment ? (
                      <CircularProgress size={20} />
                    ) : (
                      <SendIcon fontSize={"small"} />
                    )}
                  </IconButton>
                ),
              }}
            />
          )}

          {isCreateCommentError && (
            <Typography style={{ margin: 16 }} color={"error"}>
              Oops! Something went wrong!
            </Typography>
          )}
        </>
      )}
    </Dialog>
  );
}
