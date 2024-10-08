import { useEffect, useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CircularProgress from "@material-ui/core/CircularProgress";
import { IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CommentIcon from "@material-ui/icons/Comment";
import ShareIcon from "@material-ui/icons/Share";
import ContextMenuIcon from "@material-ui/icons/MoreVert";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import LockIcon from "@material-ui/icons/Lock";

import axios from "axios";
import moment from "moment";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { useSnackbar } from "notistack";

import LoginToContinueDialog from "../Generic/LoginToContinueDialog";
import CommentsDialog from "./CommentsDialog";
import { StoryDetail } from "../types/StoryDetail";
import UsernameAndPic from "../Generic/UsernameandPic";
import DeleteStoryDialog from "./DeleteStoryDialog";
import { isMobile, storymapApiUrl } from "../utils";
import ImageDisplay from "./ImageDisplay";

const smallScreen = isMobile();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topLineContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing(1, 3, 0, 3),
      marginTop: theme.spacing(1),
    },
    loadingIndicator: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    titleAndLockIcon: {
      display: "flex",
      alignItems: "center",
    },
    secondLineContainer: { padding: theme.spacing(1, 3, 2, 3) },
    dateAndCloseBtn: {
      display: "flex",
      alignItems: "center",
    },
    tagsContainer: {
      display: "flex",
      "&>*": {
        marginRight: theme.spacing(1),
      },
      marginBottom: theme.spacing(2),
    },
    storyActionsContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginBottom: theme.spacing(2),
    },
    storyAction: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
  })
);

export default function ViewPostDialog(props: {
  storySlug: string;
  closePost: () => void;
}) {
  const classes = useStyles();

  const [currentUser] = useCurrentUser();

  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [story, setStory] = useState<StoryDetail>();

  const [submittingLike, setSubmittingLike] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const [isCommentsViewOpen, setIsCommentsViewOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const [contextMenuAnchor, setContextMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const headers = currentUser
          ? {
              authorization: `Bearer ${currentUser?.token}`,
            }
          : {};
        const response = await axios.get(
          `${storymapApiUrl}/storiesBySlug/${props.storySlug}`,
          {
            headers,
          }
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
  }, [props.storySlug, currentUser]);

  useEffect(() => {
    setCommentCount(parseInt(story?.comment_count ?? "0"));
  }, [story?.comment_count]);

  const userLikedStory = () =>
    story!.likers.findIndex((l: any) => l.id === currentUser?.id) > -1;

  const updateLikers = (operation: "add" | "remove") => {
    if (operation === "add") {
      const updatedLikers = [
        ...story!.likers,
        { id: currentUser!.id, username: currentUser!.username },
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
      setIsLoginDialogOpen(true);
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
          `${storymapApiUrl}/stories/${story!.id}/like`,
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
        .delete(`${storymapApiUrl}/stories/${story!.id}/like`, {
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

  const handleShareClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        enqueueSnackbar("Link copied to clipboard.", {
          autoHideDuration: 2500,
          key: "shareStory",
          preventDuplicate: true,
        });
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      {!isCommentsViewOpen && (
        <Dialog
          fullScreen={smallScreen}
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
          {isError && (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton style={{ marginLeft: 8 }} onClick={props.closePost}>
                  <CloseIcon />
                </IconButton>
              </div>
              <Typography
                style={{ marginTop: 8, alignSelf: "center" }}
                color={"error"}
              >
                Oops! Something went wrong.
              </Typography>
              <Typography
                style={{ marginTop: 8, marginBottom: 24, alignSelf: "center" }}
              >
                Please check your internet connection and try again later.
              </Typography>
            </>
          )}
          {!isLoading && !isError && story && (
            <>
              <div>
                <div className={classes.topLineContainer}>
                  <UsernameAndPic
                    username={story.author_name}
                    userId={story.author_id}
                    avatar={story.author_avatar}
                  />
                  <div className={classes.dateAndCloseBtn}>
                    <Typography color={"textSecondary"}>
                      {moment(story.created_at).fromNow(true)}
                    </Typography>
                    {story.author_id === currentUser?.id && (
                      <IconButton
                        onClick={(e) => setContextMenuAnchor(e.currentTarget)}
                        size={smallScreen ? "small" : "medium"}
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
                      MenuListProps={{
                        disablePadding: true,
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          setContextMenuAnchor(null);
                          setIsDeleteDialogOpen(true);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          minHeight: 0,
                        }}
                      >
                        <DeleteForeverIcon
                          fontSize="small"
                          style={{ marginRight: 4 }}
                        />
                        Delete
                      </MenuItem>
                    </Menu>
                    <IconButton
                      size={smallScreen ? "small" : "medium"}
                      onClick={props.closePost}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
              <div className={classes.secondLineContainer}>
                <div className={classes.titleAndLockIcon}>
                  <Typography variant="h5" color={"primary"}>
                    {story.title}
                  </Typography>
                  {story.is_private && (
                    <div>
                      <LockIcon style={{ marginLeft: 8 }} color="disabled" />
                    </div>
                  )}
                </div>

                <Typography variant="h6" color={"secondary"}>
                  {story.place_name}
                </Typography>
              </div>

              <DialogContent>
                <ImageDisplay imageIds={story.image_ids} />
                <DialogContentText
                  color="textPrimary"
                  style={{ marginBottom: 16, whiteSpace: "pre-line" }}
                >
                  {story.content}
                </DialogContentText>
                <div className={classes.tagsContainer}>
                  {story.tags.map((tag: string) => (
                    <Typography key={tag} color="primary">
                      #{tag}
                    </Typography>
                  ))}
                </div>
                {!story.is_private && (
                  <div className={classes.storyActionsContainer}>
                    <div className={classes.storyAction}>
                      <IconButton
                        size="small"
                        onClick={() => handleLikeClick()}
                      >
                        <FavoriteIcon
                          style={{ marginBottom: 2 }}
                          color={userLikedStory() ? "secondary" : "inherit"}
                        />
                      </IconButton>
                      <Typography variant={"body2"}>
                        {story.likers.length}
                      </Typography>
                    </div>
                    <div className={classes.storyAction}>
                      <IconButton
                        size="small"
                        onClick={() => handleShareClick()}
                      >
                        <ShareIcon />
                      </IconButton>
                    </div>
                    <div className={classes.storyAction}>
                      <IconButton
                        size="small"
                        onClick={() => setIsCommentsViewOpen(true)}
                      >
                        <CommentIcon />
                      </IconButton>
                      <Typography variant={"body2"}>{commentCount}</Typography>
                    </div>
                  </div>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>
      )}
      {isCommentsViewOpen && story && (
        <CommentsDialog
          totalCommentCount={commentCount}
          updateCommentCount={(addition: number) =>
            setCommentCount(commentCount + addition)
          }
          storyId={story.id}
          onClose={() => setIsCommentsViewOpen(false)}
        />
      )}
      {isLoginDialogOpen && (
        <LoginToContinueDialog
          icon={
            <FavoriteIcon
              style={{ width: "100%", height: "100%" }}
              color={"secondary"}
            />
          }
          message={`Join Storymap to like ${story!.author_name}'s Story.`}
          onCloseDialog={() => setIsLoginDialogOpen(false)}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteStoryDialog
          story={story!}
          onCloseDialog={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </>
  );
}
