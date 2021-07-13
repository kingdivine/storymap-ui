import { useEffect, useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CommentIcon from "@material-ui/icons/Comment";
import ShareIcon from "@material-ui/icons/Share";

import axios from "axios";
import moment from "moment";
import { useLocalStorage } from "../hooks/useLocalStorage";

import LoginToContinueDialog from "../Generic/LoginToContinueDialog";
import CommentsDialog from "./CommentsDialog";
import { StoryDetail } from "../types/StoryDetail";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topLineContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing(1, 3, 0, 3),
    },
    loadingIndicator: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 8,
      marginBottom: 8,
    },
    secondLineContainer: { padding: theme.spacing(1, 3, 2, 3) },
    userNameAndPicContainer: {
      display: "flex",
      alignItems: "center",
    },
    dateAndCloseBtn: {
      display: "flex",
      alignItems: "center",
    },
    tagsContainer: {
      display: "flex",
      "&>*": {
        marginRight: theme.spacing(1),
      },
    },
    storyActionsContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
    },
    storyAction: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      "&>*": {
        marginRight: 2,
      },
    },
  })
);

export default function ViewPostDialog(props: {
  storySlug: string;
  closePost: () => void;
}) {
  const classes = useStyles();

  const [currentUser] = useLocalStorage("currentUser", null);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [story, setStory] = useState<StoryDetail>();

  const [submittingLike, setSubmittingLike] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const [commentsViewOpen, setCommentsViewOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/storymap-api/storiesBySlug/${props.storySlug}`
        );
        setStory(response.data);
      } catch (e) {
        setIsError(true);
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [props.storySlug, currentUser?.id]);

  const userLikedStory = () =>
    story!.likers.findIndex((l: any) => l.id === currentUser?.id) > -1;

  const updateLikers = (operation: "add" | "remove") => {
    if (operation === "add") {
      const updatedLikers = [
        ...story!.likers,
        { id: currentUser.id, username: currentUser.username },
      ];
      setStory({
        ...story!,
        likers: updatedLikers,
      });
    } else {
      const updatedLikers = story!.likers.filter(
        (l: any) => l.id !== currentUser?.id
      );
      setStory({ ...story!, likers: updatedLikers });
    }
  };

  const handleLikeClick = () => {
    if (!currentUser) {
      setLoginDialogOpen(true);
      return;
    }
    if (submittingLike) {
      return;
    }
    setSubmittingLike(true);
    if (!userLikedStory()) {
      updateLikers("add");
      axios
        .post(
          `/storymap-api/stories/${story!.id}/like`,
          {},
          {
            headers: {
              authorization: `Bearer ${currentUser.token}`,
            },
          }
        )
        .then((result) => {})
        .catch((e) => {
          updateLikers("remove");
        })
        .finally(() => setSubmittingLike(false));
    } else {
      updateLikers("remove");
      axios
        .delete(`/storymap-api/stories/${story!.id}/like`, {
          headers: {
            authorization: `Bearer ${currentUser.token}`,
          },
        })
        .then((result) => {})
        .catch((e) => {
          updateLikers("add");
        })
        .finally(() => setSubmittingLike(false));
    }
  };

  return (
    <>
      {!commentsViewOpen && (
        <Dialog
          fullWidth={true}
          maxWidth={"md"}
          open={true}
          onClose={props.closePost}
          style={{ border: "1px solid" }}
        >
          {isLoading && (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton style={{ marginLeft: 8 }} onClick={props.closePost}>
                  <CloseIcon />
                </IconButton>
              </div>
              <CircularProgress
                className={classes.loadingIndicator}
                color="secondary"
              />
            </>
          )}
          {isError && <div>Oops!</div>}
          {!isLoading && !isError && story && (
            <>
              <div>
                <div className={classes.topLineContainer}>
                  <div className={classes.userNameAndPicContainer}>
                    <Avatar
                      src="/broken-image.jpg"
                      style={{ marginLeft: -2 }}
                    />
                    <Typography style={{ margin: 8 }}>
                      {story.author_name}
                    </Typography>
                  </div>
                  <div className={classes.dateAndCloseBtn}>
                    <Typography color={"textSecondary"}>
                      {moment(story.created_at).fromNow()}
                    </Typography>
                    <IconButton
                      style={{ marginLeft: 8 }}
                      onClick={props.closePost}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
              <div className={classes.secondLineContainer}>
                <Typography variant="h5" color={"secondary"}>
                  {story.title}
                </Typography>
                <Typography variant="h6" color={"primary"}>
                  {story.place_name}
                </Typography>
              </div>

              <DialogContent>
                <DialogContentText color="textPrimary">
                  {story.content}
                </DialogContentText>
                <div className={classes.tagsContainer}>
                  {story.tags.map((tag: string) => (
                    <Typography color="primary">#{tag}</Typography>
                  ))}
                </div>
                <div className={classes.storyActionsContainer}>
                  <div className={classes.storyAction}>
                    <IconButton size="small" onClick={() => handleLikeClick()}>
                      <FavoriteIcon
                        style={{ marginBottom: 2 }}
                        color={userLikedStory() ? "secondary" : "inherit"}
                      />
                    </IconButton>
                    <Typography>{story.likers.length} Likes</Typography>
                  </div>
                  <div className={classes.storyAction}>
                    {/** TODO: try -> Navigator.share(), if not -> document.execCommand("copy")} */}
                    <IconButton size="small" onClick={() => {}} disabled>
                      <ShareIcon />
                    </IconButton>
                    <Typography style={{ color: "grey" }}>Share</Typography>
                  </div>
                  <div className={classes.storyAction}>
                    <IconButton
                      size="small"
                      onClick={() => setCommentsViewOpen(true)}
                    >
                      <CommentIcon />
                    </IconButton>
                    <Typography> {story.comment_count} Comments</Typography>
                  </div>
                </div>
              </DialogContent>
            </>
          )}
        </Dialog>
      )}
      {commentsViewOpen && (
        <CommentsDialog
          storyId={story!.id}
          onClose={() => setCommentsViewOpen(false)}
        />
      )}
      {loginDialogOpen && (
        <LoginToContinueDialog
          icon={
            <FavoriteIcon
              style={{ width: "100%", height: "100%" }}
              color={"secondary"}
            />
          }
          message={`Join Storymap to like ${story!.author_name}'s Story.`}
          onCloseDialog={() => setLoginDialogOpen(false)}
        />
      )}
    </>
  );
}
